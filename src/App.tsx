import { useEffect, useRef, useState } from "react";
import {
  Scale,
  ShieldCheck,
  FileText,
  Building2,
  UsersRound,
  BriefcaseBusiness,
  Handshake,
  BookOpen,
  Coins,
  Menu,
  X,
  MapPin,
  Phone,
  MessageCircle,
  Plus,
  Check,
} from "lucide-react";
import {
  firm,
  practiceAreas,
  faqs,
  guides,
  locationPhotos,
  type PracticeArea,
  type LegalGuide,
} from "./data";
import { useScrollMotion } from "./useScrollMotion";
import { Tabs } from "./Tabs";
import { Modal, Wordmark } from "./SiteElements";
import { PrivacyNotice } from "./PrivacyNotice";
import { WhatsAppEnquiry } from "./WhatsAppEnquiry";
import {
  PreparationChecklist,
  type PreparationState,
} from "./PreparationChecklist";
import { servicePath } from "./serviceData";

const icons = {
  shield: ShieldCheck,
  document: FileText,
  building: Building2,
  scales: Scale,
  people: UsersRound,
  briefcase: BriefcaseBusiness,
  handshake: Handshake,
  book: BookOpen,
  coins: Coins,
};
const filters = [
  "All services",
  "Individuals & families",
  "Business & employment",
  "Property & estates",
];
const filterIds: Record<string, string[]> = {
  "Individuals & families": [
    "personal-injury",
    "legal-advisory",
    "criminal-defence",
    "family-law",
    "succession-estates",
  ],
  "Business & employment": [
    "corporate-company",
    "employment-labour",
    "debt-commercial",
    "legal-advisory",
  ],
  "Property & estates": ["land-property", "succession-estates"],
};
type ModalContent =
  | { type: "practice"; area: PracticeArea }
  | { type: "guide"; guide: LegalGuide }
  | { type: "privacy" | "terms" };
