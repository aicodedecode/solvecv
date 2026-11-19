# SolveCV design direction

Product: free job board plus AI career tools for job seekers, India-heavy.
Audience: job seekers, freshers to mid-level, often on phones, often stressed.
Mood: workwear utility. A document, not a dashboard. Calm, dense, honest.

Palette (2 core + 1 accent, no gradients anywhere):
- paper #f6f4ee (warm off-white, the page itself, like good resume paper)
- ink #1c1a16 (text, borders, primary buttons)
- moss #0e6b3f (one accent: scores, links, the primary CTA shadow, active states)
- mute #6b675e for secondary text. No other colors except semantic red for errors.

Typography:
- Display and headings: Georgia serif, tight leading. Feels editorial, not startup.
- Body and UI: system-ui sans.
- Numbers, scores, dates, stats: ui-monospace. Numbers are the product's currency,
  so they get their own voice.

Surfaces:
- 1px hairline borders (ink at 14%), radius 2px. Cards are flat. No shadows except
  one hard offset shadow (3px 3px 0 moss) on the single primary CTA.
- Section rhythm varies: some sections are dense lists, some are open prose,
  the stats band is a black strip with paper text. No repeated card-grid cadence.
- No glass, no glow, no grid background, no colored left stripes, no arrow on every
  button, no emoji in UI, no sparkle icons. Icons: text labels do the work; where a
  mark is needed use a small filled square in moss.
