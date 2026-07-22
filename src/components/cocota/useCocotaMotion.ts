"use client";

import { useEffect } from "react";

export function useCocotaMotion() {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const wordRevealTargets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-word-reveal]"),
    );
    const animatedSprites = Array.from(
      document.querySelectorAll<HTMLElement>("[data-animated-sprite]"),
    );

    const setWordDelays = () => {
      wordRevealTargets.forEach((target) => {
        const words = Array.from(
          target.querySelectorAll<HTMLElement>(".word-mask"),
        );
        let currentLineTop: number | null = null;
        let wordIndex = 0;

        words.forEach((word) => {
          const wordTop = word.offsetTop;

          if (currentLineTop === null || Math.abs(wordTop - currentLineTop) > 1) {
            currentLineTop = wordTop;
            wordIndex = 0;
          }

          word.style.setProperty("--word-delay", `${wordIndex * 50}ms`);
          wordIndex += 1;
        });
      });
    };

    const revealVisibleTargets = () => {
      const revealLine = window.innerHeight * 0.92;
      targets.forEach((target) => {
        const rect = target.getBoundingClientRect();
        if (rect.top < revealLine && rect.bottom > 0) {
          target.classList.add("inview");
        }
      });
    };
    let wordObserver: IntersectionObserver | null = null;
    const revealVisibleWordTargets = () => {
      const revealLine = window.innerHeight * 0.75;

      wordRevealTargets.forEach((target) => {
        const rect = target.getBoundingClientRect();

        if (rect.top < revealLine && rect.bottom > 0) {
          target.classList.add("inview");
          wordObserver?.unobserve(target);
        }
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12%", threshold: 0.08 },
    );
    wordObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
            wordObserver?.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -25%", threshold: 0 },
    );
    const spriteObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("inview", entry.isIntersecting);
      });
    });

    setWordDelays();
    targets.forEach((target) => observer.observe(target));
    wordRevealTargets.forEach((target) => wordObserver?.observe(target));
    animatedSprites.forEach((sprite) => spriteObserver.observe(sprite));

    const revealVisibleContent = () => {
      revealVisibleTargets();
      revealVisibleWordTargets();
    };
    const handleResize = () => {
      setWordDelays();
      revealVisibleContent();
    };
    const firstFrame = window.requestAnimationFrame(revealVisibleContent);
    let cancelled = false;

    void document.fonts.ready.then(() => {
      if (!cancelled) {
        setWordDelays();
        revealVisibleWordTargets();
      }
    });

    window.addEventListener("scroll", revealVisibleContent, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      cancelled = true;
      observer.disconnect();
      wordObserver?.disconnect();
      spriteObserver.disconnect();
      window.cancelAnimationFrame(firstFrame);
      window.removeEventListener("scroll", revealVisibleContent);
      window.removeEventListener("resize", handleResize);
    };
  }, []);
}
