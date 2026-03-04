// backend/src/utils/roleTemplates.js
// Scalable dynamic template engine — covers 500+ roles via pattern generation

const path = require("path");
const jobTitles = require("../../data/jobTitles.json");

// ─── Role Category Buckets ──────────────────────────
const ROLE_CATEGORIES = {
  engineering: [
    "Software Engineer", "Frontend Engineer", "Backend Engineer",
    "Full Stack Developer", "DevOps Engineer", "Cloud Engineer",
    "Platform Engineer", "Security Engineer", "QA Engineer",
    "Data Engineer", "Machine Learning Engineer", "AI Engineer",
    "Mobile Developer", "iOS Developer", "Android Developer",
    "Site Reliability Engineer", "Embedded Systems Engineer",
    "Firmware Engineer", "Hardware Engineer", "Robotics Engineer",
  ],
  product: [
    "Product Manager", "Senior Product Manager", "Associate Product Manager",
    "Director of Product", "VP Product", "Chief Product Officer",
    "AI Product Manager", "Chief Product Strategist",
  ],
  marketing: [
    "Marketing Manager", "Growth Marketing Manager", "Performance Marketing Manager",
    "Content Marketing Manager", "SEO Specialist", "SEM Specialist",
    "Head of Marketing", "Chief Marketing Officer", "Brand Manager",
    "Social Media Manager", "Community Manager", "Email Marketing Specialist",
  ],
  sales: [
    "Sales Executive", "Account Executive", "Business Development Manager",
    "Sales Director", "VP Sales", "Head of Partnerships",
    "Enterprise Sales Manager", "Inside Sales Representative",
    "Channel Sales Manager", "Chief Revenue Officer",
  ],
  hr: [
    "HR Manager", "Talent Acquisition Specialist", "Recruiter",
    "Senior Recruiter", "People Operations Manager",
    "Learning and Development Manager", "Chief Human Resources Officer",
    "HR Business Partner", "Head of People", "Chief People Officer",
  ],
  finance: [
    "Finance Manager", "Financial Analyst", "Senior Financial Analyst",
    "VP Finance", "Chief Financial Officer", "Controller",
    "Investment Analyst", "Accounting Manager", "Tax Manager",
  ],
  operations: [
    "Operations Manager", "Supply Chain Manager", "Chief Operating Officer",
    "Program Manager", "Project Manager", "Scrum Master",
    "Logistics Manager", "Procurement Manager",
  ],
  executive: [
    "Founder", "Co-Founder", "Chief Executive Officer",
    "Managing Director", "General Manager", "Chief Strategy Officer",
    "Chief Innovation Officer", "Chief Digital Officer",
  ],
  design: [
    "UX Designer", "UI Designer", "UX Researcher",
    "Interaction Designer", "Graphic Designer", "Creative Director",
    "Art Director",
  ],
  data: [
    "Data Scientist", "Senior Data Scientist", "Data Analyst",
    "Senior Data Analyst", "Business Intelligence Analyst",
    "Quantitative Analyst", "Chief Data Officer", "Chief Analytics Officer",
  ],
  legal: [
    "Legal Counsel", "Corporate Lawyer", "Compliance Officer",
    "Risk Manager", "General Counsel", "Chief Legal Officer",
    "Chief Compliance Officer",
  ],
  healthcare: [
    "Hospital Administrator", "Healthcare Manager",
    "Clinical Research Associate", "Medical Director",
    "Nurse Practitioner", "Physician", "Pharmacist",
  ],
};

// ─── Industry-Specific Openers ──────────────────────
const INDUSTRY_OPENERS = {
  engineering:
    "I've been following the technical innovations at {company}, and the engineering work your team is shipping is impressive.",
  product:
    "I noticed {company} has been rapidly evolving its product offerings — the roadmap decisions your team has made stand out.",
  marketing:
    "Your team's marketing campaigns at {company} have caught my attention — the brand positioning is sharp.",
  sales:
    "I admire how {company} has been scaling its revenue engine — your go-to-market strategy is clearly working.",
  hr:
    "Building great teams is hard, and {company}'s growth tells me your people strategy is on point.",
  finance:
    "The financial discipline at {company} is evident — your team's approach to sustainable growth is noteworthy.",
  operations:
    "Operational excellence is often the unsung hero of scale, and {company} clearly excels here.",
  executive:
    "The vision and leadership at {company} have created something exceptional in the market.",
  design:
    "The user experience at {company} is a cut above — your design team clearly thinks deeply about craft.",
  data:
    "In a data-driven world, {company}'s approach to leveraging insights for growth is impressive.",
  legal:
    "Navigating complex regulatory landscapes is critical, and {company}'s approach is clearly well-thought-out.",
  healthcare:
    "Healthcare innovation requires both expertise and empathy — {company}'s work in this space is commendable.",
  _default:
    "I came across {company} recently and was impressed by the work your team is doing.",
};

// ─── Seniority Detection ────────────────────────────
const SENIORITY_PREFIXES = [
  "Chief", "VP", "Vice President", "Director", "Head of",
  "Senior", "Lead", "Principal", "Staff", "Managing",
];

function detectSeniority(role) {
  const lower = role.toLowerCase();
  for (const prefix of SENIORITY_PREFIXES) {
    if (lower.startsWith(prefix.toLowerCase()) || lower.includes(prefix.toLowerCase())) {
      if (["chief", "vp", "vice president", "managing"].some((p) => lower.startsWith(p))) return "c-suite";
      if (["director", "head of"].some((p) => lower.startsWith(p))) return "director";
      if (["senior", "lead", "principal", "staff"].some((p) => lower.includes(p))) return "senior";
    }
  }
  return "mid";
}

