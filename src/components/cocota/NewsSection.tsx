"use client";

import { Splide } from "@splidejs/splide";
import { useEffect, useRef } from "react";
import { type NewsItem, newsItems } from "./data";
import { ArrowIcon } from "./icons";

function getNewsLayout() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const isTouch =
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(pointer: coarse)").matches ||
    (width < 861 && width < height);

  if (!isTouch) {
    return { gap: "2.4rem", perPage: 4.1 };
  }

  if (width > 767) {
    return {
      gap: "2.4rem",
      perPage: width > height ? 4.1 : 1.6,
    };
  }

  return { gap: "1.6rem", perPage: 1.1 };
}

function NewsCard({ item }: { item: NewsItem }) {
  const content = (
    <>
      <span className="news-card-media">
        <img src={item.image} alt={item.imageAlt} draggable={false} />
      </span>
      <span className="news-card-copy">
        <span className={`news-tag news-tag-${item.tagTone}`}>{item.tag}</span>
        <h2>{item.title}</h2>
      </span>
    </>
  );

  return (
    <li className="news-card splide__slide">
      {item.href ? (
        <a
          className="news-card-inner"
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      ) : (
        <div className="news-card-inner">{content}</div>
      )}
    </li>
  );
}

export function NewsSection() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const splideRef = useRef<Splide | null>(null);

  useEffect(() => {
    const root = carouselRef.current;

    if (!root) return;

    const initialLayout = getNewsLayout();
    const splide = new Splide(root, {
      type: "loop",
      start: 0,
      perPage: initialLayout.perPage,
      perMove: 1,
      gap: initialLayout.gap,
      speed: 400,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
      waitForTransition: false,
      updateOnMove: true,
      clones: newsItems.length,
      arrows: false,
      pagination: false,
      drag: true,
    });

    splideRef.current = splide;
    splide.mount();

    const syncResponsiveLayout = () => {
      const nextLayout = getNewsLayout();

      splide.options = {
        gap: nextLayout.gap,
        perPage: nextLayout.perPage,
      };
    };

    window.addEventListener("resize", syncResponsiveLayout, { passive: true });

    return () => {
      window.removeEventListener("resize", syncResponsiveLayout);
      splide.destroy(true);
      splideRef.current = null;
    };
  }, []);

  return (
    <section className="news section-shell" id="news" data-reveal>
      <div className="rail-heading">
        <p>WHAT&apos;S NEW</p>
        <div className="rail-controls">
          <button
            className="rail-control rail-control-prev"
            type="button"
            aria-label="Previous news"
            onClick={() => splideRef.current?.go("<")}
          >
            <span className="rail-control-track">
              <ArrowIcon />
              <ArrowIcon />
            </span>
          </button>
          <button
            className="rail-control"
            type="button"
            aria-label="Next news"
            onClick={() => splideRef.current?.go(">")}
          >
            <span className="rail-control-track">
              <ArrowIcon />
              <ArrowIcon />
            </span>
          </button>
        </div>
      </div>
      <div
        className="news-carousel splide"
        ref={carouselRef}
        aria-label="Latest news"
      >
        <div className="splide__track">
          <ul className="news-rail splide__list">
            {newsItems.map((item) => (
              <NewsCard item={item} key={item.title} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
