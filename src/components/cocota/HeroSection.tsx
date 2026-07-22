function AnimatedHeroText({ text }: { text: string }) {
  return (
    <span className="hero-intro-copy" aria-label={text}>
      {Array.from(text).map((character, index) =>
        character === " " ? (
          " "
        ) : (
          <span className="hero-char" aria-hidden="true" key={`${character}-${index}`}>
            {character}
          </span>
        ),
      )}
    </span>
  );
}

export function HeroSection() {
  return (
    <section className="hero section-shell" id="home">
      <h1 className="hero-title">
        <span className="hero-line hero-line-one reveal-line">
          <AnimatedHeroText text="THOUGHTFUL" />
          <span
            className="sprite sprite-right sprite-hero-primary"
            role="img"
            aria-label="Cocota team member"
          >
            <span className="sprite-dot" />
            <span className="sprite-tip">
              Branding agency, design studio, brand strategists, ... You name it!
            </span>
          </span>
        </span>
        <span className="hero-line hero-line-two reveal-line">
          <AnimatedHeroText text="DESIGN FOR" />
        </span>
        <span className="hero-line hero-line-three reveal-line">
          <span
            className="sprite sprite-left sprite-hero-secondary sprite-desktop"
            role="img"
            aria-label="Cocota team"
          >
            <span className="sprite-dot" />
            <span className="sprite-tip">
              Cocota&apos;s the name, designing cracking graphic experiences is the game.
            </span>
          </span>
          <AnimatedHeroText text="SOULFUL" />
        </span>
        <span className="hero-line hero-line-four reveal-line">
          <AnimatedHeroText text="BRANDS" />
          <span
            className="sprite sprite-left sprite-hero-secondary sprite-mobile"
            role="img"
            aria-label="Cocota team"
          >
            <span className="sprite-dot" />
            <span className="sprite-tip">
              Cocota&apos;s the name, designing cracking graphic experiences is the game.
            </span>
          </span>
        </span>
      </h1>
    </section>
  );
}
