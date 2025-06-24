const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { CohereClient } = require("cohere-ai");

dotenv.config();

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/generate", async (req, res) => {
  const { audience, tone, format, context } = req.body;

  const prompt = `Generate a ${tone}, ${format} quote for ${audience} in the context of: ${context}.`;

  try {
    const response = await cohere.generate({
      model: "command",
      prompt: prompt,
      maxTokens: 100,
      temperature: 0.8,
    });

    const quote = response.generations[0].text.trim();
    res.json({ quote });
  } catch (err) {
    console.error("Cohere error:", err.message);
    res.status(500).json({ error: "Quote generation failed." });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Cohere Quote Server running at http://localhost:${PORT}`);
});
