# solveCV

Free AI tools and a live job board for job seekers. Clean-room build; no code or copy taken from any existing site.

## What is in it

- **Job board** — listings pulled from four free public APIs (Arbeitnow, Remotive, Jobicy, RemoteOK), cached 30 minutes, filtered by search, country, category and job type. Every listing links to the original posting.
- **28 tools** — ATS resume checker (local scoring: keywords 40 / format 30 / relevance 30), resume builder (A4 print preview), and 22 AI tools (cover letter, cold email, JD decoder, HR email decoder, job kit, mock interview, salary negotiation, skill gap, SOP, LinkedIn x3, and more), plus a notice-period calculator, offer comparison, and a browser-local application tracker.
- **Extras** — guides, Learn AI outlines, weekly job alerts, post-a-job page, sitemap, privacy and terms.

## Run locally

```bash
npm install
npm run dev
```

## Deploy on Vercel

1. Push this repo to GitHub and import it in Vercel.
2. Set the environment variable `GEMINI_API_KEY` (get a key at aistudio.google.com). The AI tools fail with a clear message until it is set.
3. Optional: set `ALERTS_WEBHOOK_URL` to an email-provider endpoint (Buttondown, Mailchimp, Resend) to switch on job alerts. Without it, the subscribe form says delivery is not wired up.
4. Optional: set `NEXT_PUBLIC_SITE_URL` to the live domain for sitemap/robots.
5. Deploy. The job index fills on the first request after deploy.

## Where data lives

- Application tracker and tool history: browser localStorage (`solvecv:apps`, `solvecv:history`). Nothing is stored server-side.
- Job index: in-memory cache, 30-minute TTL, refetched per cold start. No database needed.
