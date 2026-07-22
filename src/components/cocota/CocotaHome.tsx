"use client";

import { useEffect, useState } from "react";
import { AboutSection } from "./AboutSection";
import { AwardsSection } from "./AwardsSection";
import { Footer } from "./Footer";
import { HeroSection } from "./HeroSection";
import { IndustriesSection } from "./IndustriesSection";
import { IntroLoader } from "./IntroLoader";
import { Navigation } from "./Navigation";
import { NewsSection } from "./NewsSection";
import { ShowreelSection } from "./ShowreelSection";
import { useCocotaMotion } from "./useCocotaMotion";
import { WorkSection } from "./WorkSection";

export function CocotaHome() {
  const [introComplete, setIntroComplete] = useState(false);
  useCocotaMotion();

  useEffect(() => {
    const loader = document.querySelector<HTMLElement>(".intro-loader");
    const exitAnimation = loader
      ?.getAnimations()
      .find(
        (animation) =>
          animation instanceof CSSAnimation && animation.animationName === "intro-loader-exit",
      );
    const elapsed = Number(exitAnimation?.currentTime ?? 0);
    const remaining = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : Math.max(0, 3_400 - (Number.isFinite(elapsed) ? elapsed : 0));
    const timeout = window.setTimeout(() => setIntroComplete(true), remaining);

    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <div className={introComplete ? "cocota-site intro-complete" : "cocota-site"}>
      {introComplete ? null : <IntroLoader onComplete={() => setIntroComplete(true)} />}
      <Navigation />
      <main className="cocota-main">
        <HeroSection />
        <ShowreelSection />
        <AboutSection />
        <NewsSection />
        <WorkSection />
        <IndustriesSection />
        <AwardsSection />
      </main>
      <Footer />
    </div>
  );
}
