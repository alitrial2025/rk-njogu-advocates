export const firm = {
  name: "R. K. Njogu & Company Advocates",
  shortName: "R. K. Njogu",
  tagline: "Legal Solutions Made Practical",
  description:
    "Practical, commercially sound and responsive legal solutions for individuals, businesses and organizations.",
  about: [
    "R. K. Njogu & Company Advocates is a Kenyan law firm providing practical, commercially sound and responsive legal solutions to individuals, businesses and organizations.",
    "We translate legal issues into clear, workable solutions, taking into account the legal, commercial and practical realities of each matter.",
    "Our practice covers commercial and corporate law, land and property, family law, dispute resolution, litigation and debt recovery, with an approach that uses negotiation, alternative dispute resolution or litigation according to the circumstances and objectives of each matter.",
    "The Firm is committed to clarity, responsiveness, confidentiality and professional integrity, and serves clients in Nairobi, Machakos and across Kenya from its office in Kamulu.",
  ],
  values: [
    {
      title: "Clarity",
      description: "Legal issues explained in practical, understandable terms.",
    },
    {
      title: "Responsiveness",
      description: "A considered response to the needs of each matter.",
    },
    {
      title: "Confidentiality",
      description:
        "Respect for the sensitive information entrusted to the firm.",
    },
    {
      title: "Integrity",
      description: "Professional integrity at the centre of our work.",
    },
  ],
  mission:
    "To turn legal challenges into practical solutions that serve our clients’ interests.",
  vision:
    "To build a respected and trusted Kenyan law firm recognized for practical legal solutions, professional integrity and dependable client service.",
  address: {
    building: "Brettonwoods Square (Cooperative Bank Building)",
    suite: "2nd Floor, Suite BW-213",
    locality: "Kamulu",
    road: "Along Kangundo Road",
    postal: "P.O. Box 2341-00200",
    city: "Nairobi",
    lines: [
      "Brettonwoods Square (Cooperative Bank Building)",
      "2nd Floor, Suite BW-213",
      "Kamulu, Along Kangundo Road",
      "P.O. Box 2341-00200, Nairobi",
    ],
  },
  phones: {
    mobile: "0704 652 614",
    office: "0797 096 733",
    whatsapp: ["0704 652 614", "0797 096 733"],
  },
  phoneLinks: {
    mobile: "tel:+254704652614",
    office: "tel:+254797096733",
  },
  whatsappLink: "https://wa.me/254704652614",
  officeWhatsappLink: "https://wa.me/254797096733",
  emails: ["info@rknjoguadvocates.co.ke", "rknjoguadvocate@gmail.com"],
  email: "info@rknjoguadvocates.co.ke",
  officeHours: [
    { days: "Monday–Friday", hours: "8:00 am–5:00 pm" },
    { days: "Saturday", hours: "8:00 am–1:00 pm" },
    { days: "Sunday & public holidays", hours: "Closed" },
  ],
  maps: {
    plusCode: "P397+2G Kamulu",
    url: "https://www.google.com/maps/search/?api=1&query=P397%2B2G%20Kamulu",
    businessUrl: "https://share.google/ylvoiONkW36RoPiQF",
  },
  socialLinks: [
    {
      name: "Facebook",
      url: "https://www.facebook.com/profile.php?id=61561070055399&sk=directory_links",
    },
    {
      name: "LinkedIn",
      url: "https://ke.linkedin.com/in/r-k-njogu-advocates-680524276",
    },
    { name: "X", url: "https://x.com/RKNjoguAdv" },
    { name: "Google Business", url: "https://share.google/ylvoiONkW36RoPiQF" },
  ],
} as const;

