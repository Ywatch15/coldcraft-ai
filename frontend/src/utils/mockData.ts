export const MOCK_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWY5YzRhMmIxYzJkM2U0ZjVhNmI3YzgiLCJlbWFpbCI6InVzZXJAY29sZGNyYWZ0LmRldiIsImlhdCI6MTcxMDk1MzYwMCwiZXhwIjoxNzExNTU4NDAwfQ.mock_signature_here";

export interface GeneratedEmail {
  id: string;
  subject: string;
  body: string;
  metadata: {
    recipientName: string;
    company: string;
    role: string;
    goal: string;
    tone: string;
  };
  createdAt: string;
}

const MOCK_EMAILS: GeneratedEmail[] = [
  {
    id: "1",
    subject: "Partnership Opportunity — Let's Scale Together",
    body: `Hi Sarah,\n\nI came across Stripe's recent expansion into embedded finance and was genuinely impressed by the developer-first approach your team has taken.\n\nAt ColdCraft, we've built an AI-powered outreach platform that helps sales teams generate hyper-personalized cold emails in seconds. Our users have seen a 3x improvement in response rates.\n\nI'd love to explore how a partnership between our platforms could benefit both our user bases. Would you be open to a 15-minute call next week?\n\nBest regards,\nAlex`,
    metadata: { recipientName: "Sarah Chen", company: "Stripe", role: "Head of Partnerships", goal: "Explore partnership", tone: "Professional" },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "2",
    subject: "Quick Question About Your Content Strategy",
    body: `Hey Marcus,\n\nI've been following Buffer's content on social media strategy — the recent piece on algorithmic reach was spot on.\n\nI'm building something that could complement your team's workflow: an AI tool that drafts personalized outreach emails based on prospect data. Think of it as Grammarly meets HubSpot for cold emails.\n\nWould you be interested in trying it out? Happy to set up a free pilot for your team.\n\nCheers,\nAlex`,
    metadata: { recipientName: "Marcus Johnson", company: "Buffer", role: "VP Marketing", goal: "Product demo", tone: "Casual" },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    subject: "Reducing Your Sales Team's Email Drafting Time by 80%",
    body: `Dear Dr. Williams,\n\nI understand that scaling personalized outreach is one of the biggest challenges facing enterprise sales teams today.\n\nOur platform, ColdCraft, leverages advanced AI to generate contextually relevant cold emails that maintain your brand voice while dramatically reducing drafting time. Current enterprise clients report an 80% reduction in email composition time and a 45% increase in positive response rates.\n\nI would welcome the opportunity to present a tailored demonstration for your sales leadership team. Would Thursday or Friday work for a brief call?\n\nRespectfully,\nAlexander Mitchell\nColdCraft Enterprise Solutions`,
    metadata: { recipientName: "Dr. Williams", company: "Salesforce", role: "CRO", goal: "Enterprise demo", tone: "Formal" },
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export function getMockEmails(): GeneratedEmail[] {
  return MOCK_EMAILS;
}

export function generateMockEmail(form: {
  recipientName: string;
  company: string;
  role: string;
  goal: string;
  tone: string;
  extraContext: string;
}): GeneratedEmail {
  const toneMap: Record<string, string> = {
    professional: "I hope this message finds you well.",
    casual: "Hey there! Hope you're having a great day.",
    formal: "I am writing to respectfully introduce",
    friendly: "I've been really excited to reach out to you!",
  };

  const opener = toneMap[form.tone.toLowerCase()] || toneMap.professional;

  return {
    id: Date.now().toString(),
    subject: `${form.goal} — ${form.company} × ColdCraft`,
    body: `Hi ${form.recipientName},\n\n${opener}\n\nI noticed ${form.company}'s work in the industry and was particularly impressed by the innovative direction your team is taking${form.role ? ` as ${form.role}` : ""}.\n\n${form.extraContext ? form.extraContext + "\n\n" : ""}I'd love to connect and discuss how ColdCraft could help ${form.company} achieve ${form.goal.toLowerCase()}. Our AI-powered platform has helped similar companies increase their outreach effectiveness by 3x.\n\nWould you be open to a quick 15-minute call this week?\n\nBest regards,\nAlex`,
    metadata: {
      recipientName: form.recipientName,
      company: form.company,
      role: form.role,
      goal: form.goal,
      tone: form.tone,
    },
    createdAt: new Date().toISOString(),
  };
}
