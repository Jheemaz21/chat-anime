// server.js
const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: "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", // Ganti dengan API key kamu
});
const openai = new OpenAIApi(configuration);

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    res.json({ reply: completion.data.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Gagal mengambil respon dari AI." });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
