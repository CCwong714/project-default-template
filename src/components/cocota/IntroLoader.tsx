import { IntroCctMark } from "./icons";

type IntroLoaderProps = {
  onComplete: () => void;
};

export function IntroLoader({ onComplete }: IntroLoaderProps) {
  return (
    <div
      className="intro-loader"
      role="status"
      aria-label="Loading Cocota"
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget && event.animationName === "intro-loader-exit") {
          onComplete();
        }
      }}
    >
      <div className="intro-loader-mark">
        <IntroCctMark />
      </div>
    </div>
  );
}