export default function App() {
  useScrollMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("All services");
  const [firmTab, setFirmTab] = useState("overview");
  const [resourceTab, setResourceTab] = useState("guides");
  const [contactTab, setContactTab] = useState("details");
  const [modal, setModal] = useState<ModalContent | null>(null);
  const [practice, setPractice] = useState("");
  const [locationPhoto, setLocationPhoto] = useState(0);
  const [preparedItems, setPreparedItems] = useState<PreparationState>({});
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [menuOpen]);

  useEffect(() => {
    // Keep existing shared links useful after consolidating the long page.
    const followHash = () => {
      const hash = window.location.hash.slice(1);
      const destinations: Record<string, string> = {
        approach: "about",
        insights: "resources",
        tools: "resources",
        faq: "resources",
        news: "contact",
        visit: "contact",
        social: "social",
      };
      if (hash === "privacy") setModal({ type: "privacy" });
      if (hash === "approach") setFirmTab("approach");
      if (hash === "insights") setResourceTab("guides");
      if (hash === "tools") setResourceTab("prepare");
      if (hash === "faq") setResourceTab("questions");
      if (hash === "visit") setContactTab("visit");
      if (hash === "news") setContactTab("details");
      if (destinations[hash])
        requestAnimationFrame(() => {
          document
            .getElementById(destinations[hash])
            ?.scrollIntoView({ behavior: "instant" });
        });
    };
    // A repeated anchor must reopen its panel even if the hash did not change.
    const repeatAnchor = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>('a[href^="#"]')
          : null;
      if (link && link.getAttribute("href") === window.location.hash)
        followHash();
    };
    followHash();
    window.addEventListener("hashchange", followHash);
    document.addEventListener("click", repeatAnchor);
    return () => {
      window.removeEventListener("hashchange", followHash);
      document.removeEventListener("click", repeatAnchor);
    };
  }, []);

  useEffect(() => {
    const selected = new URLSearchParams(window.location.search).get("matter");
    if (selected && practiceAreas.some((area) => area.id === selected))
      setPractice(selected);
  }, []);

  function consult(area?: PracticeArea) {
    if (area) setPractice(area.id);
    setModal(null);
    setContactTab("details");
    window.location.hash = "contact";
    document.getElementById("contact")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
    window.setTimeout(
      () =>
        document
          .querySelector<HTMLInputElement>('#contact input[name="name"]')
          ?.focus({ preventScroll: true }),
      50,
    );
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="reading-progress" aria-hidden="true" />
        <div className="container header-inner">
          <Wordmark />
          <button
            ref={menuButton}
            className="menu-button icon-button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="primary-nav"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
          <nav
            id="primary-nav"
            className={`primary-nav ${menuOpen ? "is-open" : ""}`}
            aria-label="Main navigation"
          >
            <a href="#about" onClick={() => setMenuOpen(false)}>
              The firm
            </a>
            <a href="#practice" onClick={() => setMenuOpen(false)}>
              Practice areas
            </a>
            <a href="#resources" onClick={() => setMenuOpen(false)}>
              Client resources
            </a>
            <a
              className="nav-contact"
              href="#contact"
              onClick={() => setMenuOpen(false)}
            >
              Let’s talk
            </a>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="hero" id="home" aria-labelledby="hero-title">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow light">
                <span className="tiny-line" /> R. K. NJOGU & COMPANY ADVOCATES
              </p>
              <h1 id="hero-title">
                <span className="hero-line">
                  <span>Legal solutions.</span>
                </span>
                <span className="hero-line">
                  <span>
                    <em>Made practical.</em>
                  </span>
                </span>
              </h1>
              <div className="hero-meta">
                <p className="hero-description">
                  Clear counsel for the moments that matter. Practical advice
                  for your life, your business and what comes next.
                </p>
                <div className="hero-actions">
                  <a className="button button-light" href="#contact">
                    Discuss your matter
                  </a>
                  <a className="text-link inverse" href="#practice">
                    Explore our expertise
                  </a>
                </div>
                <div className="hero-location">
                  <span className="location-marker" aria-hidden="true">
                    <MapPin size={14} />
                  </span>
                  <span>
                    ROOTED IN KAMULU
                    <br />
                    <span className="location-subline">
                      Serving clients across Kenya
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-art">
                <img
                  src={`${import.meta.env.BASE_URL}legal/hero.webp`}
                  alt=""
                  width="1800"
                  height="600"
                  fetchPriority="high"
                />
                <div className="art-topline">
                  <span>GROUNDED IN PRINCIPLE.</span>
                  <span>GUIDED BY YOUR INTERESTS.</span>
                </div>
              </div>
              <div className="art-caption">
                <span>
                  A considered path <em>forward.</em>
                </span>
              </div>
            </div>
          </div>
          <div className="container hero-bottom">
            <span>YOUR NEXT STEP, WITH CLARITY.</span>
            <div className="hero-shortcuts" aria-label="Quick links">
              <a href="#practice">Find legal support</a>
              <a href="#tools">Prepare for a consultation</a>
              <a href="#visit">Find our office</a>
            </div>
          </div>
        </section>

        <section
          className="practice section-pad"
          id="practice"
          aria-labelledby="practice-title"
        >
          <div className="container">
            <div className="section-heading" data-reveal>
              <div>
                <p className="eyebrow">01 / OUR EXPERTISE</p>
                <h2 id="practice-title">
                  The right expertise.
                  <br />
                  <em>For your next step.</em>
                </h2>
              </div>
              <p className="section-intro">
                Choose what matters to you. Explore our nine practice areas,
                then open a service for the details.
              </p>
            </div>
            <Tabs
              id="expertise"
              label="Practice areas by need"
              selected={filter}
              onSelect={setFilter}
              tabs={filters.map((item) => {
                const areas = practiceAreas.filter(
                  (area) =>
                    item === "All services" ||
                    filterIds[item].includes(area.id),
                );
                return {
                  id: item,
                  label: item,
                  count: areas.length,
                  content: (
                    <div className="practice-grid" data-reveal-group>
                      {areas.map((area) => {
                        const Icon = icons[area.icon];
                        return (
                          <article className="practice-card" key={area.id}>
                            <div className="card-top">
                              <span className="card-number">
                                {String(
                                  practiceAreas.indexOf(area) + 1,
                                ).padStart(2, "0")}
                              </span>
                              <Icon
                                strokeWidth={1.3}
                                size={24}
                                aria-hidden="true"
                              />
                            </div>
                            <div className="practice-description">
                              <h3>
                                <a
                                  href={servicePath(
                                    area.id,
                                    import.meta.env.BASE_URL,
                                  )}
                                >
                                  {area.shortTitle}
                                </a>
                              </h3>
                              <p>{area.summary}</p>
                            </div>
                            <button
                              className="practice-link"
                              aria-label={`Explore practice: ${area.title}`}
                              onClick={() =>
                                setModal({ type: "practice", area })
                              }
                            >
                              <span className="sr-only">View details</span>
                              <Plus size={20} aria-hidden="true" />
                            </button>
                          </article>
                        );
                      })}
                    </div>
                  ),
                };
              })}
            />
            <div className="practice-foot">
              <p>
                Not sure where to begin? A conversation is a good first step.
              </p>
              <a href="#contact" className="text-link">
                Talk to our team
              </a>
            </div>
          </div>
        </section>

        <section
          className="about section-pad"
          id="about"
          aria-labelledby="about-title"
        >
          <div className="container about-grid">
            <div className="about-visual">
              <div className="about-art">
                <img
                  className="about-photo"
                  src={`${import.meta.env.BASE_URL}legal/library.webp`}
                  alt=""
                  width="900"
                  height="1200"
                  loading="lazy"
                />
                <div className="about-art-inner">
                  <span className="eyebrow light">ROOTED IN PRINCIPLE</span>
                  <blockquote>
                    Sound advice.
                    <br />
                    <em>Your interests first.</em>
                  </blockquote>
                  <span className="about-art-rule" />
                  <span className="about-art-bottom">
                    KAMULU · NAIROBI · ACROSS KENYA
                  </span>
                </div>
              </div>
            </div>
            <div className="about-copy">
              <p className="eyebrow">02 / THE FIRM</p>
              <h2 id="about-title">
                A clear perspective.
                <br />
                <em>A practical partner.</em>
              </h2>
              <Tabs
                id="firm"
                label="About the firm"
                selected={firmTab}
                onSelect={setFirmTab}
                tabs={[
                  {
                    id: "overview",
                    label: "Who we are",
                    content: (
                      <div className="firm-overview">
                        <p className="lead">{firm.about[0]}</p>
                        {firm.about.slice(1).map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                    ),
                  },
                  {
                    id: "approach",
                    label: "How we work",
                    content: (
                      <div className="firm-approach" id="approach">
                        <p className="panel-intro">
                          A considered path from your first question to an
                          agreed way forward.
                        </p>
                        {[
                          [
                            "We listen.",
                            "Start with your situation, your concerns and what you want to achieve.",
                          ],
                          [
                            "We make it clear.",
                            "Discuss the options, proposed scope, fees and practical considerations before deciding.",
                          ],
                          [
                            "We act with purpose.",
                            "Negotiation, alternative dispute resolution or litigation, shaped around your circumstances and objectives.",
                          ],
                        ].map(([title, text], index) => (
                          <article className="process-row" key={title}>
                            <span>0{index + 1}</span>
                            <div>
                              <h3>{title}</h3>
                              <p>{text}</p>
                            </div>
                          </article>
                        ))}
                        <p className="process-note">
                          Clarity at every step.
                          <br />
                          <em>Care in every decision.</em>
                        </p>
                        <a className="text-link" href="#contact">
                          Discuss your matter
                        </a>
                      </div>
                    ),
                  },
                  {
                    id: "values",
                    label: "Our principles",
                    content: (
                      <div>
                        <div className="principle-grid">
                          {firm.values.map((value) => (
                            <article key={value.title}>
                              <h3>{value.title}</h3>
                              <p>{value.description}</p>
                            </article>
                          ))}
                        </div>
                        <details className="purpose-details">
                          <summary>
                            Our mission & vision{" "}
                            <Plus size={16} aria-hidden="true" />
                          </summary>
                          <h3>Our mission</h3>
                          <p>{firm.mission}</p>
                          <h3>Our vision</h3>
                          <p>{firm.vision}</p>
                        </details>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </section>

        <section
          className="resources section-pad"
          id="resources"
          aria-labelledby="resources-title"
        >
          <div className="container">
            <div className="section-heading" data-reveal>
              <div>
                <p className="eyebrow">03 / CLIENT RESOURCES</p>
                <h2 id="resources-title">
                  A better starting point.
                  <br />
                  <em>Before we begin.</em>
                </h2>
              </div>
              <p className="section-intro">
                Know what to expect, prepare for your consultation, or explore a
                practical legal guide.
              </p>
            </div>
            <Tabs
              id="resources"
              label="Client resources"
              selected={resourceTab}
              onSelect={setResourceTab}
              tabs={[
                {
                  id: "guides",
                  label: "Legal guides",
                  count: guides.length,
                  content: (
                    <div id="insights" className="resource-layout">
                      <div className="resource-note">
                        <BookOpen
                          size={26}
                          strokeWidth={1.2}
                          aria-hidden="true"
                        />
                        <h3>
                          A little knowledge.
                          <br />
                          <em>A clearer conversation.</em>
                        </h3>
                        <p>
                          Short introductions to common legal questions. General
                          information, with your individual circumstances always
                          in mind.
                        </p>
                      </div>
                      <div className="guide-list">
                        {guides.map((guide, index) => (
                          <article className="guide-row" key={guide.id}>
                            <span className="resource-number">
                              0{index + 1}
                            </span>
                            <div>
                              <p className="guide-category">
                                {guide.category} · {guide.readingTime}
                              </p>
                              <h3>
                                <button
                                  onClick={() =>
                                    setModal({ type: "guide", guide })
                                  }
                                >
                                  {guide.title}
                                </button>
                              </h3>
                              <p>{guide.description}</p>
                            </div>
                            <img
                              className="guide-thumbnail"
                              src={`${import.meta.env.BASE_URL}legal/${guide.image}`}
                              alt=""
                              width="720"
                              height="540"
                              loading="lazy"
                              decoding="async"
                            />
                          </article>
                        ))}
                      </div>
                    </div>
                  ),
                },
                {
                  id: "prepare",
                  label: "Consultation checklist",
                  content: (
                    <div className="resource-layout" id="tools">
                      <div className="resource-note">
                        <FileText
                          size={26}
                          strokeWidth={1.2}
                          aria-hidden="true"
                        />
                        <h3>
                          Make your first
                          <br />
                          <em>meeting count.</em>
                        </h3>
                        <p>
                          Gather the essentials, note any deadlines and think
                          about the outcome you need. Tick each item as you
                          prepare.
                        </p>
                        <p className="small-copy">
                          Your checklist stays in this page only. It resets on
                          reload.
                        </p>
                      </div>
                      <PreparationChecklist
                        practiceId={practice}
                        onPracticeChange={setPractice}
                        checkedByMatter={preparedItems}
                        setCheckedByMatter={setPreparedItems}
                        consultationHref="#contact"
                      />
                    </div>
                  ),
                },
                {
                  id: "questions",
                  label: "Common questions",
                  content: (
                    <div className="resource-layout" id="faq">
                      <div className="resource-note">
                        <MessageCircle
                          size={26}
                          strokeWidth={1.2}
                          aria-hidden="true"
                        />
                        <h3>
                          Clarity from
                          <br />
                          <em>the first conversation.</em>
                        </h3>
                        <p>
                          Discuss the proposed work and fees with the firm
                          before an engagement is agreed.
                        </p>
                        <a className="text-link" href="#contact">
                          Ask us a question
                        </a>
                      </div>
                      <div className="faq-list">
                        {faqs.map((item) => (
                          <details key={item.question}>
                            <summary>
                              {item.question}
                              <Plus size={18} aria-hidden="true" />
                            </summary>
                            <p>{item.answer}</p>
                          </details>
                        ))}
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </section>

        <section
          className="contact section-pad"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="container">
            <div className="section-heading" data-reveal>
              <div>
                <p className="eyebrow">04 / LET’S TALK</p>
                <h2 id="contact-title">
                  Your next chapter.
                  <br />
                  <em>Let’s make it clear.</em>
                </h2>
              </div>
              <p className="section-intro">
                Tell us a little about your matter. We’ll help you understand
                how to begin. Prefer a conversation? Call or reach us on
                WhatsApp.
              </p>
            </div>
            <div className="contact-grid">
              <div className="contact-information">
                <Tabs
                  id="contact-info"
                  label="Contact and office information"
                  selected={contactTab}
                  onSelect={setContactTab}
                  tabs={[
                    {
                      id: "details",
                      label: "Contact details",
                      content: (
                        <div className="contact-details">
                          <a
                            className="contact-phone"
                            href={firm.phoneLinks.mobile}
                          >
                            {firm.phones.mobile}
                          </a>
                          <a
                            className="contact-email"
                            href={`mailto:${firm.email}`}
                          >
                            {firm.email}
                          </a>
                          <div className="contact-quick">
                            <a
                              href={firm.whatsappLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <MessageCircle size={18} /> WhatsApp{" "}
                            </a>
                            <a href={firm.phoneLinks.office}>
                              <Phone size={17} /> Office: {firm.phones.office}
                            </a>
                          </div>
                          <div className="office-address">
                            <MapPin size={19} aria-hidden="true" />
                            <div>
                              <h3>Find us in Kamulu</h3>
                              <address>
                                {firm.address.lines.map((line) => (
                                  <span key={line}>{line}</span>
                                ))}
                              </address>
                              <a
                                className="text-link"
                                href={firm.maps.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Get directions
                              </a>
                              <span className="plus-code">
                                {firm.maps.plusCode}
                              </span>
                            </div>
                          </div>
                          <div className="office-hours">
                            <h3>
                              Office hours <span>KENYA TIME · EAT</span>
                            </h3>
                            {firm.officeHours.map((item) => (
                              <div key={item.days}>
                                <span>{item.days}</span>
                                <span>{item.hours}</span>
                              </div>
                            ))}
                          </div>
                          <div className="alternate-contact">
                            <a href={`mailto:${firm.emails[1]}`}>
                              {firm.emails[1]}
                            </a>
                            <a
                              href={firm.officeWhatsappLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Office WhatsApp: {firm.phones.office}{" "}
                            </a>
                          </div>
                        </div>
                      ),
                    },
                    {
                      id: "visit",
                      label: "Find the office",
                      content: (
                        <div id="visit">
                          <h3 className="visit-title">Visit us in Kamulu.</h3>
                          <p className="visit-address">
                            Brettonwoods Square (Cooperative Bank Building)
                            <br />
                            2nd Floor, Suite BW-213 · Along Kangundo Road
                          </p>
                          <div className="visit-gallery" data-reveal>
                            <figure className="visit-photo">
                              <img
                                src={`${import.meta.env.BASE_URL}kamulu/${locationPhotos[locationPhoto].file}`}
                                alt={locationPhotos[locationPhoto].alt}
                                width="1024"
                                height="535"
                                loading="lazy"
                              />
                              <figcaption aria-live="polite">
                                <span>Kamulu and its surroundings</span>
                                <span>
                                  {String(locationPhoto + 1).padStart(2, "0")} /
                                  07
                                </span>
                              </figcaption>
                            </figure>
                            <div
                              className="visit-thumbnails"
                              role="group"
                              aria-label="Kamulu location photos"
                            >
                              {locationPhotos.map((photo, index) => (
                                <button
                                  key={photo.file}
                                  type="button"
                                  aria-label={`View Kamulu photo ${index + 1} of ${locationPhotos.length}`}
                                  aria-pressed={locationPhoto === index}
                                  onClick={() => setLocationPhoto(index)}
                                >
                                  <img
                                    src={`${import.meta.env.BASE_URL}kamulu/${photo.file}`}
                                    alt=""
                                    width="1024"
                                    height="535"
                                    loading="lazy"
                                  />
                                  <span aria-hidden="true">
                                    {String(index + 1).padStart(2, "0")}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                          <p className="gallery-note">
                            These photographs show the surrounding area. Use the
                            map for the office location.
                          </p>
                          <a
                            className="button button-green"
                            href="https://www.google.com/maps/dir/?api=1&destination=P397%2B2G%20Kamulu"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Plan your route
                          </a>
                          <a
                            className="text-link visit-location"
                            href={firm.maps.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Map location: {firm.maps.plusCode}
                          </a>
                        </div>
                      ),
                    },
                  ]}
                />
              </div>
              <WhatsAppEnquiry
                practiceId={practice}
                onPracticeChange={setPractice}
                privacyHref="#privacy"
                onPrivacy={() => setModal({ type: "privacy" })}
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <Wordmark footer />
            <p>
              Legal Solutions
              <br />
              <em>Made Practical.</em>
            </p>
            <a className="footer-back" href="#home" aria-label="Back to top">
              Back to top
            </a>
          </div>
          <div className="footer-grid">
            <div>
              <p className="footer-description">
                Practical legal advice.
                <br />
                Considered representation.
                <br />
                From Kamulu, across Kenya.
              </p>
            </div>
            <div>
              <h3>Explore</h3>
              <a href="#about">The firm</a>
              <a href="#practice">Practice areas</a>
              <a href="#approach">Our approach</a>
              <a href="#resources">Client resources</a>
              <a href="#visit">Visit us in Kamulu</a>
              <a href="#contact">Contact</a>
            </div>
            <div id="social">
              <h3>Connect</h3>
              {firm.socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.name}
                </a>
              ))}
            </div>
            <div className="footer-office">
              <h3>Visit the firm</h3>
              <p>
                Brettonwoods Square
                <br />
                2nd Floor, Suite BW-213
                <br />
                Kamulu, Kangundo Road
                <br />
                Nairobi, Kenya
              </p>
              <a href={firm.maps.url} target="_blank" rel="noopener noreferrer">
                Find our office
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>
              © {new Date().getFullYear()} R. K. Njogu & Company Advocates.
            </p>
            <div>
              <button onClick={() => setModal({ type: "privacy" })}>
                Privacy notice
              </button>
              <button onClick={() => setModal({ type: "terms" })}>
                Website terms
              </button>
            </div>
          </div>
          <p className="legal-note">
            Website content provides general information and does not constitute
            legal advice. Contacting the firm does not confirm an engagement or
            guarantee any outcome.
          </p>
        </div>
      </footer>
      <a
        className="floating-contact"
        href={firm.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with R. K. Njogu Advocates on WhatsApp"
      >
        <MessageCircle size={20} />
        <span>Let’s talk</span>
      </a>

      {modal && (
        <Modal
          title={
            modal.type === "practice"
              ? modal.area.title
              : modal.type === "guide"
                ? modal.guide.title
                : modal.type === "privacy"
                  ? "Privacy notice"
                  : "Website terms"
          }
          onClose={() => setModal(null)}
        >
          {modal.type === "practice" && (
            <>
              <p className="dialog-lead">{modal.area.summary}</p>
              <h3>How we can help</h3>
              <ul className="scope-list">
                {modal.area.details.map((item) => (
                  <li key={item}>
                    <Check size={17} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="dialog-note">
                The right approach depends on your circumstances. Speak with our
                team about your objectives, the proposed scope and fees.
              </p>
              <a
                className="text-link full-service-link"
                href={servicePath(modal.area.id, import.meta.env.BASE_URL)}
              >
                Read the full service guide
              </a>
              <button
                className="button button-green"
                onClick={() => consult(modal.area)}
              >
                Discuss this matter
              </button>
            </>
          )}
          {modal.type === "guide" && (
            <>
              <img
                className="dialog-guide-image"
                src={`${import.meta.env.BASE_URL}legal/${modal.guide.image}`}
                alt=""
                width="720"
                height="540"
              />
              <p className="guide-category">
                {modal.guide.category} · {modal.guide.readingTime}
              </p>
              {modal.guide.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p className="dialog-note">{modal.guide.disclaimer}</p>
              <button className="button button-green" onClick={() => consult()}>
                Discuss your situation
              </button>
            </>
          )}
          {modal.type === "privacy" && <PrivacyNotice />}
          {modal.type === "terms" && (
            <>
              <p>
                This website provides general information about R. K. Njogu &
                Company Advocates and its services. Educational guides are
                general information, not advice for your individual
                circumstances.
              </p>
              <p>
                No advocate–client relationship arises solely from viewing this
                website or submitting an initial enquiry. Representation, scope
                and fees must be agreed with the firm. Do not rely on the
                website to meet a court date, filing requirement or other legal
                deadline.
              </p>
              <p>
                External links are provided for convenience. The firm does not
                control those services. No legal outcome is promised or
                guaranteed. Contact the firm directly to confirm current
                information and discuss your matter.
              </p>
            </>
          )}
        </Modal>
      )}
    </>
  );
}
