import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  ArrowRight,
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
  Mail,
  MessageCircle,
  Plus,
  Check,
  MoveUpRight,
} from "lucide-react";
import {
  firm,
  practiceAreas,
  faqs,
  guides,
  type PracticeArea,
  type LegalGuide,
} from "./data";
import { useScrollMotion } from "./useScrollMotion";

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
type Draft = {
  name: string;
  email: string;
  phone: string;
  practice: string;
  message: string;
};

function Wordmark({ footer = false }: { footer?: boolean }) {
  return (
    <a
      className={`wordmark ${footer ? "wordmark-footer" : ""}`}
      href="#home"
      aria-label="R. K. Njogu & Company Advocates — home"
    >
      <span className="brand-seal" aria-hidden="true">
        R<span>K</span>
      </span>
      <span>
        <span className="brand-name">R. K. NJOGU</span>
        <span className="brand-subtitle">& COMPANY ADVOCATES</span>
      </span>
    </a>
  );
}

function Modal({
  children,
  title,
  onClose,
}: {
  children: ReactNode;
  title: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      previous?.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="content-dialog"
      aria-labelledby="dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      <div className="dialog-body">
        <button
          className="close-dialog icon-button"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <X size={22} />
        </button>
        <p className="eyebrow">R. K. NJOGU & COMPANY ADVOCATES</p>
        <h2 id="dialog-title">{title}</h2>
        {children}
      </div>
    </dialog>
  );
}

