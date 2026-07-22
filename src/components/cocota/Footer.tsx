import { ArrowIcon } from "./icons";

export function Footer() {
  return (
    <footer className="footer" id="contact" data-reveal>
      <div className="footer-content">
        <h2>AT A GLANCE</h2>

        <div className="footer-links">
          <div>
            <h3>COMPANY</h3>
            <a href="#home">Home</a>
            <a href="#work">Work</a>
            <a href="#about">About</a>
            <a href="#news">Blog</a>
            <a href="#contact">Contact</a>
          </div>
          <div>
            <h3>SERVICES</h3>
            <a href="#services">Brand</a>
            <a href="#services">Web design</a>
            <a href="#services">Campaigns</a>
            <a href="#services">Ongoing Partnership</a>
          </div>
        </div>

        <div className="footer-ctas">
          <a className="footer-cta" href="#news">
            <div>
              <h3>Newsletter</h3>
              <span className="round-arrow dark">
                <ArrowIcon />
              </span>
            </div>
            <p>
              Subscribe to stay in the know! Discover what we&apos;ve been working on and receive cutting-edge design insights.
            </p>
          </a>
          <a className="footer-cta has-sprite" href="mailto:hola@cocotastudio.com">
            <div>
              <h3>Let&apos;s talk</h3>
              <span className="round-arrow dark">
                <ArrowIcon />
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
              Emilio Muñoz 3, 3 Left
              <br />
              28037 Madrid – Spain
            </p>
            <a href="mailto:hola@cocotastudio.com">hola@cocotastudio.com</a>
          </div>
          <div>
            <h3>LONDON</h3>
            <p>
              30 Stamford Street
              <br />
              London, SE1 9LQ — UK
            </p>
            <span>Coming soon…</span>
          </div>
          <div>
            <h3>FOLLOW US</h3>
            <a href="https://www.instagram.com/cocotastudio/">Instagram</a>
            <a href="https://www.linkedin.com/company/cocota-studio/">Linkedin</a>
            <a href="https://clutch.co/profile/cocota">Clutch</a>
            <a href="https://www.awwwards.com/cocotastudio/">Awwwards</a>
          </div>
          <div className="women-owned">
            <img src="/assets/cocota/women-owned.webp" alt="Women owned" />
          </div>
        </div>

        <div className="funding-note">
          <span className="eu-mark">✦ ✦ ✦</span>
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
            <a href="#contact">Privacy Policy</a>
            <a href="#contact">Cookies Policy</a>
            <a href="#contact">Legal Advice</a>
            <a href="#contact">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
