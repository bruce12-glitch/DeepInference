type Study = "model" | "platform" | "enterprise";

export function ServingStudy({ kind }: { kind: Study }) {
  return (
    <svg className="serving-study" viewBox="0 0 280 140" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1" opacity=".4">
        <path d="M21 26h14m-7-7v14m217 81h14m-7-7v14" />
        <path d="M42 30h196v80H42Z" strokeDasharray="3 4" />
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="1.25">
        {kind === "model" && (
          <>
            <path d="M58 94h164M58 49h164M58 71h164" opacity=".45" />
            {[18, 34, 28, 52, 64, 46, 30, 19, 12].map((height, index) => (
              <rect
                key={index}
                x={61 + index * 18}
                y={94 - height}
                width="11"
                height={height}
                fill="currentColor"
                fillOpacity={index === 4 ? 0.65 : 0.12}
              />
            ))}
          </>
        )}
        {kind === "platform" && (
          <>
            {[50, 70, 90].map((y, row) => (
              <g key={y}>
                <path d={`M56 ${y + 7}h168`} opacity=".45" />
                <rect
                  x={63 + row * 20}
                  y={y}
                  width={47 - row * 3}
                  height="14"
                  fill="currentColor"
                  fillOpacity=".16"
                />
                <rect
                  x={127 + row * 8}
                  y={y}
                  width={76 - row * 4}
                  height="14"
                  fill="currentColor"
                  fillOpacity={row === 1 ? 0.6 : 0.22}
                />
              </g>
            ))}
          </>
        )}
        {kind === "enterprise" && (
          <>
            <rect x="93" y="40" width="112" height="60" strokeDasharray="4 3" />
            <rect
              x="107"
              y="53"
              width="31"
              height="34"
              fill="currentColor"
              fillOpacity=".22"
            />
            <rect
              x="160"
              y="53"
              width="31"
              height="34"
              fill="currentColor"
              fillOpacity=".22"
            />
            <path d="M58 70h49m31 0h22m31 0h31" />
            <path d="M115 62h15m-15 8h15m-15 8h15m38-16h15m-15 8h15m-15 8h15" />
            <circle cx="59" cy="70" r="4" fill="currentColor" />
            <circle cx="221" cy="70" r="4" fill="currentColor" />
          </>
        )}
      </g>
    </svg>
  );
}
