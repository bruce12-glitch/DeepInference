import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GqaSimulationResult } from "../data/deepInferenceData";

// Pre-allocated scratch math objects at module scope (Zero GC in render loop)
const _mat4 = new THREE.Matrix4();
const _pos = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _scale = new THREE.Vector3();
const _color = new THREE.Color();
const _camGoalPos = new THREE.Vector3();
const _camGoalTarget = new THREE.Vector3();

export type EvictionPolicyView = "page-entro" | "naive-union";
export type CameraPreset = "isometric" | "waveguides" | "page-table" | "blueprint-top";
export type FinishPreset = "terracotta-anodized" | "titanium-brushed" | "obsidian-carbon";

interface ThreeKvTopologySceneProps {
  simResult: GqaSimulationResult;
  kvBudgetPct: number;
  onKvBudgetChange: (val: number) => void;
  gqaGroupSize: number;
  onGqaGroupChange: (val: number) => void;
  isFullViewport: boolean;
  onToggleFullViewport: () => void;
}

function createProceduralGridTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#141413";
  ctx.fillRect(0, 0, 512, 512);

  // Subtle carbon hairline subdivisions
  ctx.strokeStyle = "#242421";
  ctx.lineWidth = 1;
  const step = 32;
  for (let i = 0; i <= 512; i += step) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }

  // Primary Stone/Carbon structural grid lines
  ctx.strokeStyle = "#2E2E2B";
  ctx.lineWidth = 2;
  for (let i = 0; i <= 512; i += 128) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }

  // Crosshair ticks at intersections
  ctx.strokeStyle = "#D97757";
  ctx.lineWidth = 1.5;
  for (let x = 128; x < 512; x += 128) {
    for (let y = 128; y < 512; y += 128) {
      ctx.beginPath();
      ctx.moveTo(x - 6, y);
      ctx.lineTo(x + 6, y);
      ctx.moveTo(x, y - 6);
      ctx.lineTo(x, y + 6);
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 6);
  tex.anisotropy = maxAnisotropy;
  return tex;
}

function createReticleDialTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, 512, 512);
  const cx = 256;
  const cy = 256;

  // Outer telemetry ring
  ctx.strokeStyle = "rgba(217, 119, 87, 0.55)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 220, 0, Math.PI * 2);
  ctx.stroke();

  // Inner sage calibration ring
  ctx.strokeStyle = "rgba(120, 140, 93, 0.5)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 175, 0, Math.PI * 2);
  ctx.stroke();

  // Radial degree ticks
  for (let i = 0; i < 72; i++) {
    const angle = (i / 72) * Math.PI * 2;
    const isMajor = i % 6 === 0;
    const rInner = isMajor ? 196 : 208;
    const rOuter = 220;
    ctx.strokeStyle = isMajor ? "#FAF9F5" : "rgba(250, 249, 245, 0.35)";
    ctx.lineWidth = isMajor ? 2.5 : 1.2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * rInner, cy + Math.sin(angle) * rInner);
    ctx.lineTo(cx + Math.cos(angle) * rOuter, cy + Math.sin(angle) * rOuter);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(128, 128, 16, 128, 128, 124);
  grad.addColorStop(0, "rgba(0, 0, 0, 0.78)");
  grad.addColorStop(0.55, "rgba(0, 0, 0, 0.32)");
  grad.addColorStop(1, "rgba(0, 0, 0, 0.0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

function createRoundedRectShape(w: number, h: number, r: number): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  return shape;
}

