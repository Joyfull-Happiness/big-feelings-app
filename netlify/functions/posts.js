const { createClient } = require('@supabase/supabase-js');
const Filter = require('bad-words');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);
const filter = new Filter();

const BLOCKED_PATTERNS = [
  /\bn[i1l][g9]{1,2}[e3a]/i, /\bf[a@]gg?[o0]?t/i, /\bk[i1]ke/i, /\bch[i1]nk/i, /\bsp[i1]c/i,
  /\bwetback/i, /\btr[a@]nn/i, /\bretard/i,
  /\b(c[o0]ck|d[i1]ck|p[e3]n[i1]s)\b/i, /\b(pussy|cunt)\b/i,
  /\b(cum|cumm|cumming|jizz)\b/i, /\bf[u\*]ck(ed|ing|s)?\s+(her|him|them|me)\b/i,
  /\b(blow\s?job|hand\s?job|rim\s?job)\b/i, /\b(anal|oral)\s+(sex)\b/i,
  /\bporn/i, /\bhentai/i, /\bnude[s]?\b/i, /\borgy/i,
  /\b(shoot|stab|bomb|attack)\s+(up|them|you|the|a)\b/i,
  /\bshould\s+(all\s+)?die\b/i, /\bdeserve[s]?\s+to\s+die\b/i,
  /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/, /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/,
  /\b(buy\s+now|click\s+here|free\s+money|subscribe|promo\s+code)\b/i,
  /https?:\/\/\S+/i,
];
const THREAT_PATTERNS = [
  /\b(shoot|stab|bomb|attack)\s+(up|them|you|the|a)\b/i,
  /\bshould\s+(all\s+)?die\b/i, /\bdeserve[s]?\s+to\s+die\b/i,
  /\bi('m|\s+am)\s+going\s+to\s+(hurt|harm|end)\b/i,
];

function moderateText(text) {
  if (filter.isProfane(text)) return { safe: false, reason: 'explicit' };
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

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  if (event.httpMethod === 'GET') {
    const { data, error } = await supabase
      .from('posts')
      .select('id, text, feelings, created_at')
      .order('created_at', { ascending: false });
    if (error) return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
    return { statusCode: 200, headers, body: JSON.stringify(data) };
  }

  if (event.httpMethod === 'POST') {
    let body;
    try { body = JSON.parse(event.body || '{}'); } catch { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) }; }
    const { text, feelings = [] } = body;

    if (!text?.trim()) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Text is required.' }) };
    if (text.length > 5000) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Too long.' }) };

    const check = moderateText(text.trim());
    if (!check.safe) return { statusCode: 422, headers, body: JSON.stringify({ blocked: true, reason: check.reason }) };

    const { data, error } = await supabase
      .from('posts')
      .insert({ text: text.trim(), feelings })
      .select('id, text, feelings, created_at')
      .single();
    if (error) return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
    return { statusCode: 201, headers, body: JSON.stringify(data) };
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
};
