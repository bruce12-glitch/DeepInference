import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Brand } from "./Brand";

const NAV_ITEMS = [
  { label: "Runtime", href: "#runtime" },
  { label: "Performance", href: "#performance" },
  { label: "Deployment", href: "#deployment" },
  { label: "Developers", href: "#developers" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="shell header__inner">
        <a href="#top" className="header__brand" aria-label="DeepInference home">
          <Brand />
        </a>

        <nav className="header__nav" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header__actions">
          <a
            className="header__github"
            href="https://github.com/bruce12-glitch/DeepInference"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <a
            className="button button--small button--dark header__cta"
            href="mailto:iambruce0012@gmail.com?subject=DeepInference%20cluster%20benchmark"
          >
            Benchmark your cluster
          </a>
          <button
            type="button"
            className="header__menu-button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
          <div className="shell mobile-nav__inner">
            {NAV_ITEMS.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            ))}
            <a
              href="mailto:iambruce0012@gmail.com?subject=DeepInference%20cluster%20benchmark"
              className="button button--accent"
              onClick={() => setMenuOpen(false)}
            >
              Request a private benchmark
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
