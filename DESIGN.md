# SolveCV design direction

Product: free job board plus AI career tools for job seekers.
Audience: job seekers, freshers to mid-level, often on phones, often stressed.
Mood: modern product UI in the shadcn/21st.dev idiom. Dark, glassy, calm, confident.

Palette (CSS variables in globals.css, single dark theme):
- paper #09090b (page background)
- surface #111114 (raised surfaces)
- ink #f4f4f5 (primary text)
- mute #a1a1aa (secondary text)
- moss #10b981 emerald (accent, CTAs, links, active states)
- line rgba(255,255,255,0.09) (hairlines and card borders)

Surfaces and motion:
- .glass: translucent white 4% fill, 16px backdrop blur, 1px white/10 border, 14px radius.
- .card-hover: lifts 2px, border tints emerald, deep shadow on hover. Every interactive card gets it.
- .btn-primary: emerald gradient fill, dark text, glow shadow on hover. .btn-secondary: glass pill.
- .gradient-text: emerald-to-sky gradient for the one hero accent and stat numbers.
- Hero: faint 56px grid masked to a radial fade, two slow-floating blurred orbs behind the headline.
- Chips: pill buttons for browse filters, emerald tint on hover.
- Bento grid on the homepage toolkit section: first card spans two columns with an orb behind it.
- No emoji in UI, no stock illustrations, no purple. Motion is restrained: float, fade-up, hover lift only.

Typography: Inter/system sans throughout, tight tracking on headings, mono for numbers and metadata.

Legacy: the first build used a warm paper/serif look; replaced 2026-11-19 after user review.
The resume .sheet stays white for print fidelity.
