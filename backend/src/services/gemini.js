const { GoogleGenerativeAI } = require("@google/generative-ai");

let model = null;

function getModel() {
  if (!model) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }
  return model;
}

/**
 * Generate a cold email using Google Gemini.
 *
 * @param {Object} params
 * @param {string} params.recipientName
 * @param {string} params.company
 * @param {string} params.role
 * @param {string} params.goal
 * @param {string} params.tone  — Professional | Casual | Formal | Friendly
 * @param {string} params.extraContext
 * @returns {Promise<{ subject: string, body: string }>}
 */
async function generateEmail({ recipientName, company, role, goal, tone, extraContext }) {
  const prompt = `You are an expert cold email copywriter. Generate a compelling cold email with these details:

Recipient Name: ${recipientName}
Company: ${company}
${role ? `Role: ${role}` : ""}
Goal: ${goal}
Tone: ${tone}
${extraContext ? `Additional Context: ${extraContext}` : ""}

Return ONLY valid JSON in this exact format (no markdown, no code fences):
{
  "subject": "email subject line here",
  "body": "full email body here with \\n for line breaks"
}

Rules:
- Keep it concise (under 200 words for the body)
- Make it personalized and specific to the recipient/company
- Include a clear call-to-action
- Match the requested tone precisely
- Do not include [brackets] or placeholder text
- Use \\n for newlines in the body`;

  const genModel = getModel();

  // Retry up to 2 times on 429 rate-limit errors
  let result;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      result = await genModel.generateContent(prompt);
      break;
    } catch (err) {
      if (err.status === 429 && attempt < 2) {
        const wait = (attempt + 1) * 15_000; // 15s, 30s
        console.log(`Gemini rate-limited, retrying in ${wait / 1000}s (attempt ${attempt + 1}/3)`);
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }
      throw err; // re-throw if not 429 or out of retries
    }
  }

  const text = result.response.text().trim();

  // Strip markdown code fences if present
  const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();

  try {
    const parsed = JSON.parse(cleaned);
    if (!parsed.subject || !parsed.body) {
      throw new Error("Missing subject or body in AI response");
    }
    return { subject: parsed.subject, body: parsed.body };
  } catch (parseErr) {
    console.error("AI response parse error:", parseErr.message, "\nRaw:", text);
    // Fallback: return a basic email
    return {
      subject: `${goal} — ${company}`,
      body: `Hi ${recipientName},\n\nI hope this message finds you well. I noticed ${company}'s impressive work${role ? ` and your role as ${role}` : ""}.\n\nI'd love to connect and discuss ${goal.toLowerCase()}. Would you be open to a quick 15-minute call this week?\n\nBest regards`,
    };
  }
}

module.exports = { generateEmail };
