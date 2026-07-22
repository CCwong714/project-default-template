"use client";

import { type MouseEvent, useEffect, useRef } from "react";
import { awardLines } from "./data";
import { ArrowIcon } from "./icons";

const trophyAssets = [
  "award-laus.webp",
  "award-fwa.webp",
  "award-awwwards.webp",
  "award-cssda.webp",
  "award-lovie.webp",
  "award-mindsparkle.webp",
  "award-csswinner.webp",
  "award-awwwards.webp",
];

const AWARD_SPAWN_DISTANCE = 100;
const AWARD_VISIBLE_DURATION = 1_200;
const AWARD_EXIT_DURATION = 300;

export function AwardsSection() {
  const hoverTitleRef = useRef<HTMLDivElement>(null);
  const imagePoolRef = useRef<HTMLDivElement>(null);
  const lastImagePositionRef = useRef({ x: 0, y: 0 });
  const cleanupTimersRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const hoverTitle = hoverTitleRef.current;
    const cleanupTimers = cleanupTimersRef.current;

    return () => {
      cleanupTimers.forEach((timer) => window.clearTimeout(timer));
      cleanupTimers.clear();
      hoverTitle?.querySelectorAll(".award-trail-image").forEach((image) => image.remove());
    };
  }, []);

  const spawnAward = (event: MouseEvent<HTMLDivElement>) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const sourceImages = imagePoolRef.current?.querySelectorAll<HTMLImageElement>("img");
    if (!sourceImages?.length) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const previousPosition = lastImagePositionRef.current;

    if (Math.hypot(x - previousPosition.x, y - previousPosition.y) <= AWARD_SPAWN_DISTANCE) {
      return;
    }

    const sourceImage = sourceImages[Math.floor(Math.random() * sourceImages.length)];
    const image = sourceImage.cloneNode(true) as HTMLImageElement;
    const scale = Math.random() * 0.5 + 0.7;
    const rotation = Math.random() * 90 - 45;

    image.className = "award-trail-image";
    image.alt = "";
    image.setAttribute("aria-hidden", "true");
    image.style.left = `${x}px`;
    image.style.top = `${y}px`;
    image.style.setProperty("--award-scale", `${scale}`);
    image.style.setProperty("--award-rotation", `${rotation}deg`);
    event.currentTarget.appendChild(image);

    const fadeTimer = window.setTimeout(() => {
      cleanupTimersRef.current.delete(fadeTimer);
      if (!image.isConnected) return;

      image.classList.add("is-leaving");

      const removeTimer = window.setTimeout(() => {
        cleanupTimersRef.current.delete(removeTimer);
        image.remove();
      }, AWARD_EXIT_DURATION);

      cleanupTimersRef.current.add(removeTimer);
    }, AWARD_VISIBLE_DURATION);

    cleanupTimersRef.current.add(fadeTimer);
    lastImagePositionRef.current = { x, y };
  };

  return (
    <section className="awards section-shell" data-reveal>
      <div className="awards-hero">
        <div
          className="awards-hover-title"
          onMouseEnter={spawnAward}
          onMouseMove={spawnAward}
          ref={hoverTitleRef}
        >
          <h2>AWARDS</h2>
        </div>
        <div className="awards-image-pool" aria-hidden="true" ref={imagePoolRef}>
          {trophyAssets.map((asset, index) => (
            <img
              src={`/assets/cocota/${asset}`}
              alt=""
              key={`${asset}-${index}`}
            />
          ))}
        </div>
      </div>

      <div className="awards-list-wrap">
        <h3>AWARD-WINNING DESIGN</h3>
        <ul>
          {awardLines.map((award) => (
            <li key={award}>{award}</li>
          ))}
        </ul>
      </div>

      <div className="awards-cta">
        <a className="underlined-link" href="#contact">
          MORE ABOUT US! <ArrowIcon />
        </a>
        <span
          className="sprite sprite-left sprite-awards-person"
          role="img"
          aria-label="Cocota team member"
        >
          <span className="sprite-dot" />
          <span className="sprite-tip">We&apos;re pure gold..., and silver, and bronze!</span>
        </span>
      </div>

      <div className="facts">
        <div className="facts-list">
          <div className="fact">
            <strong>5</strong>
            <span>Years crafting brand and digital experiences</span>
          </div>
          <div className="fact">
            <strong>35%</strong>
            <span>In-house &amp; independent</span>
          </div>
          <div className="fact">
            <strong>9,0</strong>
            <span>Client Satisfaction Score</span>
          </div>
        </div>
        <div className="office-media">
          <img src="/assets/cocota/awards-office.webp" alt="Cocota studio in Madrid" />
        </div>
      </div>
    </section>
  );
}