export const practiceAreas = [
  {
    id: "personal-injury",
    title: "Personal and Workplace Injury Claims",
    shortTitle: "Personal Injury",
    summary:
      "Advice and representation after road traffic accidents, workplace injuries and other personal injuries.",
    details: [
      "Assessment of personal and workplace injury claims",
      "Advice and representation in road traffic accident matters",
      "Negotiations, defence and settlement of claims",
      "Related court proceedings",
    ],
    icon: "shield",
  },
  {
    id: "legal-advisory",
    title: "General Legal Services & Advisory",
    shortTitle: "Legal Advisory",
    summary:
      "Clear guidance, legal consultations and document preparation for everyday legal needs.",
    details: [
      "Legal consultations and general advisory services",
      "Affidavits and statutory declarations",
      "General legal document preparation",
    ],
    icon: "document",
  },
  {
    id: "land-property",
    title: "Land, Property & Conveyancing",
    shortTitle: "Land & Property",
    summary:
      "Practical support through property transactions, due diligence and land-related disputes.",
    details: [
      "Sale and purchase of property",
      "Preparation and review of sale agreements, leases, transfers and charges",
      "Land searches and due diligence",
      "Subdivisions, consents and registration",
      "Land-related disputes and other property documentation",
    ],
    icon: "building",
  },
  {
    id: "criminal-defence",
    title: "Criminal Law & Defence",
    shortTitle: "Criminal Defence",
    summary:
      "Legal advice and representation in criminal investigations and proceedings.",
    details: [
      "Advice and representation during criminal investigations",
      "Defence of accused persons in criminal proceedings",
      "Watching brief services for complainants and victims",
      "Advice on related criminal law matters",
    ],
    icon: "scales",
  },
  {
    id: "family-law",
    title: "Family Law",
    shortTitle: "Family Law",
    summary:
      "Considered legal support for family matters, from separation to children’s welfare and property.",
    details: [
      "Divorce and separation",
      "Matrimonial property matters",
      "Child custody and maintenance",
      "Other family-related legal matters",
    ],
    icon: "people",
  },
  {
    id: "corporate-company",
    title: "Corporate & Company Secretarial Services",
    shortTitle: "Corporate & Company",
    summary:
      "Support for company formation, corporate documentation, statutory filings and compliance.",
    details: [
      "Company incorporation and eCitizen services",
      "Statutory filings and changes in company particulars",
      "Corporate documentation and compliance",
      "Insolvency-related services",
    ],
    icon: "briefcase",
  },
  {
    id: "employment-labour",
    title: "Employment & Labour Law",
    shortTitle: "Employment & Labour",
    summary:
      "Advice on the working relationship, workplace policies, disciplinary matters and disputes.",
    details: [
      "Employment contracts and workplace policies",
      "Disciplinary matters and termination",
      "Employment disputes",
      "General employment advisory services",
    ],
    icon: "handshake",
  },
  {
    id: "succession-estates",
    title: "Succession, Probate & Estate Planning",
    shortTitle: "Succession & Estates",
    summary:
      "Guidance on wills, succession proceedings and the administration of estates.",
    details: [
      "Wills and estate planning",
      "Probate and letters of administration",
      "Succession proceedings",
      "Estate administration and related advisory services",
    ],
    icon: "book",
  },
  {
    id: "debt-commercial",
    title: "Debt Recovery & Commercial Disputes",
    shortTitle: "Debt & Commercial",
    summary:
      "A practical approach to outstanding debts, negotiated settlements and commercial disputes.",
    details: [
      "Demand letters and negotiated settlements",
      "Debt recovery proceedings",
      "Enforcement of judgments",
      "Commercial disputes",
    ],
    icon: "coins",
  },
] as const;

export type PracticeArea = (typeof practiceAreas)[number];

export const testimonialClients = [
  "Afriavo Orchards Ltd",
  "Apple Orchards Ltd",
  "Femuro Management Ltd",
  "Outrival Human Resource Services Ltd",
] as const;

export const consultationPreparation = [
  "A brief timeline of your matter",
  "Names of the people or organizations involved",
  "Relevant agreements, correspondence or notices",
  "Important dates and upcoming deadlines",
  "Questions you would like to discuss",
] as const;

export const locationPhotos = [
  {
    file: "view-01.jpg",
    alt: "Aerial view of the road through the Kamulu area and the buildings alongside it.",
  },
  {
    file: "view-02.jpg",
    alt: "The road approaching Kamulu with neighbourhoods and green spaces on either side.",
  },
  {
    file: "view-03.jpg",
    alt: "A wide aerial view of buildings, roads and open land around Kamulu.",
  },
  {
    file: "view-04.jpg",
    alt: "Neighbourhood roads and homes in the area surrounding Kamulu.",
  },
  {
    file: "view-05.jpg",
    alt: "A panoramic view of the Kamulu surroundings and horizon.",
  },
  {
    file: "view-06.jpg",
    alt: "The road and roadside buildings in the supplied Kamulu approach photograph.",
  },
  {
    file: "view-07.jpg",
    alt: "A closer aerial view of the main road and roadside buildings in the Kamulu area.",
  },
] as const;

