# createawar-site

Teaser site for CreateAWar (https://createawar.com), hosted on GitHub Pages. Plain static HTML/CSS/JS.

Email signups go straight from the browser to a Neon Postgres table (`signups`, project `createawar`) via the
Neon Data API, using a short-lived anonymous Neon Auth token. The `anonymous` role can only INSERT
email/source/user_agent; it cannot read anything.

## Support / funds ledger

Public Support page: `support.html` (https://createawar.com/support.html).

Edit `data/funds-ledger.json` and push to update donated / spent totals and lists.
Donations: `{ "date": "YYYY-MM-DD", "amount": 10, "note": "optional public note" }`
Spends: `{ "date": "YYYY-MM-DD", "amount": 25, "what": "short label", "why": "why it helps" }`
Never put personal names or emails. Ko-fi URL is in `kofiUrl` (placeholder until Brad claims the page).
