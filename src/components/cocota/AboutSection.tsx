import { Fragment } from "react";
import { ArrowIcon } from "./icons";

const services = [
  {
    name: "Branding",
    tone: "red",
    text: "Brand Strategy & Narrative; Visual Identity; Verbal Identity; Brand Roll-out",
  },
  {
    name: "Web design",
    tone: "blue",
    text: "UX Research & Strategy; UI Design; Interaction Design; Content Design",
  },
];

const aboutCopy =
  "Cocota is a creative partner offering integrated design solutions that explore the digital-branding nexus. We extract beauty from purpose to get your company higher, your vision farther, and your impact harder.";
const aboutTitle = "A DESIGN AGENCY FOR BRAND (R)EVOLUTION";

function RevealWords({ text }: { text: string }) {
  const words = text.split(" ");

  return words.map((word, index) => (
    <Fragment key={`${word}-${index}`}>
      <span className="word-mask" aria-hidden="true">
        <span className="word">{word}</span>
      </span>
      {index < words.length - 1 ? " " : null}
    </Fragment>
  ));
}

export function AboutSection() {
  return (
    <section className="about section-shell" id="about">
      <p
        className="section-kicker about-word-reveal"
        data-word-reveal
        aria-label={aboutTitle}
      >
        <RevealWords text={aboutTitle} />
      </p>
      <p
        className="about-copy about-word-reveal"
        data-word-reveal
        aria-label={aboutCopy}
      >
        <RevealWords text={aboutCopy} />
      </p>

      <div className="service-grid" id="services" data-reveal>
        {services.map((service) => (
          <a className={`service-card ${service.tone}`} href="#work" key={service.name}>
            <div className="service-card-top">
              <h2>{service.name}</h2>
              <span className="round-arrow">
                <ArrowIcon />
              </span>
            </div>
            <p>{service.text}</p>
          </a>
        ))}
      </div>

      <div className="about-bottom">
        <div className="about-sprite-wrap">
          <span
            className="sprite sprite-left sprite-presenting"
            data-animated-sprite
            role="img"
            aria-label="Cocota team member"
          >
            <span className="sprite-dot" />
            <span className="sprite-tip">
              Sparking genuine connections through storytelling and emotion.
            </span>
          </span>
        </div>
        <div>
          <p>
            From brand consultancy throughout activation, we help companies to forge authentic and lasting relationships with their audience.
          </p>
          <a className="underlined-link about-work-link" href="#work">
            <span className="about-work-link-track">
              <span>Discover our work</span>
              <span aria-hidden="true">It&apos;s a kind of magic!</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
