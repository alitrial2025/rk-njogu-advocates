import { useState } from "react";
import { Check, Menu, MessageCircle, Phone, X } from "lucide-react";
import { firm, practiceAreas, type PracticeArea } from "./data";
import { serviceGuidance, servicePath } from "./serviceData";
import {
  PreparationChecklist,
  type PreparationState,
} from "./PreparationChecklist";
import { WhatsAppEnquiry } from "./WhatsAppEnquiry";
import { Modal, Wordmark } from "./SiteElements";
import { PrivacyNotice } from "./PrivacyNotice";

export function ServicePage({ area }: { area: PracticeArea }) {
  const base = import.meta.env.BASE_URL;
  const guidance = serviceGuidance[area.id];
  const [practiceId, setPracticeId] = useState<string>(area.id);
  const [checked, setChecked] = useState<PreparationState>({});
  const [privacy, setPrivacy] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const selectedArea = practiceAreas.find((item) => item.id === practiceId);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header service-header">
        <div className="container header-inner">
          <Wordmark href={`${base}#home`} />
          <button
            className="menu-button icon-button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="service-nav"
            onClick={() => setMenuOpen(!menuOpen)}
            onKeyDown={(event) => {
              if (event.key === "Escape") setMenuOpen(false);
            }}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
          <nav
            id="service-nav"
            className={`primary-nav ${menuOpen ? "is-open" : ""}`}
            aria-label="Main navigation"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setMenuOpen(false);
                document
                  .querySelector<HTMLButtonElement>(
                    ".service-header .menu-button",
                  )
                  ?.focus();
              }
            }}
          >
            <a href={`${base}#about`}>The firm</a>
            <a href={`${base}#practice`}>All practice areas</a>
            <a href="#preparation" onClick={() => setMenuOpen(false)}>
              Prepare for your meeting
            </a>
            <a
              className="nav-contact"
              href="#consultation"
              onClick={() => setMenuOpen(false)}
            >
              Let’s talk
            </a>
          </nav>
        </div>
      </header>
      <main id="main" className="service-page">
        <section className="service-hero" aria-labelledby="service-title">
          <div className="container">
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <a href={base}>Home</a>
              <span aria-hidden="true">/</span>
              <a href={`${base}#practice`}>Practice areas</a>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{area.shortTitle}</span>
            </nav>
            <div className="service-hero-grid">
              <div>
                <p className="eyebrow light">PRACTICAL LEGAL SUPPORT · KENYA</p>
                <h1 id="service-title">{area.title}</h1>
                <p className="service-summary">{area.summary}</p>
                <div className="service-actions">
                  <a className="button button-light" href="#consultation">
                    Discuss your matter
                  </a>
                  <a className="text-link inverse" href="#preparation">
                    Prepare for a consultation
                  </a>
                </div>
                <p className="service-locality">
                  Based in Kamulu. Serving Nairobi, Machakos and clients across
                  Kenya.
                </p>
              </div>
              <figure className="service-image">
                <img
                  src={`${base}legal/${guidance.image}`}
                  alt=""
                  width={guidance.image === "library.webp" ? 900 : 720}
                  height={guidance.image === "library.webp" ? 1200 : 540}
                  fetchPriority="high"
                />
                <figcaption>
                  Considered advice. Practical next steps.
                </figcaption>
              </figure>
            </div>
          </div>
        </section>
        <section
          className="service-detail section-pad"
          aria-labelledby="service-scope-title"
        >
          <div className="container service-detail-grid">
            <div className="service-scope">
              <p className="eyebrow">YOUR MATTER, IN CONTEXT</p>
              <h2 id="service-scope-title">
                How we can <em>help.</em>
              </h2>
              <p className="service-introduction">{guidance.introduction}</p>
              <ul className="scope-list">
                {area.details.map((item) => (
                  <li key={item}>
                    <Check size={18} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="service-expectations">
                <h3>What happens next?</h3>
                <ol>
                  <li>Share a brief outline and note any upcoming dates.</li>
                  <li>
                    Discuss the information needed, available approaches, scope
                    and fees.
                  </li>
                  <li>
                    Confirm the engagement and appropriate way to share
                    documents with the firm.
                  </li>
                </ol>
              </div>
              <p className="service-information-note">
                General information only, not legal advice. The appropriate
                steps depend on your circumstances. A website enquiry does not
                confirm representation, an appointment or any legal outcome.
              </p>
            </div>
            <div id="preparation" className="service-preparation">
              <p className="eyebrow">BEFORE YOUR FIRST MEETING</p>
              <PreparationChecklist
                practiceId={practiceId}
                onPracticeChange={setPracticeId}
                checkedByMatter={checked}
                setCheckedByMatter={setChecked}
                consultationHref="#consultation"
              />
              {selectedArea && selectedArea.id !== area.id && (
                <a
                  className="text-link"
                  href={servicePath(selectedArea.id, base)}
                >
                  Read our {selectedArea.shortTitle} service guide
                </a>
              )}
            </div>
          </div>
        </section>
        <section
          id="consultation"
          className="service-consultation section-pad"
          aria-labelledby="consultation-title"
        >
          <div className="container service-consultation-grid">
            <div>
              <p className="eyebrow">LET’S TALK</p>
              <h2 id="consultation-title">
                A conversation.
                <br />
                <em>A clearer next step.</em>
              </h2>
              <p>
                Send a brief enquiry to the firm on WhatsApp. Ask the team to
                confirm receipt, appointment availability and any consultation
                fee in the chat.
              </p>
              <a
                className="service-direct-contact"
                href={firm.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={19} aria-hidden="true" />
                WhatsApp {firm.phones.mobile}
              </a>
              <a
                className="service-direct-contact"
                href={firm.phoneLinks.mobile}
              >
                <Phone size={18} aria-hidden="true" />
                Call {firm.phones.mobile}
              </a>
              <div className="service-hours">
                <h3>Office hours · Kenya time</h3>
                {firm.officeHours.map((item) => (
                  <p key={item.days}>
                    <span>{item.days}</span>
                    <span>{item.hours}</span>
                  </p>
                ))}
              </div>
              <address>
                {firm.address.lines.map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
              </address>
              <a
                className="text-link"
                href={firm.maps.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Office map & directions
              </a>
            </div>
            <WhatsAppEnquiry
              practiceId={practiceId}
              onPracticeChange={setPracticeId}
              privacyHref="#privacy"
              onPrivacy={() => setPrivacy(true)}
            />
          </div>
        </section>
        <section
          className="related-services section-pad"
          aria-labelledby="related-title"
        >
          <div className="container">
            <p className="eyebrow">EXPLORE THE FIRM’S EXPERTISE</p>
            <h2 id="related-title">
              Other ways we can <em>help.</em>
            </h2>
            <div className="related-service-links">
              {practiceAreas
                .filter((item) => item.id !== area.id)
                .map((item) => (
                  <a key={item.id} href={servicePath(item.id, base)}>
                    {item.shortTitle}
                  </a>
                ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer service-footer">
        <div className="container">
          <div className="footer-top">
            <Wordmark footer href={base} />
            <a className="text-link inverse" href={`${base}#contact`}>
              All contact details
            </a>
          </div>
          <div className="footer-bottom">
            <p>
              © {new Date().getFullYear()} {firm.name}.
            </p>
            <button onClick={() => setPrivacy(true)}>Privacy notice</button>
          </div>
          <p className="legal-note">
            Website content is general information. Scope, representation,
            appointments and fees must be agreed with the firm.
          </p>
        </div>
      </footer>
      {privacy && (
        <Modal title="Privacy notice" onClose={() => setPrivacy(false)}>
          <PrivacyNotice />
        </Modal>
      )}
    </>
  );
}
