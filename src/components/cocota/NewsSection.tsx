"use client";

import {
  type TransitionEvent,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { type NewsItem, newsItems } from "./data";
import { ArrowIcon } from "./icons";

const loopedNewsItems = Array.from({ length: 3 }, (_, copyIndex) =>
  newsItems.map((item) => ({ copyIndex, item })),
).flat();

type NewsCardProps = {
  item: NewsItem;
  isClone: boolean;
};

function NewsCard({ item, isClone }: NewsCardProps) {
  const content = (
    <>
      <img src={item.image} alt={item.imageAlt} draggable={false} />
      <div>
        <span className={`news-tag news-tag-${item.tagTone}`}>{item.tag}</span>
        <h2>{item.title}</h2>
      </div>
    </>
  );

  if (item.href) {
    return (
      <a
        className="news-card"
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-hidden={isClone}
        tabIndex={isClone ? -1 : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <article className="news-card" aria-hidden={isClone}>
      {content}
    </article>
  );
}

export function NewsSection() {
  const railRef = useRef<HTMLDivElement>(null);
  const resetFrameRef = useRef<number | null>(null);
  const resumeFrameRef = useRef<number | null>(null);
  const isResettingRef = useRef(false);
  const positionRef = useRef(newsItems.length);
  const stepRef = useRef(0);
  const [position, setPosition] = useState(newsItems.length);
  const [isReady, setIsReady] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useLayoutEffect(() => {
    const rail = railRef.current;
    const viewport = rail?.parentElement;

    if (!rail || !viewport) return;

    const measureStep = () => {
      const firstCard = rail.querySelector<HTMLElement>(".news-card");

      if (!firstCard) return;

      const gap = Number.parseFloat(getComputedStyle(rail).columnGap) || 0;
      const step = firstCard.getBoundingClientRect().width + gap;
      stepRef.current = step;
      rail.style.setProperty(
        "--news-offset",
        `${step * positionRef.current * -1}px`,
      );
    };

    measureStep();
    const resizeObserver = new ResizeObserver(measureStep);
    resizeObserver.observe(viewport);
    const readyFrame = window.requestAnimationFrame(() => setIsReady(true));

    return () => {
      resizeObserver.disconnect();
      window.cancelAnimationFrame(readyFrame);

      if (resetFrameRef.current !== null) {
        window.cancelAnimationFrame(resetFrameRef.current);
      }

      if (resumeFrameRef.current !== null) {
        window.cancelAnimationFrame(resumeFrameRef.current);
      }
    };
  }, []);

  useLayoutEffect(() => {
    positionRef.current = position;
    railRef.current?.style.setProperty(
      "--news-offset",
      `${stepRef.current * position * -1}px`,
    );
  }, [position]);

  const move = (direction: -1 | 1) => {
    if (!isReady || isResettingRef.current) return;

    setPosition((currentPosition) => {
      const nextPosition = currentPosition + direction;
      positionRef.current = nextPosition;
      return nextPosition;
    });
  };

  const finishMove = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || event.propertyName !== "transform") return;

    let resetPosition: number | null = null;

    const currentPosition = positionRef.current;

    if (currentPosition >= newsItems.length * 2) {
      resetPosition = currentPosition - newsItems.length;
    } else if (currentPosition < newsItems.length) {
      resetPosition = currentPosition + newsItems.length;
    }

    if (resetPosition === null) return;

    isResettingRef.current = true;
    setIsResetting(true);
    positionRef.current = resetPosition;
    setPosition(resetPosition);
    resetFrameRef.current = window.requestAnimationFrame(() => {
      resumeFrameRef.current = window.requestAnimationFrame(() => {
        setIsResetting(false);
        isResettingRef.current = false;
      });
    });
  };

  return (
    <section className="news section-shell" id="news" data-reveal>
      <div className="rail-heading">
        <p>WHAT&apos;S NEW</p>
        <div className="rail-controls">
          <button
            className="rail-control rail-control-prev"
            type="button"
            aria-label="Previous news"
            onClick={() => move(-1)}
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
            onClick={() => move(1)}
          >
            <span className="rail-control-track">
              <ArrowIcon />
              <ArrowIcon />
            </span>
          </button>
        </div>
      </div>
      <div className="news-carousel">
        <div
          className={`news-rail ${isReady && !isResetting ? "is-ready" : ""}`}
          ref={railRef}
          onTransitionEnd={finishMove}
        >
          {loopedNewsItems.map(({ copyIndex, item }) => (
            <NewsCard
              item={item}
              isClone={copyIndex !== 1}
              key={`${copyIndex}-${item.title}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