export default function App() {
  useScrollMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("All services");
  const [modal, setModal] = useState<ModalContent | null>(null);
  const [practice, setPractice] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [copied, setCopied] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const draftRef = useRef<HTMLDivElement>(null);

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

  const visibleAreas = practiceAreas.filter(
    (area) => filter === "All services" || filterIds[filter].includes(area.id),
  );
  const draftText = draft
    ? `Hello R. K. Njogu & Company Advocates,\n\nI would like to discuss ${draft.practice || "a legal matter"}.\n\n${draft.message}\n\nName: ${draft.name}\nEmail: ${draft.email}${draft.phone ? `\nPhone: ${draft.phone}` : ""}\n\nPlease contact me to arrange an initial consultation.`
    : "";
  const draftSubject = `Consultation enquiry${draft?.practice ? ` — ${draft.practice}` : ""}`;
  const mailto = `mailto:${firm.email}?subject=${encodeURIComponent(draftSubject)}&body=${encodeURIComponent(draftText)}`;

  function consult(area?: PracticeArea) {
    if (area) setPractice(area.title);
    setModal(null);
    setDraft(null);
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
            <a href="#approach" onClick={() => setMenuOpen(false)}>
              Our approach
            </a>
            <a href="#insights" onClick={() => setMenuOpen(false)}>
              Insights
            </a>
            <a
              className="nav-contact"
              href="#contact"
              onClick={() => setMenuOpen(false)}
            >
              Let’s talk <ArrowUpRight size={17} />
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
                    Discuss your matter <ArrowUpRight size={19} />
                  </a>
                  <a className="text-link inverse" href="#practice">
                    Explore our expertise <ArrowRight size={17} />
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
                  src={`${import.meta.env.BASE_URL}threshold.webp`}
                  alt=""
                  width="1672"
                  height="941"
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
                <MoveUpRight
                  className="art-symbol"
                  size={21}
                  strokeWidth={1}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
          <div className="container hero-bottom">
            <span>INDIVIDUALS. BUSINESSES. ORGANIZATIONS.</span>
            <a href="#practice">
              Discover how we can help{" "}
              <span className="scroll-indicator" aria-hidden="true">
                ↓
              </span>
            </a>
          </div>
        </section>

        <section className="statement" aria-labelledby="statement-title">
          <div className="container statement-grid">
            <div className="statement-label">
              <span className="eyebrow light">A PRACTICAL PERSPECTIVE</span>
              <span className="statement-symbol" aria-hidden="true">
                ↳
              </span>
            </div>
            <div>
              <h2
                id="statement-title"
                aria-label="Law can be complex. Your next step should feel clear."
              >
                {"Law can be complex. Your next step should feel clear."
                  .split(" ")
                  .map((word, index) => (
                    <span
                      className="statement-word"
                      data-word={word}
                      key={index}
                    >
                      {word}
                    </span>
                  ))}
              </h2>
              <p className="statement-note">
                We bring the legal, commercial and practical realities together,
                so you can make an informed decision.
              </p>
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
                  Life is complex.
                  <br />
                  <em>Your legal advice</em>
                  <br className="mobile-only" /> shouldn’t be.
                </h2>
              </div>
              <p className="section-intro">
                From the first question to the next decision, find practical
                support for the matters that shape your life and business.
              </p>
            </div>
            <div
              className="practice-filters"
              role="group"
              aria-label="Filter practice areas"
            >
              {filters.map((item) => (
                <button
                  key={item}
                  aria-pressed={filter === item}
                  className={filter === item ? "active" : ""}
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <p className="sr-only" aria-live="polite">
              Showing {visibleAreas.length} practice areas.
            </p>
            <div className="practice-grid" data-reveal-group>
              {visibleAreas.map((area) => {
                const Icon = icons[area.icon];
                return (
                  <article className="practice-card" key={area.id}>
                    <div className="card-top">
                      <span className="card-number">
                        {String(practiceAreas.indexOf(area) + 1).padStart(
                          2,
                          "0",
                        )}
                      </span>
                      <Icon strokeWidth={1.3} size={27} aria-hidden="true" />
                    </div>
                    <div className="practice-description">
                      <h3>{area.shortTitle}</h3>
                      <p>{area.summary}</p>
                    </div>
                    <button
                      className="practice-link"
                      aria-label={`Explore practice: ${area.title}`}
                      onClick={() => setModal({ type: "practice", area })}
                    >
                      <span>Explore practice</span> <ArrowUpRight size={24} />
                    </button>
                  </article>
                );
              })}
            </div>
            <div className="practice-foot">
              <p>
                Not sure where to begin? A conversation is a good first step.
              </p>
              <a href="#contact" className="text-link">
                Talk to our team <ArrowRight size={17} />
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
            <div className="about-art" data-reveal>
              <div className="about-orbit" aria-hidden="true">
                <span>R</span>
                <span>K</span>
                <svg viewBox="0 0 300 300">
                  <circle cx="150" cy="150" r="140" />
                </svg>
              </div>
              <div className="about-art-inner">
                <span className="eyebrow light">OUR GUIDING PRINCIPLE</span>
                <blockquote>
                  Sound advice.
                  <br />
                  Practical solutions.
                  <br />
                  <em>Your interests first.</em>
                </blockquote>
                <span className="about-art-rule" />
                <span className="about-art-bottom">
                  R. K. NJOGU & COMPANY ADVOCATES
                </span>
              </div>
            </div>
            <div className="about-copy" data-reveal>
              <p className="eyebrow">02 / THE FIRM</p>
              <h2 id="about-title">
                A clear perspective.
                <br />
                <em>A practical partner.</em>
              </h2>
              <p className="lead">{firm.description}</p>
              <p>{firm.about[1]}</p>
              <p>{firm.about[2]}</p>
              <div className="mission-vision">
                <div>
                  <h3>Our mission</h3>
                  <p>{firm.mission}</p>
                </div>
                <div>
                  <h3>Our vision</h3>
                  <p>{firm.vision}</p>
                </div>
              </div>
              <a className="text-link" href="#approach">
                Get to know our approach <ArrowRight size={17} />
              </a>
            </div>
          </div>
          <div className="container values-row" data-reveal-group>
            {firm.values.map((value, index) => (
              <div key={value.title}>
                <span className="value-number">0{index + 1}</span>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          className="approach section-pad"
          id="approach"
          aria-labelledby="approach-title"
        >
          <div className="container approach-layout">
            <div className="section-heading" data-reveal>
              <div>
                <p className="eyebrow light">03 / OUR APPROACH</p>
                <h2 id="approach-title">
                  First, we
                  <br />
                  <em>understand.</em>
                  <br />
                  Then, we act.
                </h2>
              </div>
              <p className="section-intro inverse-copy">
                No two matters are the same. We consider the legal, commercial
                and practical realities before shaping an approach around your
                objectives.
              </p>
            </div>
            <div className="approach-grid">
              {[
                {
                  title: "We listen.",
                  text: "Start with a conversation about your situation, your concerns and what you want to achieve.",
                  label: "UNDERSTAND",
                },
                {
                  title: "We make it clear.",
                  text: "Understand the available options, the proposed work and the practical considerations before you decide.",
                  label: "ADVISE",
                },
                {
                  title: "We move with purpose.",
                  text: "Negotiation, alternative dispute resolution or litigation — an approach that fits the circumstances of your matter.",
                  label: "ACT",
                },
              ].map((step, index) => (
                <article className="approach-step" data-reveal key={step.label}>
                  <div
                    className={`step-illustration step-illustration-${index}`}
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 240 200" fill="none">
                      {index === 0 ? (
                        <>
                          <circle
                            className="step-track"
                            cx="96"
                            cy="95"
                            r="57"
                          />
                          <circle
                            className="step-track"
                            cx="146"
                            cy="95"
                            r="57"
                          />
                          <circle
                            className="step-trace"
                            cx="96"
                            cy="95"
                            r="57"
                            pathLength="1"
                          />
                          <circle
                            className="step-trace"
                            cx="146"
                            cy="95"
                            r="57"
                            pathLength="1"
                          />
                        </>
                      ) : index === 1 ? (
                        <>
                          <path
                            className="step-track"
                            d="M42 155L120 35L198 155Z M81 155L120 95L159 155"
                          />
                          <path
                            className="step-trace"
                            d="M42 155L120 35L198 155Z M81 155L120 95L159 155"
                            pathLength="1"
                          />
                          <circle
                            className="step-track"
                            cx="120"
                            cy="95"
                            r="65"
                          />
                        </>
                      ) : (
                        <>
                          <path
                            className="step-track"
                            d="M50 150L178 50M105 50H178V123 M50 170H193"
                          />
                          <path
                            className="step-trace"
                            d="M50 150L178 50M105 50H178V123 M50 170H193"
                            pathLength="1"
                          />
                        </>
                      )}
                    </svg>
                  </div>
                  <div className="step-content">
                    <div className="step-top">
                      <span className="step-number">0{index + 1}</span>
                      <ArrowRight
                        size={20}
                        strokeWidth={1}
                        aria-hidden="true"
                      />
                    </div>
                    <span className="eyebrow light">{step.label}</span>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="approach-bottom">
              <p>
                Clarity at every step.
                <br />
                <span>Care in every decision.</span>
              </p>
              <a className="button button-light" href="#contact">
                Start a conversation <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
        </section>

        <section
          className="insights section-pad"
          id="insights"
          aria-labelledby="insights-title"
        >
          <div className="container">
            <div className="section-heading" data-reveal>
              <div>
                <p className="eyebrow">04 / PRACTICAL PERSPECTIVES</p>
                <h2 id="insights-title">
                  A little clarity.
                  <br />
                  <em>A better starting point.</em>
                </h2>
              </div>
              <p className="section-intro">
                Simple guides to help you prepare for the next conversation.
                General information, with your individual circumstances always
                in mind.
              </p>
            </div>
            <div className="insights-grid" data-reveal-group>
              {guides.map((guide, index) => (
                <article className="insight-card" key={guide.id}>
                  <div
                    className={`insight-art insight-art-${index}`}
                    aria-hidden="true"
                  >
                    <span className="illustration-index">0{index + 1}</span>
                    <span className="guide-glyph">
                      {index === 0 ? "§" : index === 1 ? "&" : "¶"}
                    </span>
                    <span className="illustration-word">
                      {index === 0
                        ? "FOUNDATIONS"
                        : index === 1
                          ? "CONVERSATIONS"
                          : "RESOLUTIONS"}
                    </span>
                  </div>
                  <div className="insight-meta">
                    <span>{guide.category}</span>
                    <span>{guide.readingTime}</span>
                  </div>
                  <h3>
                    <button onClick={() => setModal({ type: "guide", guide })}>
                      {guide.title} <ArrowUpRight size={20} />
                    </button>
                  </h3>
                  <p>{guide.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="faq section-pad" aria-labelledby="faq-title">
          <div className="container faq-grid">
            <div data-reveal>
              <p className="eyebrow">A FEW ANSWERS</p>
              <h2 id="faq-title">
                Before we
                <br />
                <em>begin.</em>
              </h2>
              <p className="faq-intro">
                Knowing what to expect makes the first step easier.
              </p>
              <a className="text-link" href="#contact">
                Ask us a question <ArrowRight size={17} />
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
        </section>

        <section
          className="contact section-pad"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="container">
            <div className="section-heading" data-reveal>
              <div>
                <p className="eyebrow">05 / LET’S TALK</p>
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
              <div className="contact-details">
                <a className="contact-phone" href={firm.phoneLinks.mobile}>
                  {firm.phones.mobile}
                  <ArrowUpRight size={22} />
                </a>
                <a className="contact-email" href={`mailto:${firm.email}`}>
                  {firm.email}
                  <ArrowUpRight size={17} />
                </a>
                <div className="contact-quick">
                  <a
                    href={firm.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle size={18} /> WhatsApp{" "}
                    <ArrowUpRight size={15} />
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
                      Get directions <ArrowUpRight size={16} />
                    </a>
                    <span className="plus-code">{firm.maps.plusCode}</span>
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
                    {firm.emails[1]} <ArrowUpRight size={14} />
                  </a>
                  <a
                    href={firm.officeWhatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Office WhatsApp: {firm.phones.office}{" "}
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
              <div className="contact-form-wrap">
                <form
                  onChange={() => {
                    setDraft(null);
                    setCopied(false);
                  }}
                  onSubmit={(event) => {
                    event.preventDefault();
                    const data = new FormData(event.currentTarget);
                    setDraft({
                      name: String(data.get("name")),
                      email: String(data.get("email")),
                      phone: String(data.get("phone")),
                      practice,
                      message: String(data.get("message")),
                    });
                    setCopied(false);
                    setTimeout(() => draftRef.current?.focus(), 0);
                  }}
                >
                  <h3>Start a conversation</h3>
                  <p className="form-description">
                    Prepare an enquiry to send through your email app.
                  </p>
                  <div className="form-row">
                    <label>
                      Your name <span>*</span>
                      <input
                        name="name"
                        autoComplete="name"
                        placeholder="Full name"
                        required
                        maxLength={100}
                      />
                    </label>
                    <label>
                      Email address <span>*</span>
                      <input
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        required
                        maxLength={150}
                      />
                    </label>
                  </div>
                  <div className="form-row">
                    <label>
                      Phone number <span className="optional">(optional)</span>
                      <input
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="07XX XXX XXX"
                        maxLength={30}
                      />
                    </label>
                    <label>
                      Practice area
                      <select
                        name="practice"
                        aria-label="Practice area"
                        value={practice}
                        onChange={(event) => setPractice(event.target.value)}
                      >
                        <option value="">I’m not sure yet</option>
                        {practiceAreas.map((area) => (
                          <option key={area.id}>{area.title}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label>
                    How can we help? <span>*</span>
                    <textarea
                      name="message"
                      rows={4}
                      placeholder="A brief overview of your matter…"
                      required
                      maxLength={1500}
                    />
                  </label>
                  <p className="form-note">
                    Please keep your first enquiry brief and avoid confidential
                    details. An enquiry does not create an advocate–client
                    relationship. Read our{" "}
                    <button
                      type="button"
                      onClick={() => setModal({ type: "privacy" })}
                    >
                      privacy notice
                    </button>
                    .
                  </p>
                  <button className="button button-green" type="submit">
                    Prepare email enquiry <ArrowUpRight size={18} />
                  </button>
                  <p className="handoff-note">
                    <Mail size={14} /> You review and send it in your email app.
                    Nothing is sent here.
                  </p>
                </form>
                {draft && (
                  <div
                    className="email-draft"
                    ref={draftRef}
                    tabIndex={-1}
                    aria-labelledby="draft-title"
                  >
                    <div className="draft-title">
                      <Check size={20} />
                      <h4 id="draft-title">Your email draft is ready</h4>
                    </div>
                    <p>
                      Review your draft, then open your email app to send it. We
                      haven’t sent or stored your enquiry.
                    </p>
                    <pre>{draftText}</pre>
                    <div className="draft-actions">
                      <a className="button button-green" href={mailto}>
                        Open email app <ArrowUpRight size={17} />
                      </a>
                      <button
                        className="text-link"
                        type="button"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(draftText);
                            setCopied(true);
                          } catch {
                            setCopied(false);
                          }
                        }}
                      >
                        {copied ? "Copied" : "Copy draft"}
                      </button>
                    </div>
                    <p className="small-copy" aria-live="polite">
                      {copied
                        ? "Draft copied. Paste it into an email to " +
                          firm.email
                        : "No email app configured? Copy the draft and email " +
                          firm.email +
                          "."}
                    </p>
                  </div>
                )}
              </div>
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
              <MoveUpRight size={23} />
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
              <a href="#insights">Insights</a>
              <a href="#contact">Contact</a>
            </div>
            <div>
              <h3>Connect</h3>
              {firm.socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.name}
                  <ArrowUpRight size={13} />
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
                Find our office <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} R. K. Njogu & Company Advocates.</p>
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
        <ArrowUpRight size={15} />
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
              <button
                className="button button-green"
                onClick={() => consult(modal.area)}
              >
                Discuss this matter <ArrowUpRight size={18} />
              </button>
            </>
          )}
          {modal.type === "guide" && (
            <>
              <p className="guide-category">
                {modal.guide.category} · {modal.guide.readingTime}
              </p>
              {modal.guide.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p className="dialog-note">{modal.guide.disclaimer}</p>
              <button className="button button-green" onClick={() => consult()}>
                Discuss your situation <ArrowUpRight size={18} />
              </button>
            </>
          )}
          {modal.type === "privacy" && (
            <>
              <p>
                This website does not submit your enquiry to a server, store
                form entries in your browser, or use analytics or advertising
                cookies. Form entries remain in page memory until you leave or
                reload the page.
              </p>
              <p>
                “Prepare email enquiry” creates a draft for you to review.
                Opening your email app, sending an email, using WhatsApp or
                visiting external links involves those services’ privacy
                practices. Only send information you are comfortable sharing,
                and avoid confidential details in an initial enquiry.
              </p>
              <p>
                The hosting provider may process technical access logs such as
                IP addresses and request times. This notice should be reviewed
                against the chosen production hosting and any future
                integrations before publication.
              </p>
              <p>
                For questions about information you share with the firm, contact{" "}
                <a href={`mailto:${firm.email}`}>{firm.email}</a>. This notice
                describes the current website and does not replace a privacy
                notice for the firm’s wider client services.
              </p>
            </>
          )}
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
