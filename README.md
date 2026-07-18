# CommonGround — Roommate Relationship Management Prototype

A one-hour hackathon prototype showing:

1. Scenario-based roommate compatibility
2. Boundary negotiation and agreement generation
3. Agreement-powered post-move roommate support
4. Chore tracking
5. Guest notifications
6. Issue logging
7. Neutral reminder generation
8. Recurring-issue detection
9. Agreement version updates

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Build for deployment

```bash
npm run build
```

Deploy the generated `dist/` folder to Vercel, Netlify, Cloudflare Pages, or any static host.

## Important implementation note

This demo intentionally uses deterministic local functions instead of a live LLM API, so it works without an API key.

The following functions in `src/App.jsx` are the AI replacement points:

- `buildCompromises(...)`
- `toneMessages(...)`

Replace them with a backend API call later. Do not put an OpenAI or other provider secret directly in frontend code.

## Suggested live demo

1. Start demo
2. Compare Tara and Maya's scenario answers
3. Resolve the overnight guest or access-code conflict
4. Generate the shared agreement
5. Move into the dashboard
6. Log: "My roommate's boyfriend has stayed here for four nights this week."
7. Show the relevant agreement term
8. Send a neutral nudge
9. Choose "Renegotiate the rule"
10. Show Agreement v2 on the dashboard