export const faqs = [
  {
    question: "How do I arrange a consultation?",
    answer:
      "Call, WhatsApp or email the firm with a brief description of your matter and your preferred appointment time. The office can confirm availability and explain the next steps. Please avoid sending sensitive documents in your first message.",
  },
  {
    question: "What should I prepare for a first meeting?",
    answer:
      "Prepare a short timeline, the names of the people or organizations involved, and any relevant agreements, correspondence or notices. Note upcoming court dates or deadlines. Ask the office which documents are needed for your particular matter before sharing them.",
  },
  {
    question: "How much will my matter cost?",
    answer:
      "Fees depend on the nature, scope and work required for the matter. Request an individual quote and discuss the proposed scope, professional fees and any additional costs before proceeding. This website does not promise a fixed fee or a free consultation.",
  },
  {
    question: "Does contacting the firm mean you act for me?",
    answer:
      "An enquiry does not by itself create an advocate–client relationship or confirm that the firm has accepted your instructions. Representation must be agreed with the firm. Avoid sending confidential or privileged information through an initial website, email or WhatsApp enquiry until the appropriate arrangements have been confirmed.",
  },
  {
    question: "Can my matter be resolved without going to court?",
    answer:
      "Depending on the circumstances and your objectives, negotiation or alternative dispute resolution may be appropriate. Litigation may be necessary in other matters. The firm can discuss the available approaches after reviewing your situation.",
  },
  {
    question: "Where is the office, and when is it open?",
    answer:
      "The office is at Brettonwoods Square (Cooperative Bank Building), 2nd Floor, Suite BW-213, Kamulu, along Kangundo Road. Office hours are Monday–Friday, 8:00 am–5:00 pm, and Saturday, 8:00 am–1:00 pm. The office is closed on Sundays and public holidays. Contact the firm to arrange an appointment.",
  },
] as const;

const guideDisclaimer =
  "General information only, not legal advice. The right steps depend on the facts of your matter. Seek advice from an advocate before making a legal decision.";

export const guides = [
  {
    id: "before-property-purchase",
    category: "Land & Property",
    title: "Before you commit to a property purchase",
    description:
      "A practical starting point for organizing your questions, documents and due diligence.",
    readingTime: "2 min read",
    paragraphs: [
      "Before committing to a purchase, organize the property description, the seller’s details, the proposed price and payment terms, and any documents you have received. Check that the information is consistent across the documents and make a list of anything that is unclear.",
      "Ask your advocate what searches, document reviews and other due diligence are appropriate for the transaction. Title, authority to sell, boundaries, occupation, consents and any obligations affecting the property may need attention. The checks depend on the property and circumstances.",
      "Have the proposed agreement reviewed before signing or paying a deposit. Make sure you understand what must happen before completion, what costs you are taking on, and how a delay or dispute will be handled. Keep records of agreements, payments and correspondence.",
    ],
    disclaimer: guideDisclaimer,
  },
  {
    id: "prepare-legal-consultation",
    category: "Practical Guidance",
    title: "Make the most of your first legal consultation",
    description:
      "A little preparation helps turn a complicated situation into a useful first conversation.",
    readingTime: "2 min read",
    paragraphs: [
      "Write a brief timeline of what happened, with key dates and the people or organizations involved. Separate what you know from what you are unsure about. Include any upcoming deadline, hearing or notice that needs attention.",
      "Gather relevant documents, such as agreements, letters, emails, notices and payment records. Keep originals safe and ask the office what it needs before sending copies. An initial enquiry should contain a brief overview rather than sensitive personal details.",
      "Think about the outcome you hope to achieve and the questions you need answered. During the meeting, discuss the possible next steps, the proposed work and fees, and how an engagement would be confirmed. Ask for clarification whenever a term or process is unfamiliar.",
    ],
    disclaimer: guideDisclaimer,
  },
  {
    id: "organize-debt-recovery",
    category: "Business & Disputes",
    title: "Organizing the facts of an unpaid debt",
    description:
      "The documents and details that help an advocate understand an outstanding payment.",
    readingTime: "2 min read",
    paragraphs: [
      "Start with the agreement or arrangement that gave rise to the debt. Collect invoices, delivery or service records, proof of payments received, and relevant messages. Note the amount claimed, how it was calculated and when payment was expected.",
      "Record any acknowledgement of the debt, agreed repayment plan or dispute about the work or amount. Keep communications factual and preserve your records. Your advocate can assess the documents and discuss whether a demand, negotiation or proceedings may be appropriate.",
      "Before taking action, discuss the practical objectives, likely work and costs with your advocate. The strength of the claim, available evidence and the circumstances of the debtor can all affect the approach. No recovery outcome can be assumed in advance.",
    ],
    disclaimer: guideDisclaimer,
  },
] as const;

export type LegalGuide = (typeof guides)[number];
