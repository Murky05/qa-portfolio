# QA Automation Demo

Portfolio lab that pairs a **Playwright** end-to-end suite for [SauceDemo](https://www.saucedemo.com) with an **AI-assisted test-case generator** and a Vite React showcase UI.

## What’s included

- **Playwright framework** — page objects (`pages/`), shared fixtures (`fixtures/`), specs for login / cart / checkout, JSON-driven negative login data
- **AI generator** — `generator/generate.ts` turns `user-story.txt` into structured cases (JSON + CSV). Uses OpenAI when `OPENAI_API_KEY` is set; otherwise a **deterministic mock** so the demo always runs
- **Docs** — `docs/test-plan.md` (SauceDemo sample plan) and `docs/qa-report.md` (filled execution results)
- **Showcase UI** — Vite + React portfolio page summarizing the framework, sample generated cases, and report links

> Generated cases are drafts. **Always review them with a human** before treating them as release criteria.

## Quick start

```bash
npm install
npx playwright install
```

### Demo UI

```bash
npm run dev
# http://127.0.0.1:3847
```

### Generate test cases

```bash
# Mock mode (no API key required)
npm run generate

# Optional live generation
cp .env.example .env
# set OPENAI_API_KEY=...  (OPENAI_BASE_URL and MODEL optional)
npm run generate
```

Writes `test-cases.json`, `test-cases.csv`, and `public/sample-test-cases.json` (committed sample for the UI).

### Playwright against SauceDemo

```bash
npm test
npm run test:headed   # watch browsers
npm run report        # open HTML report after a run
```

### Manual login on SauceDemo

If you try the site yourself at https://www.saucedemo.com:

| Goal | Username | Password |
| --- | --- | --- |
| Successful login | `standard_user` | `secret_sauce` |
| Locked-out error (expected) | `locked_out_user` | `secret_sauce` |

Password is **case-sensitive** and must be exactly `secret_sauce` (lowercase, no spaces). A typo like `Secret_sauce` shows *“Username and password do not match”* even for a listed username. `locked_out_user` with the correct password still cannot sign in — that is intentional demo behavior (*“Sorry, this user has been locked out”*).

### Typecheck / production build

```bash
npm run typecheck
npm run build
```

## Project layout

```
pages/          Page objects (login, inventory, cart, checkout)
fixtures/       Playwright fixtures including logged-in inventory
tests/          Specs
data/           Negative login rows
generator/      Story → test-case generator
public/         sample-test-cases.json for the showcase
src/            Vite React portfolio UI
docs/           Test plan + QA report
```

## Environment variables

See `.env.example`:

| Variable | Required | Purpose |
| --- | --- | --- |
| `OPENAI_API_KEY` | No | Enables live generation; omit for mock mode |
| `OPENAI_BASE_URL` | No | OpenAI-compatible API base (default `https://api.openai.com/v1`) |
| `MODEL` | No | Model name (default `gpt-4o-mini`) |

## Notes

- Target app is the public SauceDemo storefront — expect occasional network flakiness.
- Mock generator output is intentional for offline demos; it is not a substitute for expert test design.
