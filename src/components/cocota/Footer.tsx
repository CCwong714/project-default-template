import { EuFundingMark, FooterArrowIcon } from "./icons";

type CopyLinkProps = {
  href: string;
  label: string;
  target?: "_blank" | "_self";
};

function CopyLink({ href, label, target }: CopyLinkProps) {
  return (
    <a
      aria-label={label}
      className="footer-copy-link"
      href={href}
      rel={target === "_blank" ? "noreferrer" : undefined}
      target={target}
    >
      <span className="footer-copy-track">
        <span>{label}</span>
        <span aria-hidden="true">{label}</span>
      </span>
    </a>
  );
}

export function Footer() {
  return (
    <footer className="footer" id="contact" data-reveal>
      <div className="footer-content">
        <h2>AT A GLANCE</h2>

        <div className="footer-links">
          <div>
            <h3>COMPANY</h3>
            <CopyLink href="#home" label="Home" />
            <CopyLink href="#work" label="Work" />
            <CopyLink href="#about" label="About" />
            <CopyLink href="#news" label="Blog" />
            <CopyLink href="#contact" label="Contact" />
          </div>
          <div>
            <h3>SERVICES</h3>
            <CopyLink href="#services" label="Brand" />
            <CopyLink href="#services" label="Web design" />
            <CopyLink href="#services" label="Campaigns" />
            <CopyLink href="#services" label="Ongoing Partnership" />
          </div>
        </div>

        <div className="footer-ctas">
          <a
            aria-label="Newsletter"
            className="footer-cta"
            href="https://mailchi.mp/f3f7e4854738/newsletter"
            rel="noreferrer"
            target="_blank"
          >
            <div className="footer-cta-top">
              <h3>Newsletter</h3>
              <span className="round-arrow dark">
                <FooterArrowIcon />
              </span>
            </div>
            <p>
              Subscribe to stay in the know!
              <br />
              Discover what we&apos;ve been working on and receive cutting-edge design insights.
            </p>
          </a>
          <a className="footer-cta has-sprite" href="mailto:hola@cocotastudio.com">
            <div className="footer-cta-top">
              <h3>Let&apos;s talk</h3>
              <span className="round-arrow dark">
                <FooterArrowIcon />
              </span>
            </div>
            <p>
              Wanna be starting something?
              <br />
              We&apos;re all ears!
            </p>
            <span
              className="sprite sprite-left sprite-waving"
              role="img"
              aria-label="Cocota team member"
            />
          </a>
        </div>

        <div className="footer-contact-grid">
          <div>
            <h3>MADRID</h3>
            <p>
              <a
                href="https://www.google.es/maps/place/C.+de+Emilio+Mu%C3%B1oz,+3,+San+Blas-Canillejas,+28037+Madrid/@40.4308175,-3.6339092,17z/data=!3m1!4b1!4m10!1m2!2m1!1scalle+emilio+mu%C3%B1oz+3!3m6!1s0xd422f7204b970d3:0xbb6fbb8bf43abde7!8m2!3d40.4308134!4d-3.6313343!15sChVjYWxsZSBlbWlsaW8gbXXDsW96IDOSARFjb21wb3VuZF9idWlsZGluZ-ABAA!16s%2Fg%2F11bw44gn94?entry=ttu&amp;g_ep=EgoyMDI0MDkyNC4wIKXMDSoASAFQAw%3D%3D"
                rel="noreferrer"
                target="_blank"
              >
                Emilio Muñoz 3, 3 Left
              </a>
            </p>
            <p>28037 Madrid – Spain</p>
            <p className="footer-contact-spacer" aria-hidden="true">
              <br />
            </p>
            <p>
              <a href="mailto:hola@cocotastudio.com">hola@cocotastudio.com</a>
            </p>
          </div>
          <div>
            <h3>LONDON</h3>
            <p>
              <a
                href="https://www.google.es/maps/place/30+Stamford+St,+London+SE1+9LQ,+Reino+Unido/@51.507254,-0.1090658,16z/data=!3m1!4b1!4m6!3m5!1s0x487604b1cc6cf941:0x4ffbd3d8fdc30d2a!8m2!3d51.5072507!4d-0.1064909!16s%2Fg%2F11fx2tytf_?entry=ttu&amp;g_ep=EgoyMDI0MDkyNC4wIKXMDSoASAFQAw%3D%3D"
                rel="noreferrer"
                target="_blank"
              >
                30 Stamford Street
              </a>
            </p>
            <p>London, SE1 9LQ — UK</p>
            <p className="footer-contact-spacer" aria-hidden="true">
              <br />
            </p>
            <p>Coming soon…</p>
            <p className="footer-contact-spacer" aria-hidden="true">
              <br />
            </p>
          </div>
          <div>
            <h3>FOLLOW US</h3>
            <CopyLink
              href="https://www.instagram.com/cocotastudio/"
              label="Instagram"
              target="_blank"
            />
            <CopyLink
              href="https://www.linkedin.com/company/cocota-studio/?originalSubdomain=es"
              label="Linkedin"
              target="_blank"
            />
            <CopyLink
              href="https://clutch.co/profile/cocota#highlights"
              label="Clutch"
              target="_blank"
            />
            <CopyLink
              href="https://www.awwwards.com/CocotaStudio/"
              label="Awwwards"
              target="_blank"
            />
          </div>
          <div className="women-owned">
            <img src="/assets/cocota/women-owned.webp" alt="Women owned" />
          </div>
        </div>

        <div className="funding-note">
          <EuFundingMark className="eu-mark" />
          <p>
            Cocota Studio, S.L. ha participado en el Programa de Iniciación a la Exportación ICEX-Next, y ha contado con el apoyo de ICEX y con la cofinanciación de Fondos europeos FEDER. La finalidad de este apoyo es contribuir al desarrollo internacional de la empresa y de su entorno.
          </p>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <a href="#home">Home</a>
            <span aria-hidden="true">|</span>
            <span>This website consumes 1.28 grams of CO₂</span>
          </div>
          <div className="footer-bottom-right">
            <span>© 2026 Cocota Studio</span>
            <CopyLink href="#contact" label="Privacy Policy" />
            <CopyLink href="#contact" label="Cookies Policy" />
            <CopyLink href="#contact" label="Legal Advice" />
            <CopyLink href="#contact" label="Accessibility" />
          </div>
        </div>
      </div>
    </footer>
  );
}
