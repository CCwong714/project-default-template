"use client";

import { Fragment, useEffect, useState } from "react";
import { CctMark } from "./icons";

const navItems = [
  ["Work", "#work"],
  ["Services", "#services"],
  ["About", "#about"],
  ["Blog", "#news"],
];

function BrandCopyRow({ hidden = false }: { hidden?: boolean }) {
  return (
    <span className="brand-copy-row" aria-hidden={hidden || undefined}>
      <strong>COCOTA®</strong>
      <span>Brand &amp; Design Studio</span>
    </span>
  );
}

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navCondensed, setNavCondensed] = useState(false);
  const [navHidden, setNavHidden] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    let frame = 0;
    let previousY = window.scrollY;
    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const nextY = window.scrollY;
        if (!menuOpen) {
          if (nextY > 90) setNavCondensed(true);
          if (nextY < 50) setNavCondensed(false);

          const delta = nextY - previousY;
          if (nextY < 50) setNavHidden(false);
          else if (delta > 2) setNavHidden(true);
          else if (delta < -2) setNavHidden(false);
        } else {
          setNavHidden(false);
        }
        previousY = nextY;
        frame = 0;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [menuOpen]);

  return (
    <header
      className={`site-nav${navCondensed && !menuOpen ? " nav-condensed" : ""}${menuOpen ? " menu-is-open" : ""}`}
    >
      <div className={navHidden && !menuOpen ? "site-nav-bar is-hidden" : "site-nav-bar"}>
        <a className="brand brand-desktop" href="#home" aria-label="Cocota home">
          <span className="nav-copy">
            <BrandCopyRow />
            <BrandCopyRow hidden />
          </span>
        </a>
        <a className="brand-compact" href="#home" aria-label="Cocota home">
          <CctMark />
        </a>
        <a className="brand-mobile" href="#home" aria-label="Cocota home">
          <CctMark />
        </a>

        <nav className="desktop-links" aria-label="Main navigation">
          {navItems.map(([label, href], index) => (
            <Fragment key={label}>
              <a href={href}>
                <span className="nav-copy">
                  <span>{label}</span>
                  <span aria-hidden="true">{label}</span>
                </span>
              </a>
              {index < navItems.length - 1 ? <span aria-hidden="true">,&nbsp;</span> : null}
            </Fragment>
          ))}
        </nav>

        <div className="nav-actions">
          <a className="talk-pill" href="#contact">
            <span className="talk-pill-label">Let&apos;s talk!</span>
          </a>
          <span className="language" aria-label="Language selector">
            <a className="language-link is-active" href="#home" aria-current="page">
              En
            </a>
            <span aria-hidden="true">,</span>
            <a className="language-link" href="https://cocotastudio.com/es/">
              Es
            </a>
          </span>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? "CLOSE" : "MENU"}
          </button>
        </div>
      </div>

      <div className={menuOpen ? "mobile-menu is-open" : "mobile-menu"} id="mobile-menu">
        <div className="mobile-menu-top">
          <span>English, Español</span>
          <a href="mailto:hola@cocotastudio.com">JUST SAY HI!</a>
        </div>
        <nav aria-label="Mobile navigation">
          {[...navItems, ["Contact", "#contact"]].map(([label, href]) => (
            <a href={href} key={label} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
        <div className="mobile-menu-bottom">
          <a href="mailto:hola@cocotastudio.com">hola@cocotastudio.com</a>
          <a href="tel:+34910584172">(+34) 910 584 172</a>
        </div>
      </div>
    </header>
  );
}
