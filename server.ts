import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Please check Settings > Secrets in AI Studio."
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "25mb" }));

  // 1. High-Thinking GQA & Page-EntroKV Reasoning Endpoint (gemini-4-argon + ThinkingLevel.HIGH)
  app.post("/api/gemini/think", async (req, res) => {
    try {
      const { prompt, contextConfig } = req.body;
      if (!prompt || typeof prompt !== "string") {
        res.status(400).json({ error: "A valid prompt string is required." });
        return;
      }

      const ai = getGenAIClient();
      const systemInstruction =
        "You are the Lead Systems Architect at DeepInference (author of Page-EntroKV: Hardware-Aligned, Entropy-Weighted KV-Cache Eviction under Grouped-Query Attention). " +
        "Provide rigorous mathematical derivations, Rényi-2 collision entropy formulations (w_h = softmax(-H_{2,sink}^{(h)} / tau_g)), " +
        "Unit Over-Retrieval (UOR) bounds, and Triton/CUDA PagedAttention kernel insights. Use clear markdown structure and concrete numerical examples.";

      const fullPrompt = contextConfig
        ? `[GQA Hardware Configuration: ${JSON.stringify(contextConfig)}]\n\nQuery: ${prompt}`
        : prompt;

      const response = await ai.models.generateContent({
        model: "gemini-4-argon",
        contents: fullPrompt,
        config: {
          systemInstruction,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
          },
        },
      });

      const parts = response.candidates?.[0]?.content?.parts ?? [];
      let thoughts = "";
      for (const part of parts) {
        const anyPart = part as unknown as Record<string, unknown>;
        if (anyPart.thought && typeof anyPart.text === "string") {
          thoughts += anyPart.text + "\n";
        }
      }

      res.json({
        model: "gemini-4-argon",
        thinkingLevel: "HIGH",
        thoughts: thoughts.trim() || null,
        text: response.text ?? "",
      });
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error("[/api/gemini/think] Error:", errMsg);
      res.status(500).json({
        error: errMsg,
        hint: "If using a paid model like gemini-4-argon, ensure a billing-enabled API key is selected in Settings > Secrets.",
      });
    }
  });

  // 2. Google Search Grounding Endpoint (gemini-3.8-flash + googleSearch)
  app.post("/api/gemini/search", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query || typeof query !== "string") {
        res.status(400).json({ error: "A valid search query is required." });
        return;
      }

      const ai = getGenAIClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: query,
        config: {
          systemInstruction:
            "You are a research intelligence analyst for DeepInference. Synthesize up-to-date benchmarks, arXiv papers, GPU HBM specifications, and LLM serving engine metrics (vLLM, SGLang, TensorRT-LLM, Page-EntroKV) with exact numbers.",
          tools: [{ googleSearch: {} }],
        },
      });

      const rawChunks =
        response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
      const sources: Array<{ title: string; uri: string }> = [];

      for (const chunk of rawChunks) {
        if (chunk.web?.uri) {
          sources.push({
            title: chunk.web.title || chunk.web.uri,
            uri: chunk.web.uri,
          });
        }
      }

      res.json({
        model: "gemini-3.8-flash",
        text: response.text ?? "",
        sources,
      });
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error("[/api/gemini/search] Error:", errMsg);
      res.status(500).json({ error: errMsg });
    }
  });

  // 3. Studio Image Generation Endpoint (gemini-3-pro-image-preview & gemini-nano-banana-2.1)
  app.post("/api/gemini/image", async (req, res) => {
    try {
      const {
        prompt,
        model = "gemini-3-pro-image-preview",
        imageSize = "1K",
        aspectRatio = "16:9",
      } = req.body;

      if (!prompt || typeof prompt !== "string") {
        res.status(400).json({ error: "A valid image prompt is required." });
        return;
      }

      const validSizes = ["1K", "2K", "4K"];
      const validRatios = [
        "1:1",
        "2:3",
        "3:2",
        "3:4",
        "4:3",
        "9:16",
        "16:9",
        "21:9",
      ];

      const selectedSize = validSizes.includes(imageSize) ? imageSize : "1K";
      const selectedRatio = validRatios.includes(aspectRatio)
        ? aspectRatio
        : "16:9";
      const selectedModel =
        model === "gemini-nano-banana-2.1"
          ? "gemini-nano-banana-2.1"
          : "gemini-3-pro-image-preview";

      const ai = getGenAIClient();
      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: selectedRatio,
            imageSize: selectedSize,
          },
        },
      });

      let imageUrl: string | null = null;
      let captionText = "";

      for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType ?? "image/png";
          imageUrl = `data:${mime};base64,${part.inlineData.data}`;
        } else if (part.text) {
          captionText += part.text;
        }
      }

      if (!imageUrl) {
        res.status(502).json({
          error: "Model completed request but did not return an image payload.",
          text: captionText,
        });
        return;
      }

      res.json({
        model: selectedModel,
        imageSize: selectedSize,
        aspectRatio: selectedRatio,
        imageUrl,
        caption: captionText.trim(),
      });
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error("[/api/gemini/image] Error:", errMsg);
      res.status(500).json({
        error: errMsg,
        hint: "Studio image generation (gemini-3-pro-image-preview / gemini-nano-banana-2.1) requires a billing-enabled Gemini API key in Settings > Secrets.",
      });
    }
  });

  // 4. Text-to-Video Generation Endpoint (gemini-omni-1.1-flash via Interactions API)
  app.post("/api/gemini/video", async (req, res) => {
    try {
      const {
        prompt,
        aspectRatio = "16:9",
        duration = "5s",
        resolution = "720p",
      } = req.body;

      if (!prompt || typeof prompt !== "string") {
        res.status(400).json({ error: "A valid video prompt is required." });
        return;
      }

      const validVideoRatio = aspectRatio === "9:16" ? "9:16" : "16:9";
      const validDuration = duration === "10s" ? "10s" : "5s";
      const validResolution = ["360p", "720p", "1080p", "4k"].includes(
        resolution
      )
        ? resolution
        : "720p";

      const ai = getGenAIClient();
      const interaction = await ai.interactions.create(
        {
          model: "gemini-omni-1.1-flash",
          input: prompt,
          background: false,
          store: false,
          stream: false,
          response_format: {
            type: "video",
            aspect_ratio: validVideoRatio,
            duration: validDuration,
            resolution: validResolution,
          },
        },
        { timeout: 300000 }
      );

      const videoPart = interaction.output_video;
      if (videoPart?.data) {
        const mimeType = videoPart.mime_type || "video/mp4";
        res.json({
          model: "gemini-omni-1.1-flash",
          aspectRatio: validVideoRatio,
          duration: validDuration,
          resolution: validResolution,
          videoUrl: `data:${mimeType};base64,${videoPart.data}`,
        });
        return;
      } else if (videoPart?.uri) {
        res.json({
          model: "gemini-omni-1.1-flash",
          aspectRatio: validVideoRatio,
          duration: validDuration,
          resolution: validResolution,
          videoUrl: videoPart.uri,
        });
        return;
      }

      res.status(502).json({
        error: "Interaction completed without returning a video stream.",
      });
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error("[/api/gemini/video] Error:", errMsg);
      res.status(500).json({
        error: errMsg,
        hint: "Video generation with gemini-omni-1.1-flash via the Interactions API requires a billing-enabled Gemini API key in Settings > Secrets.",
      });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DeepInference server running on http://localhost:${PORT}`);
  });
}

startServer();
