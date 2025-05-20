const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: "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", // Ganti dengan API key kamu
});

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ error: "Gagal mengambil respon dari AI." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
