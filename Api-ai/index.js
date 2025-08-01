const express = require('express');
const app = express();
app.use(express.json());

// Endpoint /ask (dummy)
app.post('/ask', (req, res) => {
  const { question } = req.body;
  // Placeholder: Integrasi ke OpenAI API nanti
  res.json({ answer: `Jawaban AI untuk: ${question}` });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`AI Tutor server running on port ${PORT}`);
});
