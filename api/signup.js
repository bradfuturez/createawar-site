import { neon } from '@neondatabase/serverless';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const isForm = (req.headers['content-type'] || '').includes('application/x-www-form-urlencoded');
  let body = req.body || {};
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const email = String(body.email || '').trim().toLowerCase();
  const done = (status, payload) => isForm
    ? res.redirect(303, status < 300 ? '/?joined=1#join' : '/#join')
    : res.status(status).json(payload);

  if (body.website) return done(200, { ok: true }); // honeypot: pretend success
  if (!EMAIL_RE.test(email) || email.length > 254) return done(400, { error: 'Please enter a valid email address.' });
  if (!process.env.SIGNUP_DATABASE_URL) return done(503, { error: 'Signups are not open yet. Try again soon.' });

  try {
    const sql = neon(process.env.SIGNUP_DATABASE_URL);
    const ua = String(req.headers['user-agent'] || '').slice(0, 300);
    const country = String(req.headers['x-vercel-ip-country'] || '').slice(0, 8);
    const source = String(body.source || req.headers.host || '').slice(0, 100);
    await sql`INSERT INTO signups (email, source, user_agent, country) VALUES (${email}, ${source}, ${ua}, ${country})`;
    return done(200, { ok: true });
  } catch (err) {
    if (err && err.code === '23505') return done(200, { ok: true }); // already signed up
    console.error('signup failed', err && err.message);
    return done(500, { error: 'Something went wrong. Try again.' });
  }
}
