import { type CSSProperties, useEffect, useRef, useState } from "react";
import {
  epicLinks,
  featureItems,
  headerMenus,
  industryLinks,
  languageLinks,
  learning,
  overviewItems,
  pageNav,
  samples,
} from "src/features/home/homePageData";

function cssVars(vars: Record<`--${string}`, string>): CSSProperties {
  return vars;
}

export function HomePage() {
  const pageRef = useRef<HTMLElement>(null);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

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
      const revealRaw = Math.min(progress / 0.42, 1);
      const reveal =
        revealRaw < 0.5
          ? 4 * revealRaw * revealRaw * revealRaw
          : 1 - Math.pow(-2 * revealRaw + 2, 3) / 2;
      const logoProgress = Math.min(progress / 0.28, 1);
      page.style.setProperty("--hero-progress", progress.toFixed(4));
      page.style.setProperty("--hero-reveal-radius", `${24 + reveal * 95}vmax`);
      page.style.setProperty(
        "--hero-logo-scale",
        (1 + logoProgress * 2).toFixed(4),
      );
      page.style.setProperty(
        "--hero-logo-opacity",
        (0.85 * (1 - logoProgress)).toFixed(4),
      );
      page.dataset.heroPhase =
        progress < 0.22 ? "intro" : progress < 0.62 ? "headline" : "body";

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
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.14,
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

  return (
    <main className="ue-page" data-hero-phase="intro" ref={pageRef}>
      <header className="ue-topbar">
        <div className="ue-epic-menu">
          <button className="ue-epic" type="button" aria-label="Epic Games">
            <img src="/assets/ue5/epic-games-logo.svg" alt="" />
            <span className="ue-chevron" aria-hidden="true" />
          </button>
          <div className="ue-flyout ue-flyout--epic">
            {epicLinks.map(([label, href]) => (
              <a href={href} key={label}>
                {label}
              </a>
            ))}
          </div>
        </div>
        <a className="ue-brand" href="#top" aria-label="Unreal Engine">
          <span className="ue-mark" aria-hidden="true">
            <img src="/assets/ue5/unreal-u-logo.svg" alt="" />
          </span>
          <span>Unreal Engine</span>
        </a>
        <nav className="ue-global-nav" aria-label="Unreal navigation">
          {headerMenus.map((menu) => (
            <div className="ue-nav-item" key={menu.label}>
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
          <a className="ue-download" href="#get-started">
            Download
          </a>
          <button type="button" className="ue-menu" aria-label="Menu">
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <section className="ue-hero" id="top">
        <div className="ue-hero__sticky">
          <video
            aria-label="Unreal Engine 5 city demo"
            autoPlay
            className="ue-hero__video"
            loop
            muted
            playsInline
            poster="/assets/ue5/hero-poster.png"
          >
            <source src="/assets/ue5/hero-intro.mp4" type="video/mp4" />
          </video>
          <div className="ue-hero__shade" />
          <img
            className="ue-hero__logo"
            src="/assets/ue5/unreal-u-logo.svg"
            alt=""
          />

          <div className="ue-hero__intro">
            <h1>Unreal Engine 5</h1>
          </div>

          <div className="ue-hero__headline">
            <h2>
              Bigger worlds. Bigger stories.
              <br />
              More Unreal.
            </h2>
          </div>

          <span className="ue-scroll-line" />

          <div className="ue-hero__body">
            <p>
              Unreal Engine enables game developers and creators across
              industries to realize next-generation real-time 3D content and
              experiences with greater freedom, fidelity, and flexibility than
              ever before.
            </p>
            <a href="#get-started">Download now</a>
          </div>
        </div>
      </section>

      <nav className="ue-section-nav" aria-label="Page sections">
        <a className="ue-back-top" href="#top">
          ↑ Back to Top
        </a>
        <div>
          {pageNav.map(([number, label, href]) => (
            <a href={href} key={label}>
              <span>{number}</span>
              {label}
            </a>
          ))}
        </div>
      </nav>

      <section className="ue-section ue-overview" id="overview">
        <div className="ue-kicker" data-reveal>
          <span>01</span> Overview
        </div>
        <div className="ue-two-col ue-two-col--intro" data-reveal>
          <h2>The world’s most open and advanced real-time 3D creation tool</h2>
          <img src="/assets/ue5/game-changing-fidelity.jpg" alt="" />
        </div>

        <div className="ue-overview-list">
          <article data-reveal>
            <img src={overviewItems[0].image} alt="" />
            <div>
              <h3>{overviewItems[0].title}</h3>
              <p>{overviewItems[0].copy}</p>
            </div>
          </article>

          <div className="ue-industry-block" data-reveal>
            <div>
              <h3>Explore by industry</h3>
              {industryLinks.map((label) => (
                <a href="#key-features" key={label}>
                  {label}
                </a>
              ))}
            </div>
            <article>
              <img src={overviewItems[2].image} alt="" />
              <h3>{overviewItems[2].title}</h3>
              <p>{overviewItems[2].copy}</p>
            </article>
          </div>

          <article className="ue-overview-wide" data-reveal>
            <img src={overviewItems[1].image} alt="" />
            <div>
              <h3>{overviewItems[1].title}</h3>
              <p>{overviewItems[1].copy}</p>
            </div>
          </article>
        </div>

        <section className="ue-uefn" data-reveal>
          <h2>The power of Unreal Editor for Fortnite</h2>
          <img src="/assets/ue5/uefn.png" alt="" />
          <p>
            Design, develop, and publish Fortnite content using familiar Unreal
            workflows, an advanced PC-based toolset, and Verse scripting.
          </p>
          <div className="ue-button-row">
            <a href="#resources">Learn more</a>
            <a href="#sample-projects">Dive in</a>
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
            Unreal Engine 5 includes the tools teams need to deliver beautiful
            real-time content and experiences, with no hidden extras.
          </p>
          <div className="ue-button-row">
            <a href="#resources">See all features</a>
            <a href="#sample-projects">See what’s new</a>
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
                <img src={feature.image} alt="" />
              </div>
              <div className="ue-feature__copy">
                <span>{feature.label}</span>
                <h3>{feature.title}</h3>
                <p>{feature.copy}</p>
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
            Explore practical projects that show how Unreal Engine 5 systems
            work together in scenes, gameplay frameworks, and large
            environments.
          </p>
          <a className="ue-outline-link" href="#top">
            Fab marketplace
          </a>
        </div>

        <div className="ue-sample-grid">
          {samples.map((sample, index) => (
            <article
              data-reveal
              key={sample.title}
              style={cssVars({ "--stagger": `${index * 90}ms` })}
            >
              <img src={sample.image} alt="" />
              <h3>{sample.title}</h3>
              <p>{sample.copy}</p>
              <a href="#get-started">Download now</a>
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
          <a className="ue-license ue-license--blue" data-reveal href="#top">
            <span>Download for free</span>
            <h3>Under $1M USD?</h3>
            <p>
              UE5 is free to create linear content, custom projects, and
              internal projects if your gross annual revenue is under $1M USD.
              It’s free to get started for game development—a 5% royalty only
              kicks in when your title earns over $1M USD.
            </p>
          </a>
          <a
            className="ue-license"
            data-reveal
            href="#resources"
            style={cssVars({ "--stagger": "110ms" })}
          >
            <span>Find out more</span>
            <h3>Other licensing options</h3>
            <p>
              Above that threshold, or looking for premium support, professional
              training, or custom terms? Check out your options or reach out to
              us for a chat.
            </p>
          </a>
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
              Whether you are just getting started or pushing Unreal Engine to
              its limits, resources are available for every stage of production.
            </p>
          </div>
          <div className="ue-resource-cards">
            <a href="#top">
              <span>documentation</span>
              <h3>Information at your fingertips</h3>
              <p>
                Find documentation for engine systems, workflows, and tools.
              </p>
            </a>
            <a href="#top">
              <span>support</span>
              <h3>Need a hand?</h3>
              <p>Explore community support and premium help from Epic staff.</p>
            </a>
          </div>
        </div>

        <div className="ue-learning-head" data-reveal>
          <h2>Unreal Engine 5 online learning</h2>
          <a href="#top">See all courses</a>
        </div>
        <div className="ue-learning-list">
          {learning.map((course) => (
            <article data-reveal key={course.title}>
              <img src={course.image} alt="" />
              <div>
                <h3>{course.title}</h3>
                <span>{course.duration}</span>
                <p>{course.copy}</p>
              </div>
            </article>
          ))}
        </div>

        <article className="ue-community" data-reveal>
          <img src="/assets/ue5/dev-community.jpg" alt="" />
          <div>
            <span>Epic Developer Community</span>
            <h3>Learn, discuss, share</h3>
            <p>
              Join creators in tutorials, forums, snippets, Q&A, showcases, and
              learning spaces built around real production questions.
            </p>
            <a href="#top">Visit the community</a>
          </div>
        </article>

        <div className="ue-products" data-reveal>
          <h2>Other products from Epic Games</h2>
          <article>
            <img src="/assets/ue5/metahuman.jpg" alt="" />
            <div>
              <span>MetaHuman</span>
              <h3>High-fidelity digital humans made easy</h3>
              <a href="#top">Learn more</a>
            </div>
          </article>
          <article>
            <img src="/assets/ue5/megascans.jpg" alt="" />
            <div>
              <span>Quixel Megascans</span>
              <h3>
                The world’s largest photogrammetry asset library at your
                fingertips
              </h3>
              <a href="#top">Browse now</a>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
