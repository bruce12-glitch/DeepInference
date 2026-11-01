export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand" translate="no">
      <svg className="brand__mark" viewBox="0 0 32 32" aria-hidden="true">
        <rect x="2" y="2" width="12" height="12" rx="3" fill="currentColor" />
        <rect x="18" y="2" width="12" height="12" rx="3" fill="var(--accent)" />
        <rect x="2" y="18" width="12" height="12" rx="3" fill="var(--accent)" />
        <path d="M18 18h12v12H18z" fill="currentColor" />
        <path d="M22 22h4v4h-4z" fill="var(--paper)" />
      </svg>
      {compact ? null : (
        <span className="brand__wordmark">
          Deep<span>Inference</span>
        </span>
      )}
    </span>
  );
}
