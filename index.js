require('dotenv').config();
const express = require('express');
const { listEmails, sendEmail } = require('./src/gmail');

const app = express();
app.use(express.json());

app.get('/emails', async (req, res) => {
  try {
    const emails = await listEmails();
    res.json({ emails });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/send', async (req, res) => {
  const { to, subject, body } = req.body;
  try {
    await sendEmail(to, subject, body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
