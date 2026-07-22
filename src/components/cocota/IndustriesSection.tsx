"use client";

import {
  type MouseEvent,
  type TransitionEvent,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  type Client,
  type IndustryFilter,
  getClientsForIndustry,
  industryFilters,
} from "./client-data";
import { ArrowIcon } from "./icons";

const initialClients = getClientsForIndustry("All Industries");

type ClientCardProps = {
  client: Client;
  isClone: boolean;
};

function ClientCard({ client, isClone }: ClientCardProps) {
  const moveClientLogo = (event: MouseEvent<HTMLElement>) => {
    const logo = event.currentTarget.querySelector<HTMLElement>(
      ".client-hover-logo",
    );

    if (!logo) return;

    const rect = event.currentTarget.getBoundingClientRect();
    logo.style.left = `${event.clientX - rect.left}px`;
    logo.style.top = `${event.clientY - rect.top}px`;
  };

  return (
    <article
      className="client-card"
      aria-hidden={isClone}
      onMouseMove={moveClientLogo}
    >
      <div className="client-hover" aria-hidden="true">
        {client.media.type === "video" ? (
          <video
            className="client-hover-image"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={client.media.poster}
          >
            <source src={client.media.src} type="video/mp4" />
          </video>
        ) : (
          <img
            className="client-hover-image"
            src={client.media.src}
            alt=""
            loading="lazy"
          />
        )}
        <img className="client-hover-logo" src={client.logo} alt="" />
      </div>
      <div className="client-info">
        <h3>{client.name}</h3>
        <p className="client-label">{client.label}</p>
        <p>{client.description}</p>
      </div>
    </article>
  );
}

export function IndustriesSection() {
  const [activeFilter, setActiveFilter] =
    useState<IndustryFilter>("All Industries");
  const [displayedFilter, setDisplayedFilter] =
    useState<IndustryFilter>("All Industries");
  const [position, setPosition] = useState(initialClients.length);
  const [isReady, setIsReady] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef(0);
  const positionRef = useRef(initialClients.length);
  const resetFrameRef = useRef<number | null>(null);
  const resumeFrameRef = useRef<number | null>(null);
  const filterTimerRef = useRef<number | null>(null);
  const isResettingRef = useRef(false);
  const isFilteringRef = useRef(false);

  const visibleClients = useMemo(
    () => getClientsForIndustry(displayedFilter),
    [displayedFilter],
  );
  const loopedClients = useMemo(
    () =>
      Array.from({ length: 3 }, (_, copyIndex) =>
        visibleClients.map((client) => ({ client, copyIndex })),
      ).flat(),
    [visibleClients],
  );

  useLayoutEffect(() => {
    const rail = railRef.current;
    const viewport = rail?.parentElement;

    if (!rail || !viewport) return;

    const measureStep = () => {
      const firstCard = rail.querySelector<HTMLElement>(".client-card");

      if (!firstCard) return;

      const gap = Number.parseFloat(getComputedStyle(rail).columnGap) || 0;
      const step = firstCard.getBoundingClientRect().width + gap;
      stepRef.current = step;
      rail.style.setProperty(
        "--client-offset",
        `${step * positionRef.current * -1}px`,
      );
    };

    measureStep();
    const resizeObserver = new ResizeObserver(measureStep);
    resizeObserver.observe(viewport);
    const readyFrame = window.requestAnimationFrame(() => {
      setIsReady(true);
      setIsResetting(false);
      isResettingRef.current = false;
      setIsFiltering(false);
      isFilteringRef.current = false;
    });

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
  }, [displayedFilter]);

  useLayoutEffect(() => {
    positionRef.current = position;
    railRef.current?.style.setProperty(
      "--client-offset",
      `${stepRef.current * position * -1}px`,
    );
  }, [position]);

  useEffect(
    () => () => {
      if (filterTimerRef.current !== null) {
        window.clearTimeout(filterTimerRef.current);
      }
    },
    [],
  );

  const move = (direction: -1 | 1) => {
    if (
      !isReady ||
      isResettingRef.current ||
      isFilteringRef.current
    ) {
      return;
    }

    setPosition((currentPosition) => {
      const nextPosition = currentPosition + direction;
      positionRef.current = nextPosition;
      return nextPosition;
    });
  };

  const finishMove = (event: TransitionEvent<HTMLDivElement>) => {
    if (
      event.target !== event.currentTarget ||
      event.propertyName !== "transform"
    ) {
      return;
    }

    let resetPosition: number | null = null;

    const currentPosition = positionRef.current;

    if (currentPosition >= visibleClients.length * 2) {
      resetPosition = currentPosition - visibleClients.length;
    } else if (currentPosition < visibleClients.length) {
      resetPosition = currentPosition + visibleClients.length;
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

  const changeFilter = (filter: IndustryFilter) => {
    if (filter === activeFilter || isFilteringRef.current) return;

    setActiveFilter(filter);
    setIsFiltering(true);
    isFilteringRef.current = true;
    filterTimerRef.current = window.setTimeout(() => {
      const nextClients = getClientsForIndustry(filter);
      positionRef.current = nextClients.length;
      isResettingRef.current = true;
      setIsReady(false);
      setIsResetting(true);
      setPosition(nextClients.length);
      setDisplayedFilter(filter);
      filterTimerRef.current = null;
    }, 600);
  };

  return (
    <section className="industries section-shell" data-reveal>
      <div className="industries-title display-title">
        <span className="reveal-line">THEY</span>
        <span
          className="sprite sprite-left sprite-industries"
          role="img"
          aria-label="Cocota team"
        >
          <span className="sprite-dot" />
          <span className="sprite-tip">Proud of our inspiring clients!</span>
        </span>
        <span className="reveal-line">TRUST US</span>
      </div>

      <div className="industries-sub">
        <h2>A cross-industry design studio.</h2>
        <time>(2017 - 26)</time>
      </div>

      <div className="filter-row" aria-label="Filter clients by industry">
        {industryFilters.map((filter) => (
          <button
            className={activeFilter === filter ? "active" : ""}
            type="button"
            aria-pressed={activeFilter === filter}
            key={filter}
            onClick={() => changeFilter(filter)}
          >
            <span className="filter-label-track">
              <span>{filter}</span>
              <span aria-hidden="true">{filter}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="rail-heading clients-heading">
        <p>OUR CLIENTS</p>
        <div className="rail-controls">
          <button
            className="rail-control rail-control-prev"
            type="button"
            aria-label="Previous client"
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
            aria-label="Next client"
            onClick={() => move(1)}
          >
            <span className="rail-control-track">
              <ArrowIcon />
              <ArrowIcon />
            </span>
          </button>
        </div>
      </div>

      <div
        className={`client-carousel ${isFiltering ? "is-filtering" : ""}`}
      >
        <div
          className={`client-rail ${isReady && !isResetting ? "is-ready" : ""}`}
          ref={railRef}
          onTransitionEnd={finishMove}
        >
          {loopedClients.map(({ client, copyIndex }) => (
            <ClientCard
              client={client}
              isClone={copyIndex !== 1}
              key={`${copyIndex}-${client.id}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
