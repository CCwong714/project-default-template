"use client";

import { type MouseEvent, useLayoutEffect, useRef } from "react";
import { works } from "./data";
import { ArrowIcon } from "./icons";

export function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const mediaElements = Array.from(
      section.querySelectorAll<HTMLElement>(".work-media"),
    );
    let animationFrame: number | null = null;

    const updateParallax = () => {
      animationFrame = null;
      const viewportHeight = window.innerHeight;

      mediaElements.forEach((media) => {
        const visual = media.querySelector<HTMLElement>(
          ".work-parallax-visual",
        );

        if (!visual) return;

        const mediaRect = media.getBoundingClientRect();
        const rawProgress = Math.min(
          1,
          Math.max(
            0,
            (viewportHeight - mediaRect.top) /
              (viewportHeight + mediaRect.height),
          ),
        );
        const roundedProgress = Number(rawProgress.toFixed(4));
        const easedProgress = 1 - (1 - roundedProgress) ** 2;
        const translatePercent = -10 + 20 * easedProgress;

        visual.style.setProperty(
          "--work-parallax-y",
          `${translatePercent.toFixed(4)}%`,
        );
      });
    };

    const requestParallaxUpdate = () => {
      if (animationFrame !== null) return;
      animationFrame = window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
    window.addEventListener("resize", requestParallaxUpdate);

    return () => {
      window.removeEventListener("scroll", requestParallaxUpdate);
      window.removeEventListener("resize", requestParallaxUpdate);

      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  const moveEmoji = (event: MouseEvent<HTMLAnchorElement>) => {
    const emoji = event.currentTarget.querySelector<HTMLElement>(".work-emoji");
    if (!emoji) return;
    const rect = event.currentTarget.getBoundingClientRect();
    emoji.style.left = `${event.clientX - rect.left}px`;
    emoji.style.top = `${event.clientY - rect.top}px`;
  };

  return (
    <section
      className="work section-shell"
      id="work"
      data-reveal
      ref={sectionRef}
    >
      <div className="work-title display-title">
        <span className="reveal-line">STRATEGIC</span>
        <span className="reveal-line work-title-center">CREATIVITY</span>
        <span className="reveal-line work-title-split">
          <span>SINCE</span>
          <span>2017</span>
          <span
            className="sprite sprite-left sprite-work"
            role="img"
            aria-label="Cocota team member"
          >
            <span className="sprite-dot" />
            <span className="sprite-tip">
              Working at the intersection of functionality and beauty.
            </span>
          </span>
        </span>
      </div>

      <div className="work-grid">
        {works.map((work) => (
          <article className={`work-card work-${work.size}`} key={work.title}>
            <a
              href="#contact"
              className={`work-media work-${work.shape}`}
              onMouseMove={moveEmoji}
            >
              {work.title === "Musotoku" ? (
                <video
                  className="work-parallax-visual"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  <source src="/assets/cocota/work-musotoku.mp4" type="video/mp4" />
                </video>
              ) : (
                <img
                  className="work-parallax-visual"
                  src={work.image}
                  alt={`${work.title} project`}
                />
              )}
              <span className="work-emoji" aria-hidden="true">
                {work.emoji}
              </span>
              <span className="case-pill">
                <span className="case-pill-label">Go to case study</span>
                <ArrowIcon />
              </span>
            </a>
            <div className="work-meta">
              <div>
                <h2>{work.title}</h2>
                <p>{work.description}</p>
              </div>
              <span>({work.category})</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
