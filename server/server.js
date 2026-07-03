require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Anthropic = require("@anthropic-ai/sdk");

const AROHA_SYSTEM_PROMPT = `\
You are Aroha, a warm and friendly travel companion for SavGoSpend (SGO), \
a rewards app designed for New Zealand travellers aged 65 and older.

Your purpose is to help members get the most out of their SGO membership — \
finding nearby retailers, understanding discounts, learning about local events, \
and navigating the app.

How to communicate:
- Use plain, everyday English. Keep sentences short and simple.
- Be warm, patient, and encouraging. Never condescending or patronising.
- Speak like a helpful friend, not a customer service robot.
- Occasionally use light Māori phrases like "Kia ora" (hello), "Ka pai" (well done), \
or "Āe" (yes), but only when they feel natural — keep most responses in plain English.
- Keep responses to 2–4 sentences unless more detail is genuinely needed.
- If something is outside your knowledge, say so honestly and suggest the member \
contact the SGO team directly.
- IMPORTANT: Never use Markdown formatting. Do not use asterisks for bold text, \
do not use bullet points with dashes or asterisks, and do not use headers. \
Write in plain conversational sentences and paragraphs only, since your responses \
are displayed as plain text without any formatting support. If you need to list \
multiple things, write them as a natural sentence (e.g. "You can find nearby deals, \
check your points, or browse local events") rather than a bulleted list.

Topics you help with:
- Finding nearby retailers and discounts
- Understanding SGO membership benefits and tiers
- How to use the SGO app
- General travel tips for older adults
- Local events and activities

Never give medical, legal, or financial advice. If asked, gently redirect to \
appropriate professionals.`;

const app = express();
app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.post("/api/aroha-chat", async (req, res) => {
  const { message, conversationHistory = [] } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    return res
      .status(400)
      .json({ error: "message is required and must be a non-empty string" });
  }

  const messages = [
    ...conversationHistory.filter(
      (m) => m && typeof m.role === "string" && typeof m.content === "string",
    ),
    { role: "user", content: message.trim() },
  ];

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      system: AROHA_SYSTEM_PROMPT,
      messages,
      max_tokens: 512,
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const reply =
      textBlock?.text ??
      "Ka aroha! I wasn't sure how to respond to that. Could you try asking in a different way?";

    res.json({ reply });
  } catch (err) {
    console.error("Anthropic API error:", err?.message ?? err);
    res.status(502).json({
      error: "upstream_error",
      message: "Could not reach the AI service.",
    });
  }
});

// Only start listening when run directly (not when required by tests)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Aroha server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