export function ThreeKvTopologyScene({
  simResult,
  kvBudgetPct,
  onKvBudgetChange,
  gqaGroupSize,
  onGqaGroupChange,
  isFullViewport,
  onToggleFullViewport,
}: ThreeKvTopologySceneProps) {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);

  const [policyView, setPolicyView] = useState<EvictionPolicyView>("page-entro");
  const [explodedPct, setExplodedPct] = useState<number>(22);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("isometric");
  const [finishPreset, setFinishPreset] = useState<FinishPreset>("terracotta-anodized");
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);

  // Store mutable state in refs so WebGL animation loop reads latest values without re-mounting
  const stateRef = useRef({
    simResult,
    policyView,
    explodedPct,
    cameraPreset,
    finishPreset,
    cameraTransitionActive: false,
  });

  useEffect(() => {
    stateRef.current.simResult = simResult;
    stateRef.current.policyView = policyView;
    stateRef.current.explodedPct = explodedPct;
    stateRef.current.finishPreset = finishPreset;
  }, [simResult, policyView, explodedPct, finishPreset]);

  const handleSelectCameraPreset = (preset: CameraPreset) => {
    setCameraPreset(preset);
    stateRef.current.cameraPreset = preset;
    stateRef.current.cameraTransitionActive = true;
  };

  // Keyboard shortcut 'H' to toggle HUD dock collapse and 'Escape' to exit full viewport
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      if (e.key === "h" || e.key === "H") {
        setDockCollapsed((prev) => !prev);
      } else if (e.key === "Escape" && isFullViewport) {
        onToggleFullViewport();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFullViewport, onToggleFullViewport]);

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    // 1. Detect software WebGL from GPU renderer string
    const isSoftwareGl = (() => {
      const probeCanvas = document.createElement("canvas");
      const gl = probeCanvas.getContext("webgl2");
      if (!gl) return true;
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 960;
    const height = container.clientHeight || 580;

    const scene = new THREE.Scene();
    const bgHex = 0x141413;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.022);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 150);
    camera.position.set(11.5, 9.2, 12.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: "high-performance",
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 2. Studio Environment Map via RoomEnvironment + PMREMGenerator
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    // 3. Balanced 3-Point Studio Lighting Rig (Warm Key + Cool Hemisphere + Rim)
    const hemiLight = new THREE.HemisphereLight(0xdce8f8, 0x26231f, 0.85);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1e0, 2.4);
    keyLight.position.set(10, 16, 10);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 2;
    keyLight.shadow.camera.far = 38;
    const d = 9.5;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd97757, 1.35);
    rimLight.position.set(-12, 8, -11);
    scene.add(rimLight);

    // 4. OrbitControls with exponential damping
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.minDistance = 5.5;
    controls.maxDistance = 28;
    controls.target.set(0, 1.4, 0);
    controls.update();

    controls.addEventListener("start", () => {
      stateRef.current.cameraTransitionActive = false;
    });

    // =========================================================================
    // 5. COMPOSITE 9-PART PROCEDURAL HBM3e GQA TENSOR CORE MODEL (THREE.Group)
    //    Pivoted at bottom-center flush with y = 0
    // =========================================================================
    const rootAssembly = new THREE.Group();
    rootAssembly.position.set(0, 0, 0);
    scene.add(rootAssembly);

    // Ground Floor Plane with Procedural Blueprint Grid Texture
    const gridTex = createProceduralGridTexture(maxAnisotropy);
    const floorGeo = new THREE.PlaneGeometry(48, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      map: gridTex,
      roughness: 0.88,
      metalness: 0.12,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Part 9: Soft Radial Contact Shadow Plane at y = 0.015 (polygonOffset prevents Z-fighting)
    const shadowTex = createContactShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(13.5, 13.5);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.015;
    rootAssembly.add(contactShadow);

    // Part 1 (Primary Silhouette): Beveled Silicon Interposer Base Substrate (ExtrudeGeometry)
    const baseShape = createRoundedRectShape(8.4, 8.4, 0.55);
    const baseExtrudeGeo = new THREE.ExtrudeGeometry(baseShape, {
      depth: 0.45,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelSegments: 4,
    });
    baseExtrudeGeo.rotateX(-Math.PI / 2);
    const substrateMat = new THREE.MeshStandardMaterial({
      color: 0x1e1e1c,
      roughness: 0.42,
      metalness: 0.82,
    });
    const substrateMesh = new THREE.Mesh(baseExtrudeGeo, substrateMat);
    substrateMesh.position.y = 0.1;
    substrateMesh.castShadow = true;
    substrateMesh.receiveShadow = true;
    rootAssembly.add(substrateMesh);

    // Part 2 (Secondary Read): Anodized Cryogenic Bus Carrier Ring (ExtrudeGeometry with cutout)
    const carrierOuter = createRoundedRectShape(7.4, 7.4, 0.4);
    const carrierHole = createRoundedRectShape(6.2, 6.2, 0.25);
    carrierOuter.holes.push(carrierHole);
    const carrierGeo = new THREE.ExtrudeGeometry(carrierOuter, {
      depth: 0.28,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.06,
      bevelSegments: 3,
    });
    carrierGeo.rotateX(-Math.PI / 2);
    const accentFrameMat = new THREE.MeshPhysicalMaterial({
      color: 0xd97757,
      roughness: 0.22,
      metalness: 0.85,
      clearcoat: 0.5,
    });
    const carrierMesh = new THREE.Mesh(carrierGeo, accentFrameMat);
    carrierMesh.position.y = 0.58;
    carrierMesh.castShadow = true;
    carrierMesh.receiveShadow = true;
    rootAssembly.add(carrierMesh);

    // Part 3 (Secondary Read): 4 Lathe-Turned Rényi-2 Entropy Accumulator Towers at Corners (LatheGeometry)
    const lathePoints = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(0.42, 0.0),
      new THREE.Vector2(0.42, 0.25),
      new THREE.Vector2(0.28, 0.35),
      new THREE.Vector2(0.44, 0.55),
      new THREE.Vector2(0.28, 0.75),
      new THREE.Vector2(0.44, 0.95),
      new THREE.Vector2(0.26, 1.15),
      new THREE.Vector2(0.36, 1.45),
      new THREE.Vector2(0.18, 1.65),
      new THREE.Vector2(0.0, 1.65),
    ];
    const towerGeo = new THREE.LatheGeometry(lathePoints, 24);
    const towerMat = new THREE.MeshStandardMaterial({
      color: 0xc6613f,
      roughness: 0.18,
      metalness: 0.92,
    });
    const towerGroup = new THREE.Group();
    const cornerOffsets = [
      [-3.5, -3.5],
      [3.5, -3.5],
      [-3.5, 3.5],
      [3.5, 3.5],
    ];
    cornerOffsets.forEach(([cx, cz]) => {
      const tower = new THREE.Mesh(towerGeo, towerMat);
      tower.position.set(cx, 0.55, cz);
      tower.castShadow = true;
      tower.receiveShadow = true;
      towerGroup.add(tower);
    });
    rootAssembly.add(towerGroup);

    // Part 4 (Accent Detail): 48 Gold-Plated Micro-Bump Bus Pins around Perimeter (InstancedMesh > 20 items)
    const pinGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.24, 12);
    const pinMat = new THREE.MeshStandardMaterial({
      color: 0xd4883a,
      roughness: 0.2,
      metalness: 0.95,
    });
    const pinCount = 48;
    const pinInstanced = new THREE.InstancedMesh(pinGeo, pinMat, pinCount);
    let pinIdx = 0;
    for (let side = 0; side < 4; side++) {
      for (let i = 0; i < 12; i++) {
        const offset = -2.75 + i * 0.5;
        let px = 0;
        let pz = 0;
        if (side === 0) {
          px = offset;
          pz = -3.85;
        } else if (side === 1) {
          px = offset;
          pz = 3.85;
        } else if (side === 2) {
          px = -3.85;
          pz = offset;
        } else {
          px = 3.85;
          pz = offset;
        }
        _pos.set(px, 0.68, pz);
        _quat.identity();
        _scale.set(1, 1, 1);
        _mat4.compose(_pos, _quat, _scale);
        pinInstanced.setMatrixAt(pinIdx++, _mat4);
      }
    }
    pinInstanced.instanceMatrix.needsUpdate = true;
    pinInstanced.computeBoundingSphere();
    rootAssembly.add(pinInstanced);

    // Part 5 (Core Telemetry Subject): 64 Physical HBM3e KV-Cache Pages (8x8 InstancedMesh)
    const pageGeo = new THREE.BoxGeometry(0.58, 1.0, 0.58);
    // Shift geometry so y=0 is the bottom of each KV page block
    pageGeo.translate(0, 0.5, 0);
    const pageMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.28,
      metalness: 0.55,
    });
    const totalPages = 64;
    const pageInstanced = new THREE.InstancedMesh(pageGeo, pageMat, totalPages);
    pageInstanced.castShadow = true;
    pageInstanced.receiveShadow = true;
    pageInstanced.frustumCulled = false;

    const currentHeights = new Float32Array(totalPages).fill(0.4);
    for (let i = 0; i < totalPages; i++) {
      const row = Math.floor(i / 8);
      const col = i % 8;
      const x = (col - 3.5) * 0.72;
      const z = (row - 3.5) * 0.72;
      _pos.set(x, 0.62, z);
      _quat.identity();
      _scale.set(1, 0.5, 1);
      _mat4.compose(_pos, _quat, _scale);
      pageInstanced.setMatrixAt(i, _mat4);
      _color.setHex(0x788c5d);
      pageInstanced.setColorAt(i, _color);
    }
    pageInstanced.instanceMatrix.needsUpdate = true;
    if (pageInstanced.instanceColor) pageInstanced.instanceColor.needsUpdate = true;
    rootAssembly.add(pageInstanced);

    // Part 6 (Secondary Read): 8 Query-Head Optical Waveguide Conduits (TubeGeometry)
    // Represents GQA Group Pooling: 8 Query Heads converging into the shared physical KV Page Bank
    const waveguideGroup = new THREE.Group();
    const waveguideMat = new THREE.MeshPhysicalMaterial({
      color: 0xd97757,
      roughness: 0.15,
      metalness: 0.8,
      clearcoat: 0.8,
    });
    const headNodeGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.18, 20);
    const headNodeMat = new THREE.MeshStandardMaterial({
      color: 0xfaf9f5,
      roughness: 0.25,
      metalness: 0.7,
    });

    for (let h = 0; h < 8; h++) {
      const angle = (h / 8) * Math.PI * 2;
      const outerR = 2.65;
      const innerR = 0.85;
      const startPt = new THREE.Vector3(
        Math.cos(angle) * outerR,
        3.2,
        Math.sin(angle) * outerR
      );
      const midPt1 = new THREE.Vector3(
        Math.cos(angle) * (outerR * 0.75),
        2.55,
        Math.sin(angle) * (outerR * 0.75)
      );
      const midPt2 = new THREE.Vector3(
        Math.cos(angle) * innerR,
        2.05,
        Math.sin(angle) * innerR
      );
      const endPt = new THREE.Vector3(
        Math.cos(angle) * 0.45,
        1.55,
        Math.sin(angle) * 0.45
      );
      const curve = new THREE.CatmullRomCurve3([startPt, midPt1, midPt2, endPt]);
      const tubeGeo = new THREE.TubeGeometry(curve, 24, 0.055, 10, false);
      const tubeMesh = new THREE.Mesh(tubeGeo, waveguideMat);
      tubeMesh.castShadow = true;
      waveguideGroup.add(tubeMesh);

      const headPort = new THREE.Mesh(headNodeGeo, headNodeMat);
      headPort.position.copy(startPt);
      waveguideGroup.add(headPort);
    }
    rootAssembly.add(waveguideGroup);

    // Part 7 (Secondary Read): Upper GQA Rényi-2 Pooling Router Bridge (ExtrudeGeometry)
    const upperBridgeGroup = new THREE.Group();
    const bridgeShape = createRoundedRectShape(5.8, 5.8, 0.65);
    const bridgeHole = createRoundedRectShape(3.6, 3.6, 0.45);
    bridgeShape.holes.push(bridgeHole);
    const bridgeGeo = new THREE.ExtrudeGeometry(bridgeShape, {
      depth: 0.22,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 3,
    });
    bridgeGeo.rotateX(-Math.PI / 2);
    const bridgeMat = new THREE.MeshStandardMaterial({
      color: 0x2e2e2b,
      roughness: 0.2,
      metalness: 0.9,
    });
    const bridgeMesh = new THREE.Mesh(bridgeGeo, bridgeMat);
    bridgeMesh.castShadow = true;
    upperBridgeGroup.add(bridgeMesh);

    // Part 8 (Accent Detail): Procedural Calibration Dial Reticle Plate on Upper Bridge
    const reticleTex = createReticleDialTexture(maxAnisotropy);
    const reticleGeo = new THREE.PlaneGeometry(4.6, 4.6);
    const reticleMat = new THREE.MeshBasicMaterial({
      map: reticleTex,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const reticleMesh = new THREE.Mesh(reticleGeo, reticleMat);
    reticleMesh.rotation.x = -Math.PI / 2;
    reticleMesh.position.y = 0.28;
    upperBridgeGroup.add(reticleMesh);

    upperBridgeGroup.position.y = 3.25;
    rootAssembly.add(upperBridgeGroup);

    // Pre-compile shaders on hardware GPUs
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // 6. Animation & Paced Render Loop (with afterDraw fenceSync on Software WebGL)
    let frameId = 0;
    let isDisposed = false;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      if (isDisposed) return;
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === "function") {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (isDisposed) return;
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    }

    function tick() {
      if (isDisposed) return;
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      const dampAlpha = 1 - Math.exp(-7.5 * dt);

      const {
        simResult: curSim,
        policyView: curPolicy,
        explodedPct: curExplode,
        cameraPreset: curCam,
        finishPreset: curFinish,
        cameraTransitionActive,
      } = stateRef.current;

      // Update finish materials smoothly
      if (curFinish === "terracotta-anodized") {
        accentFrameMat.color.setHex(0xd97757);
        towerMat.color.setHex(0xc6613f);
        substrateMat.color.setHex(0x1e1e1c);
      } else if (curFinish === "titanium-brushed") {
        accentFrameMat.color.setHex(0xa6a49b);
        towerMat.color.setHex(0x788c5d);
        substrateMat.color.setHex(0x282825);
      } else {
        accentFrameMat.color.setHex(0x2e2e2b);
        towerMat.color.setHex(0xd4883a);
        substrateMat.color.setHex(0x141413);
      }

      // Smooth Exploded-View Layer Separation via exponential damping
      const explodeOffset = (curExplode / 100) * 2.2;
      upperBridgeGroup.position.y = THREE.MathUtils.lerp(
        upperBridgeGroup.position.y,
        3.1 + explodeOffset * 1.15,
        dampAlpha
      );
      waveguideGroup.position.y = THREE.MathUtils.lerp(
        waveguideGroup.position.y,
        explodeOffset * 0.55,
        dampAlpha
      );
      carrierMesh.position.y = THREE.MathUtils.lerp(
        carrierMesh.position.y,
        0.58 + explodeOffset * 0.18,
        dampAlpha
      );

      // Update 64 Instanced Physical HBM KV-Cache Pages based on live simulation state (zero idle bobbing)
      const pages = curSim.pageStates;
      for (let i = 0; i < totalPages; i++) {
        const page = pages[i];
        const row = Math.floor(i / 8);
        const col = i % 8;
        const x = (col - 3.5) * 0.72;
        const z = (row - 3.5) * 0.72;

        const state =
          curPolicy === "page-entro" ? page.pageEntroState : page.naiveState;

        let targetH = 0.22;
        if (state === "sink") {
          // Terracotta Clay (#D97757): Protected Attention Sink Page
          targetH = 1.65;
          _color.setHex(0xd97757);
        } else if (state === "compressed") {
          // Sage Olive (#788C5D): Optimal Rényi-2 Pooled KV Page
          targetH = 0.72 + page.entropyScore * 0.75;
          _color.setHex(0x788c5d);
        } else if (state === "fragmented-union") {
          // Amber Ochre (#D4883A): Naive Head-Independent Union Over-Retrieval Bloat
          targetH = 1.28;
          _color.setHex(0xd4883a);
        } else {
          // Carbon (#262623): Evicted / Freed HBM Page Slot
          targetH = 0.16;
          _color.setHex(0x282825);
        }

        currentHeights[i] = THREE.MathUtils.lerp(
          currentHeights[i],
          targetH,
          dampAlpha
        );

        _pos.set(x, 0.62, z);
        _quat.identity();
        _scale.set(1, currentHeights[i], 1);
        _mat4.compose(_pos, _quat, _scale);
        pageInstanced.setMatrixAt(i, _mat4);
        pageInstanced.setColorAt(i, _color);
      }
      pageInstanced.instanceMatrix.needsUpdate = true;
      if (pageInstanced.instanceColor) {
        pageInstanced.instanceColor.needsUpdate = true;
      }

      // Smooth damped camera preset choreography
      if (cameraTransitionActive) {
        if (curCam === "isometric") {
          _camGoalPos.set(11.5, 9.2, 12.5);
          _camGoalTarget.set(0, 1.4, 0);
        } else if (curCam === "waveguides") {
          _camGoalPos.set(0.2, 4.8, 9.2);
          _camGoalTarget.set(0, 2.4, 0);
        } else if (curCam === "page-table") {
          _camGoalPos.set(6.4, 5.2, 6.4);
          _camGoalTarget.set(0, 0.9, 0);
        } else {
          _camGoalPos.set(0.01, 16.5, 0.01);
          _camGoalTarget.set(0, 0, 0);
        }
        camera.position.lerp(_camGoalPos, dampAlpha);
        controls.target.lerp(_camGoalTarget, dampAlpha);
        if (camera.position.distanceTo(_camGoalPos) < 0.08) {
          stateRef.current.cameraTransitionActive = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    frameId = requestAnimationFrame(tick);

    const handleResize = () => {
      if (!container || isDisposed) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    window.addEventListener("resize", handleResize);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      gridTex.dispose();
      reticleTex.dispose();
      shadowTex.dispose();
      envTexture.dispose();
      renderer.dispose();
    };
  }, []);

  const activeUor =
    policyView === "page-entro" ? simResult.pageEntroUor : simResult.naiveUor;
  const activeGib =
    policyView === "page-entro" ? simResult.pageEntroGib : simResult.naiveGib;

  return (
    <div
      className={
        isFullViewport
          ? "fixed inset-0 z-50 w-screen h-screen bg-[#141413] overflow-hidden"
          : "relative w-full h-[640px] bg-[#141413] border border-[#2E2E2B] rounded-[20px] overflow-hidden"
      }
    >
      {/* Dedicated WebGL Mount Container (Outside React HUD Siblings) */}
      <div ref={canvasMountRef} className="w-full h-full" />

      {/* Minimal Top-Left Spec Badge (Zero Center Viewport Occlusion) */}
      <div className="pointer-events-auto absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3">
        <div
          className="inline-flex items-center gap-3 px-4 py-2.5 rounded-[16px] border border-[#2E2E2B]"
          style={{ backgroundColor: "rgba(20, 20, 19, 0.92)" }}
        >
          <span className="font-mono-tabular text-xs font-medium text-[#D97757]">
            HBM3e GQA DIE
          </span>
          <span className="text-[#2E2E2B]" aria-hidden="true">
            |
          </span>
          <span className="text-xs font-medium text-[#FAF9F5]">
            {policyView === "page-entro"
              ? "Page-EntroKV (Rényi-2 Group-Pooled)"
              : "Naive Head-Independent Top-K (Union Bloat)"}
          </span>
          <span className="text-[#2E2E2B]" aria-hidden="true">
            |
          </span>
          <span
            className={`badge-telemetry ${
              policyView === "page-entro"
                ? "badge-telemetry--optimal"
                : "badge-telemetry--warning"
            }`}
            style={{ color: "#FAF9F5" }}
          >
            UOR: {activeUor.toFixed(2)}× · {activeGib} GiB
          </span>
        </div>

        {/* Fullscreen / Exit Fullscreen Toggle */}
        <div className="flex items-center gap-2">
          <div
            className="hidden sm:inline-flex items-center gap-3 px-3.5 py-2 rounded-[12px] border border-[#2E2E2B] text-xs text-[#A6A49B]"
            style={{ backgroundColor: "rgba(20, 20, 19, 0.92)" }}
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-[3px] bg-[#D97757] inline-block" />
              Sink
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-[3px] bg-[#788C5D] inline-block" />
              Compressed KV
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-[3px] bg-[#D4883A] inline-block" />
              Union Bloat
            </span>
          </div>

          <button
            type="button"
            onClick={onToggleFullViewport}
            className="px-4 py-2 rounded-full text-xs font-medium border border-[#2E2E2B] text-[#FAF9F5] hover:border-[#D97757] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            style={{ backgroundColor: "rgba(30, 30, 28, 0.95)" }}
          >
            {isFullViewport ? "Exit Fullscreen (Esc)" : "Expand 100vw × 100vh"}
          </button>
        </div>
      </div>

      {/* Unified Collapsible Bottom Control Dock (<= 15% Viewport Footprint, Solid RGBA Surface, Zero Backdrop-Blur) */}
      <div
        className="pointer-events-auto absolute left-1/2 bottom-3 transition-transform duration-200"
        style={{
          width: "min(920px, 95%)",
          transform: dockCollapsed
            ? "translate(-50%, calc(100% - 34px))"
            : "translate(-50%, 0)",
        }}
      >
        {/* Collapse / Expand Drawer Handle */}
        <div className="flex justify-center mb-1.5">
          <button
            type="button"
            onClick={() => setDockCollapsed((prev) => !prev)}
            className="px-3.5 py-1 rounded-full text-[11px] font-medium text-[#A6A49B] hover:text-[#FAF9F5] border border-[#2E2E2B] transition-colors whitespace-nowrap cursor-pointer"
            style={{ backgroundColor: "rgba(20, 20, 19, 0.95)" }}
          >
            {dockCollapsed
              ? "▴ Show Controls (H)"
              : "▾ Hide Controls · Zen Mode (H)"}
          </button>
        </div>

        {/* Main Bottom Control Bar */}
        <div
          className="rounded-[18px] border border-[#2E2E2B] px-4 py-3 grid grid-cols-1 lg:grid-cols-12 gap-3 items-center"
          style={{
            backgroundColor: "rgba(30, 30, 28, 0.96)",
            boxShadow: "rgba(0, 0, 0, 0.45) 0px 12px 28px 0px",
          }}
        >
          {/* 1. Eviction Policy Mode Switcher */}
          <div className="lg:col-span-4 flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-[#A6A49B] tracking-tight">
              Eviction Policy Mode
            </span>
            <div className="grid grid-cols-2 p-1 rounded-full bg-[#141413] border border-[#2E2E2B] gap-1">
              <button
                type="button"
                onClick={() => setPolicyView("page-entro")}
                className={`px-2.5 py-1.5 rounded-full text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer text-center ${
                  policyView === "page-entro"
                    ? "bg-[#788C5D] text-[#141413]"
                    : "text-[#A6A49B] hover:text-[#FAF9F5]"
                }`}
              >
                Page-EntroKV (1.0×)
              </button>
              <button
                type="button"
                onClick={() => setPolicyView("naive-union")}
                className={`px-2.5 py-1.5 rounded-full text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer text-center ${
                  policyView === "naive-union"
                    ? "bg-[#D4883A] text-[#141413]"
                    : "text-[#A6A49B] hover:text-[#FAF9F5]"
                }`}
              >
                Naive Top-K ({simResult.naiveUor}×)
              </button>
            </div>
          </div>

          {/* 2. Exploded Die Separation & KV Budget Sliders */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-[11px] text-[#A6A49B] mb-1">
                <span>Exploded Stack</span>
                <span className="font-mono-tabular text-[#FAF9F5]">
                  {explodedPct}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={explodedPct}
                onChange={(e) => setExplodedPct(Number(e.target.value))}
                className="telemetry-slider"
                aria-label="Exploded view separation"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-[#A6A49B] mb-1">
                <span>KV Page Budget</span>
                <span className="font-mono-tabular text-[#FAF9F5]">
                  {kvBudgetPct}%
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={50}
                step={5}
                value={kvBudgetPct}
                onChange={(e) => onKvBudgetChange(Number(e.target.value))}
                className="telemetry-slider"
                aria-label="KV page budget percentage"
              />
            </div>
          </div>

          {/* 3. Camera View Presets & Surface Finish */}
          <div className="lg:col-span-4 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="type-utility text-[#A6A49B]">
                Camera & Die Finish
              </span>
              <div className="inline-flex items-center gap-1.5">
                {(
                  [
                    ["terracotta-anodized", "#D97757", "Terracotta"],
                    ["titanium-brushed", "#788C5D", "Titanium"],
                    ["obsidian-carbon", "#D4883A", "Obsidian"],
                  ] as const
                ).map(([finishId, swatchHex, label]) => (
                  <button
                    key={finishId}
                    type="button"
                    onClick={() => setFinishPreset(finishId)}
                    title={`Finish: ${label}`}
                    className={`w-4 h-4 rounded-full border cursor-pointer ${
                      finishPreset === finishId
                        ? "border-[#FAF9F5] ring-1 ring-[#FAF9F5]"
                        : "border-[#2E2E2B] opacity-70 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: swatchHex }}
                    aria-label={label}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1">
              {(
                [
                  ["isometric", "Iso Die"],
                  ["waveguides", "GQA Pool"],
                  ["page-table", "KV Bank"],
                  ["blueprint-top", "Planar"],
                ] as const
              ).map(([presetKey, label]) => (
                <button
                  key={presetKey}
                  type="button"
                  onClick={() => handleSelectCameraPreset(presetKey)}
                  className={`px-2 py-1 rounded-[8px] type-utility border transition-colors whitespace-nowrap cursor-pointer ${
                    cameraPreset === presetKey
                      ? "bg-[#E3DACC] text-[#141413] border-[#FAF9F5]"
                      : "bg-[#141413] text-[#A6A49B] border-[#2E2E2B] hover:text-[#FAF9F5]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
