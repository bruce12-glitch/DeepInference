import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Brand } from "./Brand";
const NAV_ITEMS = [
  { label: "Our focus", href: "#platform" },
  { label: "Solutions", href: "#solutions" },
  { label: "Our approach", href: "#approach" },
  { label: "Company", href: "#company" },
];
export function SiteHeader({ onContact }: { onContact: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onClick = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node))
        setMenuOpen(false);
    };
    const media = window.matchMedia("(min-width: 900px)");
    const onWide = () => {
      if (media.matches) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onClick);
    media.addEventListener("change", onWide);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onClick);
      media.removeEventListener("change", onWide);
    };
  }, [menuOpen]);
  return (
    <header className="site-header" ref={headerRef}>
      <div className="shell header__inner">
        <a
          href="#top"
          className="header__brand"
          aria-label="DeepInference home"
        >
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
          <button
            className="button button--small header__cta"
            onClick={onContact}
          >
            Let’s talk <ArrowUpRight size={15} aria-hidden="true" />
          </button>
          <button
            ref={toggleRef}
            type="button"
            className="header__menu-button icon-button"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <X size={23} aria-hidden="true" />
            ) : (
              <Menu size={23} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      <nav
        id="mobile-navigation"
        className="mobile-nav"
        aria-label="Mobile navigation"
        hidden={!menuOpen}
      >
        <div className="shell">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          ))}
          <button
            className="text-link"
            onClick={() => {
              setMenuOpen(false);
              onContact();
            }}
          >
            Talk to the team <ArrowUpRight size={17} aria-hidden="true" />
          </button>
        </div>
      </nav>
    </header>
  );
}
