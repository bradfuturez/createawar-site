# createawar-site

Teaser site for CreateAWar (https://createawar.com), hosted on GitHub Pages. Plain static HTML/CSS/JS.

Email signups go straight from the browser to a Neon Postgres table (`signups`, project `createawar`) via the
Neon Data API, using a short-lived anonymous Neon Auth token. The `anonymous` role can only INSERT
email/source/user_agent; it cannot read anything.
