export function ShowreelSection() {
  return (
    <section className="showreel" aria-label="Cocota showreel">
      <div className="showreel-sticky">
        <video autoPlay muted loop playsInline preload="metadata">
          <source src="/assets/cocota/showreel.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
