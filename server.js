const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_KEY = process.env.ADMIN_KEY || 'vw-foundation-admin';
const DATA_FILE = path.join(__dirname, 'data', 'submissions.json');

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 80 }));
app.use(express.static(path.join(__dirname, 'public')));

async function ensureDataFile() {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  try { await fs.access(DATA_FILE); } catch { await fs.writeFile(DATA_FILE, '[]', 'utf8'); }
}

function cleanText(value = '') {
  return String(value).trim().replace(/[<>]/g, '');
}

function validateSubmission(body) {
  const name = cleanText(body.name);
  const phone = cleanText(body.phone);
  const email = cleanText(body.email);
  const service = cleanText(body.service);
  const message = cleanText(body.message);

  if (!name || name.length < 2) return { error: 'Please enter a valid name.' };
  if (!phone || phone.length < 8) return { error: 'Please enter a valid phone number.' };
  if (!service) return { error: 'Please select a service.' };
  if (!message || message.length < 5) return { error: 'Please write a short message.' };

  return { data: { name, phone, email, service, message } };
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', project: 'VW Foundation Full-Stack Website', backend: 'Express.js', timestamp: new Date().toISOString() });
});

app.post('/api/contact', async (req, res) => {
  const { error, data } = validateSubmission(req.body);
  if (error) return res.status(400).json({ success: false, message: error });

  await ensureDataFile();
  const submissions = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));
  const record = {
    id: Date.now().toString(36),
    ...data,
    status: 'New',
    createdAt: new Date().toISOString(),
    ip: req.ip
  };
  submissions.push(record);
  await fs.writeFile(DATA_FILE, JSON.stringify(submissions, null, 2), 'utf8');
  res.status(201).json({ success: true, message: 'Contact request saved.', id: record.id });
});

app.get('/api/submissions', async (req, res) => {
  if (req.headers['x-admin-key'] !== ADMIN_KEY) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Send x-admin-key header.' });
  }
  await ensureDataFile();
  const submissions = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));
  res.json({ success: true, total: submissions.length, submissions });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

ensureDataFile().then(() => {
  app.listen(PORT, () => console.log(`VW Foundation website running on http://localhost:${PORT}`));
});
