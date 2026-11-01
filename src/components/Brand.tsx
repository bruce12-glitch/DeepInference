export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand${compact ? " brand--compact" : ""}`} translate="no">
      {compact ? (
        <svg className="brand__mark" viewBox="0 0 48 48" aria-hidden="true">
          <path
            d="M7 8h12c13 0 22 6 22 16s-9 16-22 16H7V8Zm8 7v18h4c8 0 14-3 14-9s-6-9-14-9h-4Z"
            fill="currentColor"
            fillRule="evenodd"
          />
          <path d="M20 19h6v10h-6z" fill="currentColor" />
        </svg>
      ) : (
        <span className="brand__wordmark" aria-label="DeepInference">
          DEEP<span>INFERENCE</span>
        </span>
      )}
    </span>
  );
}
