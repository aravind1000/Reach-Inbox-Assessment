const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 5000;
const cors = require('cors');

app.get('/', (req, res) => {
    res.send('Backend API is running...');
});

// Middleware
app.use(cors(
    {
        origin: ["https://reach-inbox-frontend.onrender.com"],
        methods: ["POST", "GET","DELETE"],
        credentials: true
    }
));
app.use(express.json());


// Route to fetch emails
app.get('/api/emails', async (req, res) => {
  try {
    const response = await axios.get('https://hiring.reachinbox.xyz/api/v1/onebox/list', {
      headers: {
        Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching emails:', error.message);
    res.status(500).json({ message: 'Failed to fetch emails' });
  }
});

// Route to delete an email
app.delete('/api/emails/:threadId', async (req, res) => {
  const { threadId } = req.params;

  try {
    const response = await axios.delete(`https://hiring.reachinbox.xyz/api/v1/onebox/messages/${threadId}`, {
      headers: {
        Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error deleting email:', error.message);
    res.status(500).json({ message: 'Failed to delete email' });
  }
});

// Route to reply to an email
app.post('/api/emails/reply/:threadId', async (req, res) => {
  const { threadId } = req.params;
  const { to, subject, body } = req.body;

  try {
    const response = await axios.post(
      `https://hiring.reachinbox.xyz/api/v1/onebox/reply/${threadId}`,
      { to, subject, body },
      {
        headers: {
          Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
        },
      }
    );
    res.status(200).json({ message: `Reply sent to thread ${threadId}`, data: response.data });
  } catch (error) {
    console.error('Error sending reply:', error.message);
    res.status(500).json({ message: 'Failed to send reply' });
  }
});

// Route to reset inbox
app.get('/api/emails/reset', async (req, res) => {
  try {
    const response = await axios.get('https://hiring.reachinbox.xyz/api/v1/onebox/reset', {
      headers: {
        Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching emails:', error.message);
    res.status(500).json({ message: 'Failed to reset Inbox' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
