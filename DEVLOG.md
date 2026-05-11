# DEVLOG.md — AI Spend Audit Build Log

Day 1 — 2026-05-06
Hours worked: 0
What I did: Read the prompt, took the day off to think about architecture and the economic model.
What I learned: N/A
Blockers / what I'm stuck on: N/A
Plan for tomorrow: Review PRICING_DATA and finalize the system design.

Day 2 — 2026-05-07
Hours worked: 0
What I did: Still planning, reviewing official vendor pricing pages to ensure the math is defensible.
What I learned: N/A
Blockers / what I'm stuck on: N/A
Plan for tomorrow: Scaffold the project and actually write the core engine code.

Day 3 — 2026-05-08
Hours worked: 6
What I did: Scaffolded Vite+React+TS. Wrote `audit-engine.ts` with 10 passing tests. Built SpendForm and Results components.
What I learned: Vite's CLI requires --overwrite for non-empty dirs. @anthropic-ai/sdk v0.95 has native fetch, eliminating polyfill needs.
Blockers / what I'm stuck on: None currently.
Plan for tomorrow: Connect Supabase and deploy to Vercel.

Day 4 — 2026-05-09
Hours worked: 5
What I did: Connected Supabase with RLS policies. Deployed to Vercel. Fixed peer dependency conflict with Vitest.
What I learned: Vercel's npm ci is stricter about peer dependencies than local npm install. Had to carefully downgrade coverage-v8 to match vitest 3.x.
Blockers / what I'm stuck on: Waiting on replies for user interviews.
Plan for tomorrow: Polish UI animations and start user interviews.

Day 5 — 2026-05-10
Hours worked: 4
What I did: Added 404 page, stagger animations in CSS, and completed full accessibility audit (ARIA labels, IDs).
What I learned: `aria-expanded` is absolutely critical for accordion screen-reader support on the tool cards.
Blockers / what I'm stuck on: None.
Plan for tomorrow: Write the entrepreneurial documentation files.

Day 6 — 2026-05-11
Hours worked: 4
What I did: Finalized 12 markdown docs. Fixed GitHub Actions strict linting errors (unused vars, useEffect warnings) that failed the CI.
What I learned: GitHub Actions eslint catches synchronous setState calls that local builds might ignore.
Blockers / what I'm stuck on: None.
Plan for tomorrow: Final review and submit.

Day 7 — 2026-05-12
Hours worked: 1
What I did: Final QA. Verified live URL, CI green, and all documentation is formatted correctly.
What I learned: Completing a 7-day take-home requires aggressive scoping. The pure-TS audit engine was the best decision I made.
Blockers / what I'm stuck on: None.
Plan for tomorrow: Submit the project.
