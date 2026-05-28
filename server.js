const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const Filter = require('bad-words');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const filter = new Filter();

// ─── SERVER-SIDE MODERATION (mirrors client patterns) ───
const BLOCKED_PATTERNS = [
  /\bn[i1l][g9]{1,2}[e3a]/i, /\bf[a@]gg?[o0]?t/i, /\bk[i1]ke/i, /\bch[i1]nk/i, /\bsp[i1]c/i,
  /\bwetback/i, /\btr[a@]nn/i, /\bretard/i,
  /\b(c[o0]ck|d[i1]ck|p[e3]n[i1]s)\b/i, /\b(pussy|cunt)\b/i,
  /\b(cum|cumm|cumming|jizz)\b/i, /\bf[u\*]ck(ed|ing|s)?\s+(her|him|them|me)\b/i,
  /\b(blow\s?job|hand\s?job|rim\s?job)\b/i, /\b(anal|oral)\s+(sex)\b/i,
  /\bporn/i, /\bhentai/i, /\bnude[s]?\b/i, /\borgy/i,
  /\b(shoot|stab|bomb|attack)\s+(up|them|you|the|a)\b/i,
  /\bshould\s+(all\s+)?die\b/i, /\bdeserve[s]?\s+to\s+die\b/i,
  /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/,
  /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/,
  /\b(buy\s+now|click\s+here|free\s+money|subscribe|promo\s+code)\b/i,
  /https?:\/\/\S+/i,
];
const THREAT_PATTERNS = [
  /\b(shoot|stab|bomb|attack)\s+(up|them|you|the|a)\b/i,
  /\bshould\s+(all\s+)?die\b/i, /\bdeserve[s]?\s+to\s+die\b/i,
  /\bi('m|\s+am)\s+going\s+to\s+(hurt|harm|end)\b/i,
];

function moderateText(text) {
  // bad-words catches common profanity
  if (filter.isProfane(text)) {
    return { safe: false, reason: 'explicit' };
  }
  // regex patterns catch the rest
  for (const p of BLOCKED_PATTERNS) {
    if (p.test(text)) {
      for (const t of THREAT_PATTERNS) { if (t.test(text)) return { safe: false, reason: 'threat' }; }
      if (/https?:\/\/|buy\s+now|click\s+here|promo/i.test(text)) return { safe: false, reason: 'spam' };
      if (/\b\d{3}[-.\s]?\d{2,3}[-.\s]?\d{4}\b/.test(text)) return { safe: false, reason: 'personal-info' };
      return { safe: false, reason: 'explicit' };
    }
  }
  return { safe: true };
}

// ─── GET /api/posts ───
app.get('/api/posts', async (req, res) => {
  const { data, error } = await supabase
    .from('posts')
    .select('id, text, feelings, created_at')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ─── POST /api/posts ───
app.post('/api/posts', async (req, res) => {
  const { text, feelings = [] } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Text is required.' });
  }
  if (text.length > 5000) {
    return res.status(400).json({ error: 'Too long.' });
  }

  const check = moderateText(text.trim());
  if (!check.safe) {
    return res.status(422).json({ blocked: true, reason: check.reason });
  }

  const { data, error } = await supabase
    .from('posts')
    .insert({ text: text.trim(), feelings })
    .select('id, text, feelings, created_at')
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
