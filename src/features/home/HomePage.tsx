import { type CSSProperties, useEffect, useRef, useState } from "react";
import {
  communityCallout,
  epicLinks,
  featureActions,
  featureItems,
  footerColumns,
  footerCopyright,
  footerLegalLinks,
  footerSocialLinks,
  headerMenus,
  homeLinks,
  industryLinks,
  languageLinks,
  learning,
  licenseCards,
  overviewItems,
  pageNav,
  productItems,
  resourceCards,
  samples,
  uefnActions,
} from "src/features/home/homePageData";

function cssVars(vars: Record<`--${string}`, string>): CSSProperties {
  return vars;
}

type TPageNavHref = (typeof pageNav)[number][2];

const HERO_GRADIENT_SCALE_SCROLL_END = 200;
const HERO_GRADIENT_FADE_SCROLL_END = 300;
const HERO_LOGO_SCALE_SCROLL_END = 500;
const HERO_MASK_FADE_SCROLL_END = 600;
const HERO_TITLE_TRANSITION_SCROLL_DISTANCE = 300;
const HERO_TITLE_EXIT_SCROLL_DISTANCE = 400;
const HERO_TITLE_TRAVEL_DISTANCE = 80;

function clampProgress(value: number): number {
  return Math.max(0, Math.min(value, 1));
}

type THeroPhase = "intro" | "headline" | "cinematic" | "body";

function resolveHeroPhase(progress: number): THeroPhase {
  if (progress < 1 / 3) {
    return "intro";
  }

  if (progress < 2 / 3) {
    return "headline";
  }

  if (progress < 5 / 6) {
    return "cinematic";
  }

  return "body";
}

type TFooterSocialIconProps = {
  label: string;
};

function FooterSocialIcon({ label }: TFooterSocialIconProps) {
  switch (label) {
    case "Facebook":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M14.2 8.15h2.25V4.7A14.4 14.4 0 0 0 13.15 4c-3.26 0-5.5 1.99-5.5 5.64v3.36H4v3.86h3.65V24h4.48v-7.14h3.5l.56-3.86h-4.06V10c0-1.11.31-1.85 2.07-1.85Z" />
        </svg>
      );
    case "Twitch":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M5 3h16v11.1l-4.6 4.6h-3.7L10 21.4H7.2v-2.7H3V7.2L5 3Zm1.8 3.1v9.7h3.9v2.6l2.6-2.6h3.1l2.8-2.8V6.1H6.8Zm4.5 2.6h1.7v5h-1.7v-5Zm4.7 0h1.7v5H16v-5Z" />
        </svg>
      );
    case "Instagram":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path
            d="M7.7 2.8h8.6a4.9 4.9 0 0 1 4.9 4.9v8.6a4.9 4.9 0 0 1-4.9 4.9H7.7a4.9 4.9 0 0 1-4.9-4.9V7.7a4.9 4.9 0 0 1 4.9-4.9Zm0 2A2.9 2.9 0 0 0 4.8 7.7v8.6a2.9 2.9 0 0 0 2.9 2.9h8.6a2.9 2.9 0 0 0 2.9-2.9V7.7a2.9 2.9 0 0 0-2.9-2.9H7.7Z"
            fillRule="evenodd"
          />
          <path d="M12 7.3A4.7 4.7 0 1 1 12 16.7 4.7 4.7 0 0 1 12 7.3Zm0 2A2.7 2.7 0 1 0 12 14.7 2.7 2.7 0 0 0 12 9.3Zm5.2-2.5a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0Z" />
        </svg>
      );
    case "YouTube":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M21.6 7.25a3.1 3.1 0 0 0-2.18-2.2C17.5 4.55 12 4.55 12 4.55s-5.5 0-7.42.5a3.1 3.1 0 0 0-2.18 2.2A32 32 0 0 0 1.9 12a32 32 0 0 0 .5 4.75 3.1 3.1 0 0 0 2.18 2.2c1.92.5 7.42.5 7.42.5s5.5 0 7.42-.5a3.1 3.1 0 0 0 2.18-2.2A32 32 0 0 0 22.1 12a32 32 0 0 0-.5-4.75ZM10 15.45v-6.9L15.75 12 10 15.45Z" />
        </svg>
      );
    case "RSS":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M5.2 16.5a2.3 2.3 0 1 1 0 4.6 2.3 2.3 0 0 1 0-4.6ZM3 9.45c6.37 0 11.55 5.18 11.55 11.55h-3.18A8.38 8.38 0 0 0 3 12.63V9.45Zm0-5.95C12.65 3.5 20.5 11.35 20.5 21h-3.19C17.31 13.1 10.9 6.69 3 6.69V3.5Z" />
        </svg>
      );
    default:
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M14.2 10.4 22.7 0h-2L13.3 9 7.4 0H.6l8.9 13.2L.6 24h2l7.8-9.5 6.2 9.5h6.8l-9.2-13.6Zm-2.8 3.4-.9-1.3L3.3 1.6h3.1l5.8 8.8.9 1.3 7.6 10.8h-3.1l-6.2-8.7Z" />
        </svg>
      );
  }
}

function FooterBackIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 2.4a9.6 9.6 0 1 0 0 19.2 9.6 9.6 0 0 0 0-19.2Zm0 1.8a7.8 7.8 0 1 1 0 15.6 7.8 7.8 0 0 1 0-15.6Zm.65 11.05h-1.3V9.59l-2.5 2.5-.92-.92L12 7.1l4.07 4.07-.92.92-2.5-2.5v5.66Z" />
    </svg>
  );
}

export function HomePage() {
  const pageRef = useRef<HTMLElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const [activeSectionHref, setActiveSectionHref] =
    useState<TPageNavHref | null>(null);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [openCondensedMenu, setOpenCondensedMenu] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const page = pageRef.current;
    if (!page) {
      return undefined;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const hero = page.querySelector<HTMLElement>(".ue-hero");
      const heroHeight = hero ? hero.offsetHeight - window.innerHeight : 1;
      const progress = Math.max(
        0,
        Math.min(window.scrollY / Math.max(heroHeight, 1), 1),
      );
      const viewportHeight = Math.max(window.innerHeight, 1);
      const cinematicProgress = clampProgress(
        (window.scrollY - viewportHeight * 2) / viewportHeight,
      );
      const cinematicScale = 1 - cinematicProgress * 0.5;
      const cinematicBlur = cinematicProgress * 30;
      const cinematicTilt = cinematicProgress * -40;
      const cinematicOpacityProgress = clampProgress(
        cinematicProgress - 0.5,
      );
      const cinematicOpacity =
        1 - Math.min(cinematicOpacityProgress, 0.5);
      const gradientScaleProgress = clampProgress(
        window.scrollY / HERO_GRADIENT_SCALE_SCROLL_END,
      );
      const gradientFadeProgress = clampProgress(
        (window.scrollY - HERO_GRADIENT_SCALE_SCROLL_END) /
          (HERO_GRADIENT_FADE_SCROLL_END -
            HERO_GRADIENT_SCALE_SCROLL_END),
      );
      const gradientScale = 1 + gradientScaleProgress * 0.3;
      const gradientOpacity =
        (1 - gradientScaleProgress * 0.1) * (1 - gradientFadeProgress);
      const logoScale =
        1 +
        clampProgress(window.scrollY / HERO_LOGO_SCALE_SCROLL_END) * 2;
      const maskOpacity =
        0.95 *
        (1 -
          clampProgress(window.scrollY / HERO_MASK_FADE_SCROLL_END));
      const titleOneExitStart =
        viewportHeight - HERO_TITLE_TRANSITION_SCROLL_DISTANCE;
      const titleOneExitProgress = clampProgress(
        (window.scrollY - titleOneExitStart) /
          HERO_TITLE_TRANSITION_SCROLL_DISTANCE,
      );
      const titleTwoEnterProgress = clampProgress(
        (window.scrollY - viewportHeight) /
          HERO_TITLE_TRANSITION_SCROLL_DISTANCE,
      );
      const titleTwoExitProgress = clampProgress(
        (window.scrollY - viewportHeight * 2) /
          HERO_TITLE_EXIT_SCROLL_DISTANCE,
      );
      const titleTwoOpacity = Math.min(
        titleTwoEnterProgress,
        1 - titleTwoExitProgress,
      );
      const titleTwoTranslate =
        -HERO_TITLE_TRAVEL_DISTANCE * (1 - titleTwoEnterProgress) -
        HERO_TITLE_TRAVEL_DISTANCE * titleTwoExitProgress;
      const hintTranslate =
        Math.min(Math.ceil(cinematicProgress), 1) * 72;

      page.style.setProperty("--hero-progress", progress.toFixed(4));
      page.style.setProperty(
        "--hero-gradient-scale",
        gradientScale.toFixed(4),
      );
      page.style.setProperty(
        "--hero-gradient-opacity",
        gradientOpacity.toFixed(4),
      );
      page.style.setProperty(
        "--hero-logo-opacity",
        maskOpacity.toFixed(6),
      );
      page.style.setProperty(
        "--hero-logo-scale",
        logoScale.toFixed(6),
      );
      page.style.setProperty(
        "--hero-title-1-opacity",
        (1 - titleOneExitProgress).toFixed(6),
      );
      page.style.setProperty(
        "--hero-title-1-y",
        `${(titleOneExitProgress * HERO_TITLE_TRAVEL_DISTANCE).toFixed(4)}px`,
      );
      page.style.setProperty(
        "--hero-title-2-opacity",
        titleTwoOpacity.toFixed(6),
      );
      page.style.setProperty(
        "--hero-title-2-y",
        `${titleTwoTranslate.toFixed(4)}px`,
      );
      page.style.setProperty(
        "--hero-hint-y",
        `${hintTranslate.toFixed(4)}px`,
      );
      page.style.setProperty(
        "--hero-cinematic-progress",
        cinematicProgress.toFixed(4),
      );
      page.style.setProperty(
        "--hero-cinematic-scale",
        cinematicScale.toFixed(6),
      );
      page.style.setProperty(
        "--hero-cinematic-blur",
        `${cinematicBlur.toFixed(4)}px`,
      );
      page.style.setProperty(
        "--hero-cinematic-opacity",
        cinematicOpacity.toFixed(4),
      );
      page.style.setProperty(
        "--hero-cinematic-tilt",
        `${cinematicTilt.toFixed(4)}deg`,
      );
      page.dataset.heroPhase = resolveHeroPhase(progress);

      const heroVideo = heroVideoRef.current;
      if (heroVideo) {
        if (window.scrollY === 0) {
          if (!heroVideo.paused) {
            heroVideo.pause();
          }
          if (heroVideo.currentTime !== 0) {
            heroVideo.currentTime = 0;
          }
        } else if (heroVideo.paused && !heroVideo.ended) {
          void heroVideo.play().catch(() => undefined);
        }
      }

      const uefn = page.querySelector<HTMLElement>(".ue-uefn");
      if (uefn) {
        const heading = uefn.querySelector<HTMLElement>("h2");
        const rect =
          heading?.getBoundingClientRect() ?? uefn.getBoundingClientRect();
        const rawUefnProgress =
          (window.innerHeight * 0.47 - rect.top) /
          Math.max(window.innerHeight * 0.66, 1);
        const uefnProgress = Math.max(0, Math.min(rawUefnProgress, 1));
        const copyProgress = Math.max(
          0,
          Math.min((uefnProgress - 0.58) / 0.32, 1),
        );
        uefn.style.setProperty("--uefn-progress", uefnProgress.toFixed(4));
        uefn.style.setProperty("--uefn-copy-progress", copyProgress.toFixed(4));
      }
    };

    const requestUpdate = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(update);
      }
    };

    const revealTargets = page.querySelectorAll("[data-reveal]");

    if (!("IntersectionObserver" in window)) {
      revealTargets.forEach((target) => {
        target.classList.add("is-visible");
      });
      update();
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        rootMargin: "0px 0px 18% 0px",
        threshold: 0.04,
      },
    );

    revealTargets.forEach((target) => {
      observer.observe(target);
    });
    update();

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      observer.disconnect();
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return undefined;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const closeMenuOnDesktop = () => {
      if (window.innerWidth > 860) {
        setIsMobileMenuOpen(false);
      }
    };

    closeMenuOnDesktop();
    window.addEventListener("resize", closeMenuOnDesktop);

    return () => {
      window.removeEventListener("resize", closeMenuOnDesktop);
    };
  }, []);

  useEffect(() => {
    let frame = 0;

    const updateActiveSection = () => {
      frame = 0;
      const activationY = window.scrollY + window.innerHeight * 0.38;
      let currentHref: TPageNavHref | null = null;

      for (const [, , href] of pageNav) {
        const section = document.getElementById(href.slice(1));

        if (!section) {
          continue;
        }

        const top = section.getBoundingClientRect().top + window.scrollY;

        if (top <= activationY) {
          currentHref = href;
        }
      }

      setActiveSectionHref((current) =>
        current === currentHref ? current : currentHref,
      );
    };

    const scheduleUpdate = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  const condensedHeaderMenus = headerMenus.slice(4);
  const activeCondensedMenu = condensedHeaderMenus.find(
    (menu) => menu.label === openCondensedMenu,
  );

  return (
    <main className="ue-page" data-hero-phase="intro" ref={pageRef}>
      <header className="ue-topbar">
        <div className="ue-topbar__background" aria-hidden="true" />
        <div className="ue-epic-menu">
          <button className="ue-epic" type="button" aria-label="Epic Games">
            <img src="/assets/ue5/epic-games-logo.svg" alt="" />
            <svg
              className="ue-epic-chevron"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M18.47 8.97a.75.75 0 1 1 1.06 1.06L12 17.56l-7.53-7.53a.75.75 0 1 1 1.06-1.06L12 15.44z" />
            </svg>
          </button>
          <div className="ue-flyout ue-flyout--epic">
            {epicLinks.map(([label, href]) => (
              <a href={href} key={label}>
                {label}
              </a>
            ))}
          </div>
        </div>
        <a
          className="ue-brand"
          href="https://www.unrealengine.com/"
          aria-label="Unreal Engine"
        >
          <img
            className="ue-brand__wordmark"
            src="/assets/ue5/header/unreal-engine-logo.svg"
            alt=""
          />
          <span className="ue-mark" aria-hidden="true">
            <img src="/assets/ue5/unreal-u-logo.svg" alt="" />
          </span>
        </a>
        <nav className="ue-global-nav" aria-label="Unreal navigation">
          {headerMenus.map((menu, menuIndex) => (
            <div
              className={`ue-nav-item ue-nav-item--${menuIndex + 1}`}
              key={menu.label}
            >
              <a className="ue-nav-trigger" href={menu.href}>
                {menu.label}
                {menu.columns.length > 0 ? (
                  <span className="ue-chevron" aria-hidden="true" />
                ) : null}
              </a>
              {menu.columns.length > 0 ? (
                <div
                  className={`ue-flyout ue-flyout--nav ue-flyout--${menu.label.toLowerCase()}`}
                >
                  {menu.columns.map((column, columnIndex) => (
                    <div className="ue-flyout__column" key={columnIndex}>
                      {"title" in column && typeof column.title === "string" ? (
                        <span>{column.title}</span>
                      ) : null}
                      {column.links.map(([label, href]) => (
                        <a href={href} key={label}>
                          {label}
                        </a>
                      ))}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
          <div
            className={`ue-nav-item ue-nav-more${isMoreOpen ? " is-open" : ""}`}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setIsMoreOpen(false);
                setOpenCondensedMenu(null);
              }
            }}
            onFocus={() => {
              setIsMoreOpen(true);
            }}
            onMouseEnter={() => {
              setIsMoreOpen(true);
            }}
            onMouseLeave={() => {
              setIsMoreOpen(false);
              setOpenCondensedMenu(null);
            }}
          >
            <button
              className="ue-nav-trigger"
              type="button"
              aria-controls="ue-more-menu"
              aria-expanded={isMoreOpen}
              aria-haspopup="menu"
            >
              More
              <span className="ue-chevron" aria-hidden="true" />
            </button>
            <div
              className="ue-flyout ue-flyout--more"
              id="ue-more-menu"
              role="menu"
            >
              <div className="ue-more-list">
                {condensedHeaderMenus.map((menu) => {
                  const hasChildren = menu.columns.length > 0;
                  const isSubmenuOpen = openCondensedMenu === menu.label;
                  const submenuId = `ue-more-${menu.label.toLowerCase()}-menu`;

                  return (
                    <div
                      className={`ue-more-item ue-more-item--${menu.label.toLowerCase()}${isSubmenuOpen ? " is-open" : ""}`}
                      key={menu.label}
                      onFocus={() => {
                        if (hasChildren) {
                          setOpenCondensedMenu(menu.label);
                        }
                      }}
                      onMouseEnter={() => {
                        if (hasChildren) {
                          setOpenCondensedMenu(menu.label);
                        }
                      }}
                    >
                      <a
                        className="ue-more-link"
                        href={menu.href}
                        role="menuitem"
                        aria-controls={hasChildren ? submenuId : undefined}
                        aria-expanded={
                          hasChildren ? isSubmenuOpen : undefined
                        }
                        aria-haspopup={hasChildren ? "menu" : undefined}
                        onClick={(event) => {
                          if (hasChildren) {
                            event.preventDefault();
                            setOpenCondensedMenu(menu.label);
                          }
                        }}
                      >
                        <span>{menu.label}</span>
                        {hasChildren ? (
                          <span className="ue-sub-chevron" aria-hidden="true" />
                        ) : null}
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
            {activeCondensedMenu ? (
              <div
                className={`ue-subflyout ue-subflyout--standalone ue-subflyout--${activeCondensedMenu.label.toLowerCase()}`}
                id={`ue-more-${activeCondensedMenu.label.toLowerCase()}-menu`}
                role="menu"
              >
                {activeCondensedMenu.columns.map((column, columnIndex) => (
                  <div className="ue-flyout__column" key={columnIndex}>
                    {column.links.map(([label, href]) => (
                      <a href={href} key={label} role="menuitem">
                        {label}
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </nav>
        <div className="ue-actions">
          <label className="ue-search">
            <span aria-hidden="true" />
            <input aria-label="Search" placeholder="Search" type="search" />
          </label>
          <div
            className={`ue-language-menu${isLanguageOpen ? " is-open" : ""}`}
          >
            <button
              type="button"
              className="ue-globe"
              aria-expanded={isLanguageOpen}
              aria-label="Language"
              onClick={() => {
                setIsLanguageOpen((open) => !open);
              }}
            >
              <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="M3.6 12h16.8" />
                <path d="M12 3c2.35 2.45 3.6 5.42 3.6 9s-1.25 6.55-3.6 9" />
                <path d="M12 3c-2.35 2.45-3.6 5.42-3.6 9s1.25 6.55 3.6 9" />
              </svg>
            </button>
            <div className="ue-flyout ue-flyout--language">
              {languageLinks.map(([label, href]) => (
                <a
                  href={href}
                  key={label}
                  onClick={() => {
                    setIsLanguageOpen(false);
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
          <a className="ue-sign-in" href="#top">
            Sign in
          </a>
          <a className="ue-download" href={homeLinks.download}>
            Download
          </a>
          <button
            type="button"
            className={`ue-menu${isMobileMenuOpen ? " is-open" : ""}`}
            aria-label="Menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => {
              setIsMobileMenuOpen((open) => !open);
            }}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {isMobileMenuOpen ? (
        <div className="ue-mobile-drawer">
          <button
            className="ue-mobile-backdrop"
            type="button"
            aria-label="Close menu"
            onClick={closeMobileMenu}
          />
          <aside className="ue-mobile-panel" aria-label="Mobile navigation">
            <div className="ue-mobile-panel__head">
              <span>Unreal Engine</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={closeMobileMenu}
              >
                Close
              </button>
            </div>

            <nav aria-label="Mobile Unreal navigation">
              {headerMenus.map((menu) =>
                menu.columns.length > 0 ? (
                  <details key={menu.label}>
                    <summary>{menu.label}</summary>
                    <div>
                      {menu.columns.map((column, columnIndex) => (
                        <div key={columnIndex}>
                          {"title" in column &&
                          typeof column.title === "string" ? (
                            <span>{column.title}</span>
                          ) : null}
                          {column.links.map(([label, href]) => (
                            <a
                              href={href}
                              key={label}
                              onClick={closeMobileMenu}
                            >
                              {label}
                            </a>
                          ))}
                        </div>
                      ))}
                    </div>
                  </details>
                ) : (
                  <a href={menu.href} key={menu.label} onClick={closeMobileMenu}>
                    {menu.label}
                  </a>
                ),
              )}
            </nav>

            <div className="ue-mobile-languages">
              {languageLinks.map(([label, href]) => (
                <a href={href} key={label} onClick={closeMobileMenu}>
                  {label}
                </a>
              ))}
            </div>

            <a
              className="ue-download ue-mobile-download"
              href={homeLinks.download}
              onClick={closeMobileMenu}
            >
              Download
            </a>
          </aside>
        </div>
      ) : null}

      <section className="ue-hero" id="top">
        <div className="ue-hero__sticky">
          <div className="ue-hero__masked-video">
            <div className="ue-hero__perspective">
              <div className="ue-hero__tilt">
                <video
                  aria-label="Unreal Engine 5 city demo"
                  className="ue-hero__video"
                  disablePictureInPicture
                  muted
                  playsInline
                  poster="/assets/ue5/hero-poster.png"
                  preload="auto"
                  ref={heroVideoRef}
                >
                  <source src="/assets/ue5/hero-intro.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
          <div className="ue-hero__shade" />
          <img
            className="ue-hero__logo"
            src="/assets/ue5/unreal-u-logo.svg"
            alt=""
          />

          <div className="ue-hero__intro">
            <h1>
              <span>Unreal Engine 5</span>
            </h1>
          </div>

          <div className="ue-hero__headline">
            <h2>
              Bigger worlds. Bigger stories.
              <br />
              More Unreal.
            </h2>
          </div>

          <span className="ue-scroll-line" />
        </div>

        <div className="ue-hero__body">
          <p>
            Unreal Engine enables game developers and creators across industries
            to realize next-generation real-time 3D content and experiences with
            greater freedom, fidelity, and flexibility than ever before.
          </p>
          <a href={homeLinks.download}>Download now</a>
        </div>
      </section>

      <nav className="ue-section-nav" aria-label="Page sections">
        <a className="ue-back-top" href="#top">
          ↑ Back to Top
        </a>
        <div>
          {pageNav.map(([number, label, href]) => (
            <a
              aria-current={activeSectionHref === href ? "location" : undefined}
              className={activeSectionHref === href ? "is-active" : undefined}
              href={href}
              key={label}
              onClick={() => {
                setActiveSectionHref(href);
              }}
            >
              <span>{number}</span>
              {label}
            </a>
          ))}
        </div>
      </nav>

      <section className="ue-section ue-overview" id="overview">
        <div className="ue-overview-mosaic">
          <div className="ue-overview-column ue-overview-column--left">
            <div className="ue-overview__intro" data-reveal>
              <div className="ue-kicker">
                <span>01</span> Overview
              </div>
              <h2>
                The world’s most open and advanced real-time 3D creation tool
              </h2>
            </div>

            <article
              className="ue-overview-card ue-overview-card--build"
              data-reveal
            >
              <img src={overviewItems[0].image} alt="" />
              <div>
                <h3>{overviewItems[0].title}</h3>
                <p>{overviewItems[0].copy}</p>
              </div>
            </article>

            <div className="ue-industry-block" data-reveal>
              <div>
                <h3>Explore by industry</h3>
                {industryLinks.map(([label, href]) => (
                  <a href={href} key={label}>
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="ue-overview-column ue-overview-column--right">
            <article
              className="ue-overview-card ue-overview-card--fidelity"
              data-reveal
            >
              <img src={overviewItems[1].image} alt="" />
              <div>
                <h3>{overviewItems[1].title}</h3>
                <p>{overviewItems[1].copy}</p>
              </div>
            </article>

            <article
              className="ue-overview-card ue-overview-card--animate"
              data-reveal
            >
              <img src={overviewItems[2].image} alt="" />
              <div>
                <h3>{overviewItems[2].title}</h3>
                <p>{overviewItems[2].copy}</p>
              </div>
            </article>
          </div>
        </div>

        <section className="ue-uefn" data-reveal>
          <h2>The power of Unreal Editor for Fortnite</h2>
          <img src="/assets/ue5/uefn.png" alt="" />
          <p>
            Design, develop, and publish content into Fortnite using the Unreal
            Editor’s workflows, advanced PC-based toolset, and new Verse
            scripting language.
          </p>
          <div className="ue-button-row">
            {uefnActions.map(([label, href]) => (
              <a href={href} key={label}>
                {label}
              </a>
            ))}
          </div>
        </section>
      </section>

      <section className="ue-section ue-features" id="key-features">
        <div className="ue-kicker ue-kicker--center" data-reveal>
          <span>02</span> Key features
        </div>
        <div className="ue-center-heading" data-reveal>
          <h2>Everything included out of the box</h2>
          <p>
            No matter which industry you’re in, Unreal Engine 5 includes all the
            tools you need to deliver stunning real-time content and
            experiences, with no hidden extras.
          </p>
          <div className="ue-button-row">
            {featureActions.map(([label, href]) => (
              <a href={href} key={label}>
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="ue-feature-list">
          {featureItems.map((feature, index) => (
            <article
              className="ue-feature"
              data-reveal
              key={feature.title}
              style={cssVars({ "--stagger": `${Math.min(index, 3) * 80}ms` })}
            >
              <div className="ue-feature__media">
                {feature.images.map((image) => (
                  <img src={image} alt="" key={image} />
                ))}
              </div>
              <div className="ue-feature__copy">
                <span>{feature.label}</span>
                <h3>{feature.title}</h3>
                {feature.copy.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="ue-section ue-samples" id="sample-projects">
        <div className="ue-kicker ue-kicker--center" data-reveal>
          <span>03</span> Sample projects
        </div>
        <div className="ue-center-heading" data-reveal>
          <h2>Free UE5-ready sample projects</h2>
          <p>
            Explore free projects that show how UE5 features work together, or
            browse Fab for hundreds more UE5-compatible products.
          </p>
          <a className="ue-outline-link" href={homeLinks.fab}>
            Fab marketplace
          </a>
        </div>

        <div className="ue-sample-list">
          {samples.map((sample, index) => (
            <article
              data-reveal
              key={sample.title}
              style={cssVars({ "--stagger": `${index * 90}ms` })}
            >
              <img src={sample.image} alt="" />
              <div className="ue-sample-copy">
                <a className="ue-sample-title" href={sample.href}>
                  {sample.title}
                </a>
                <p>
                  {sample.copy.map((segment) =>
                    "href" in segment ? (
                      <a href={segment.href} key={segment.text}>
                        {segment.text}
                      </a>
                    ) : (
                      segment.text
                    ),
                  )}
                </p>
              </div>
              <a className="ue-sample-action" href={sample.href}>
                Download now
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="ue-section ue-get-started" id="get-started">
        <div className="ue-get-started__intro" data-reveal>
          <div className="ue-kicker">
            <span>04</span> Get started
          </div>
          <h2>Get started with Unreal Engine 5</h2>
        </div>
        <div className="ue-license-grid" data-reveal>
          {licenseCards.map((card, index) => (
            <a
              className="ue-license"
              data-reveal
              href={card.href}
              key={card.title}
              style={cssVars({ "--stagger": `${index * 110}ms` })}
            >
              <span>{card.label}</span>
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="ue-section ue-resources" id="resources">
        <div className="ue-kicker" data-reveal>
          <span>05</span> Resources
        </div>
        <div className="ue-two-col ue-two-col--resources" data-reveal>
          <div>
            <h2>The help you need to succeed</h2>
            <p>
              Whether you’re just getting started and need some basic guidance,
              or you’re a seasoned pro who’s pushing Unreal Engine to its
              limits, there’s a range of options to help you succeed.
            </p>
          </div>
          <div className="ue-resource-cards">
            {resourceCards.map((resource) => (
              <a href={resource.href} key={resource.title}>
                <span>{resource.label}</span>
                <h3>{resource.title}</h3>
                <p>{resource.copy}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="ue-learning-head" data-reveal>
          <h2>Unreal Engine 5 online learning</h2>
          <a href={homeLinks.learning}>See all courses</a>
        </div>
        <div className="ue-learning-list">
          {learning.map((course) => (
            <article data-reveal key={course.title}>
              <img src={course.image} alt="" />
              <div className="ue-learning-list__meta">
                <h3>
                  <a href={course.href}>{course.title}</a>
                </h3>
                <span>{course.duration}</span>
              </div>
              <p>{course.copy}</p>
            </article>
          ))}
        </div>

        <article className="ue-community" data-reveal>
          <div>
            <span>{communityCallout.label}</span>
            <h3>{communityCallout.title}</h3>
            <p>{communityCallout.copy}</p>
            <a href={communityCallout.href}>Visit the community</a>
          </div>
          <img src={communityCallout.image} alt="" />
        </article>

        <div className="ue-products" data-reveal>
          <h2>Other products from Epic Games</h2>
          <div className="ue-products__grid">
            {productItems.map((product) => (
              <article className="ue-product-card" key={product.title}>
                <img
                  className="ue-product-card__media"
                  src={product.image}
                  alt=""
                />
                <div className="ue-product-card__shade" aria-hidden="true" />
                <div className="ue-product-card__badge" aria-hidden="true">
                  <img src={product.icon} alt="" />
                </div>
                <div className="ue-product-card__frame">
                  <span>{product.label}</span>
                  <div className="ue-product-card__copy">
                    <h3>
                      <a href={product.href}>{product.title}</a>
                    </h3>
                    <p>{product.copy}</p>
                  </div>
                  <a className="ue-product-card__action" href={product.href}>
                    {product.action}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="ue-footer">
        <div className="ue-footer__inner">
          <div className="ue-footer__brand-row">
            <a className="ue-footer__brand" href="https://www.unrealengine.com/">
              <img src="/assets/ue5/unreal-u-logo.svg" alt="" />
              <span>Unreal Engine</span>
            </a>
            <div className="ue-footer__social" aria-label="Social links">
              {footerSocialLinks.map(([label, href]) => (
                <a aria-label={label} href={href} key={label}>
                  <FooterSocialIcon label={label} />
                </a>
              ))}
            </div>
          </div>

          <div className="ue-footer__columns">
            {footerColumns.map((column) => (
              <div className="ue-footer__column" key={column.title}>
                <h2>{column.title}</h2>
                {column.links.map(([label, href]) => (
                  <a href={href} key={label}>
                    {label}
                  </a>
                ))}
              </div>
            ))}
          </div>

          <div className="ue-footer__bottom">
            <div>
              <p>{footerCopyright}</p>
              <div className="ue-footer__legal">
                {footerLegalLinks.map(([label, href]) => (
                  <a href={href} key={label}>
                    {label}
                  </a>
                ))}
              </div>
            </div>
            <a className="ue-footer__back" href="#top">
              <span>Back to top</span>
              <FooterBackIcon />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