const SENIORITY_MODIFIERS = {
  "c-suite":
    "Given your strategic oversight at {company}, I wanted to reach out directly.",
  director:
    "As someone leading key initiatives at {company}, I thought you'd find this relevant.",
  senior:
    "With your deep expertise in this space, I believe this could be particularly valuable.",
  mid:
    "I think there's a great opportunity here that aligns with the work you're doing.",
};

// ─── Tone Configurations ────────────────────────────
const TONES = {
  Professional: {
    greeting: "Hi",
    closing: "Best regards,",
    style: "clear and business-focused",
  },
  Casual: {
    greeting: "Hey",
    closing: "Cheers,",
    style: "relaxed and conversational",
  },
  Formal: {
    greeting: "Dear",
    closing: "Sincerely,",
    style: "polished and formal",
  },
  Friendly: {
    greeting: "Hi",
    closing: "Warm regards,",
    style: "warm and approachable",
  },
};

// ─── Goal Blocks ────────────────────────────────────
const GOAL_BLOCKS = {
  "Schedule a demo call":
    "I'd love to schedule a brief demo to show you how this could create measurable impact for your team. Would a 15-minute call work for you next week?",
  "Book a meeting":
    "Would you be open to a quick 15-minute chat next week? I'd love to explore how we can add value to what you're building.",
  "Partnership discussion":
    "I believe there are strong partnership synergies worth exploring. Would you be open to a conversation about how we could collaborate?",
  "Product feedback":
    "Your perspective would be incredibly valuable. Would you have 10 minutes to share your thoughts on what we're building?",
  "Hiring opportunity":
    "I'd love to discuss how I could contribute to your team's success. Would you be open to a quick call?",
  "Introduce a product":
    "I'd love to walk you through what we've built — I think it could be a natural fit for what {company} is working on.",
  "Request mentorship":
    "Your career journey is inspiring. If you're open to it, I'd love to pick your brain over a quick virtual coffee.",
  "Investor outreach":
    "We're building something exciting and I'd love to share our traction and vision with you. Would you be open to a short pitch?",
  _default:
    "I'd love to explore this further with you. Would a short call work sometime this week?",
};

// ─── Detect Role Category ───────────────────────────
function detectCategory(role) {
  const lower = role.toLowerCase();
  for (const [category, roles] of Object.entries(ROLE_CATEGORIES)) {
    for (const r of roles) {
      if (lower.includes(r.toLowerCase()) || r.toLowerCase().includes(lower)) {
        return category;
      }
    }
  }
  // Keyword fallback
  if (/engineer|develop|architect|devops|sre|qa|test/i.test(role)) return "engineering";
  if (/product/i.test(role)) return "product";
  if (/market|seo|brand|growth|content/i.test(role)) return "marketing";
  if (/sales|account|business dev|revenue|partnership/i.test(role)) return "sales";
  if (/hr|recruit|talent|people/i.test(role)) return "hr";
  if (/financ|account|cfo|controller|treasury/i.test(role)) return "finance";
  if (/operat|supply|logist|procure|program|project/i.test(role)) return "operations";
  if (/ceo|founder|managing|general manager/i.test(role)) return "executive";
  if (/design|ux|ui|creative|art director/i.test(role)) return "design";
  if (/data|analy|scientist|intelligence/i.test(role)) return "data";
  if (/legal|counsel|compliance|risk/i.test(role)) return "legal";
  if (/health|medic|doctor|nurse|pharm|clinical/i.test(role)) return "healthcare";
  return "_default";
}

// ─── Main Generator ─────────────────────────────────
function generateColdEmail({
  recipientName,
  company,
  role = "",
  goal = "Schedule a demo call",
  tone = "Professional",
  extraContext = "",
}) {
  const toneConfig = TONES[tone] || TONES.Professional;
  const category = role ? detectCategory(role) : "_default";
  const seniority = role ? detectSeniority(role) : "mid";

  // Build subject
  const subjectVariants = [
    `Quick question for ${recipientName}`,
    `Exploring synergies with ${company}`,
    `Idea for ${company} — ${goal.toLowerCase()}`,
    `${recipientName}, a thought on ${goal.toLowerCase()}`,
    `Connecting with ${company}'s ${role || "team"}`,
  ];
  const subject = subjectVariants[Math.floor(Math.random() * subjectVariants.length)];

  // Build opener
  const opener = (INDUSTRY_OPENERS[category] || INDUSTRY_OPENERS._default).replace(
    /\{company\}/g,
    company
  );

  // Seniority line
  const seniorityLine = SENIORITY_MODIFIERS[seniority].replace(/\{company\}/g, company);

  // Goal CTA
  const goalBlock = (GOAL_BLOCKS[goal] || GOAL_BLOCKS._default).replace(
    /\{company\}/g,
    company
  );

  // Compose body
  const body = [
    `${toneConfig.greeting} ${recipientName},`,
    "",
    opener,
    role ? `\nI noticed your role as ${role}${seniority !== "mid" ? " — " + seniorityLine.charAt(0).toLowerCase() + seniorityLine.slice(1) : ""}.` : "",
    seniority === "mid" && role ? `\n${seniorityLine}` : "",
    "",
    goalBlock,
    extraContext ? `\n${extraContext}` : "",
    "",
    toneConfig.closing,
  ]
    .filter(Boolean)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { subject, body };
}

// ─── Validate if a role exists in our coverage ──────
function isKnownRole(role) {
  const lower = role.toLowerCase();
  return jobTitles.some((t) => t.toLowerCase() === lower);
}

module.exports = {
  generateColdEmail,
  detectCategory,
  detectSeniority,
  isKnownRole,
  ROLE_CATEGORIES,
  TONES,
  GOAL_BLOCKS,
};
