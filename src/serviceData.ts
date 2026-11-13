import type { PracticeArea } from "./data";

export type ServiceGuidance = {
  introduction: string;
  preparation: readonly string[];
  questions: readonly string[];
  image: string;
};

export const serviceGuidance = {
  "personal-injury": {
    introduction:
      "An injury claim starts with understanding what happened, the records available and the impact on your life or work. The firm can assess your circumstances and discuss the appropriate route for advice, negotiation or proceedings.",
    preparation: [
      "A dated account of the accident or workplace incident",
      "Medical reports, treatment records and related receipts, if available",
      "Police, employer or insurer correspondence and reference numbers",
      "Records of expenses or time away from work",
      "Any notices, existing claim documents and upcoming dates",
    ],
    questions: [
      "Which records would help assess my circumstances?",
      "What steps and time limits need to be considered?",
      "What work, fees and other costs would be involved?",
    ],
    image: "consultation.webp",
  },
  "legal-advisory": {
    introduction:
      "A clear account of your question helps the firm identify the advice or document you need. Discuss the purpose of a proposed document, who will rely on it and any requirements you have been given before work begins.",
    preparation: [
      "A short explanation of the question or document you need",
      "Any draft documents, forms or written requirements you received",
      "Names and roles of the people or organisations involved",
      "Relevant correspondence and supporting records",
      "The purpose of the document and any deadline",
    ],
    questions: [
      "What information is needed for this advice or document?",
      "Who needs to review or sign the document?",
      "What is included in the proposed scope and fee?",
    ],
    image: "library.webp",
  },
  "land-property": {
    introduction:
      "A property matter can involve documents, ownership questions and practical obligations that need to be considered together. The firm can review a proposed transaction or dispute and explain the appropriate searches, document work and next steps for your circumstances.",
    preparation: [
      "Property reference, location and title information, if available",
      "Any proposed sale agreement, lease or other property documents",
      "Seller, buyer, landlord or tenant details relevant to the matter",
      "Payment records and correspondence about the transaction or dispute",
      "Proposed completion dates, notices and questions about the property",
    ],
    questions: [
      "Which searches and document checks are appropriate?",
      "What obligations should I understand before signing?",
      "What professional fees and transaction costs should I plan for?",
    ],
    image: "property.webp",
  },
  "criminal-defence": {
    introduction:
      "The stage of an investigation or court matter and any upcoming date are important to the first conversation. The firm advises and represents accused persons and provides watching brief services for complainants and victims, according to the matter and agreed instructions.",
    preparation: [
      "A short timeline and your role in the matter",
      "Any summons, charge sheet, court notice or reference number",
      "Dates of any scheduled court appearance or required attendance",
      "Relevant correspondence or documents already in your possession",
      "Details of any existing representation or orders, if applicable",
    ],
    questions: [
      "What information is needed to understand the current stage?",
      "Are there upcoming dates that require immediate attention?",
      "What would the proposed representation cover?",
    ],
    image: "library.webp",
  },
  "family-law": {
    introduction:
      "Family matters need a considered discussion of the circumstances, the people affected and the outcome you are seeking. The firm can explain options concerning separation, children, maintenance or matrimonial property and discuss an appropriate approach.",
    preparation: [
      "A brief timeline of the family matter and your main concerns",
      "Any existing agreements, court papers or orders",
      "Relevant marriage or family records, if available",
      "Relevant financial or property records for the issues you wish to discuss",
      "Upcoming dates and questions about children, support or property",
    ],
    questions: [
      "What information is relevant to the issues I want to address?",
      "Could discussion or another dispute-resolution process be appropriate?",
      "How would the scope, fees and next steps be agreed?",
    ],
    image: "consultation.webp",
  },
  "corporate-company": {
    introduction:
      "Company work depends on the organisation's current position and the change or transaction it wants to complete. The firm can help with incorporation, corporate documents, statutory filings and compliance, as well as insolvency-related services within the agreed scope.",
    preparation: [
      "Company name, registration details or proposed business structure",
      "Relevant incorporation and current company records, if available",
      "Details of the proposed formation, filing or change",
      "Existing corporate documents and relevant correspondence",
      "Known filing dates, notices and the intended business outcome",
    ],
    questions: [
      "Which company records are needed for this work?",
      "What filings, approvals or document changes should be considered?",
      "Which work and costs are included in the engagement?",
    ],
    image: "commercial.webp",
  },
  "employment-labour": {
    introduction:
      "The employment documents, sequence of events and concerns of the employee or employer provide the starting point. The firm advises on contracts, workplace policies, disciplinary processes, termination and employment disputes, taking account of the particular circumstances.",
    preparation: [
      "Employment contract and relevant workplace policies",
      "A timeline of the employment issue and your role",
      "Relevant letters, notices, emails or disciplinary records",
      "Relevant payslips or payment records, if applicable",
      "Any hearing, response or other upcoming date",
    ],
    questions: [
      "Which contract terms and records need to be reviewed?",
      "What options and dates should I understand?",
      "What would advice or representation involve and cost?",
    ],
    image: "consultation.webp",
  },
  "succession-estates": {
    introduction:
      "Estate planning and administration begin with understanding the family circumstances, available records and the work required. The firm can advise on wills, probate, letters of administration, succession proceedings and estate administration.",
    preparation: [
      "Whether you need estate planning or assistance with an existing estate",
      "Any existing will, grant, court papers or relevant notices",
      "Relevant family information and available identification records",
      "An outline of the estate's assets, liabilities and available records",
      "Known dates, pending questions or issues requiring advice",
    ],
    questions: [
      "Which records are needed for my planning or estate matter?",
      "What process and responsibilities should be discussed?",
      "What work, professional fees and other costs may be involved?",
    ],
    image: "property.webp",
  },
  "debt-commercial": {
    introduction:
      "An organised record of the agreement, amounts and communications helps the firm assess a commercial dispute. Discuss the evidence, practical objectives and costs before deciding whether a demand, negotiation or proceedings are appropriate.",
    preparation: [
      "The contract, order or agreement underlying the debt or dispute",
      "Invoices and delivery or service records, if available",
      "A statement of amounts claimed and payments received",
      "Correspondence about payment, disputed work or repayment arrangements",
      "Any demand, court papers, judgment or upcoming date",
    ],
    questions: [
      "What evidence supports the claim or response?",
      "Could negotiation be appropriate before proceedings?",
      "What costs and practical considerations affect the available options?",
    ],
    image: "commercial.webp",
  },
} satisfies Record<PracticeArea["id"], ServiceGuidance>;

export function servicePath(id: PracticeArea["id"], base: string) {
  return `${base}services/${id}/`;
}

export const siteURL = "https://alitrial2025.github.io/rk-njogu-advocates/";
