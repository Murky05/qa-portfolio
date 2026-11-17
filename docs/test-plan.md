# Sample Test Plan — SauceDemo Ecommerce

## 1. Document control

| Field | Value |
| --- | --- |
| Product | SauceDemo (https://www.saucedemo.com) |
| Scope | Login, product inventory, cart, checkout |
| Approach | Manual exploratory + automated Playwright regression |
| Author | QA Automation Demo portfolio |
| Status | Active sample plan |

## 2. Objectives

- Validate that registered customers can authenticate and reach the product catalog.
- Confirm cart add/remove and price sorting behave correctly.
- Verify checkout completes with valid shipping details and rejects incomplete forms.
- Produce a reusable automation suite (Page Object Model) suitable for portfolio review.

## 3. In scope

- Login with `standard_user` / `secret_sauce`
- Negative login: blank fields, bad credentials, locked-out user
- Logout from the inventory menu
- Add / remove products in cart
- Sort products by price (low to high)
- Checkout happy path and missing-field validation

## 4. Out of scope

- Payment gateway integrations (SauceDemo is a demo storefront)
- Performance / load testing
- Accessibility audit beyond smoke observation
- Mobile native apps
- Backend API contract tests

## 5. Test environment

| Item | Detail |
| --- | --- |
| URL | https://www.saucedemo.com |
| Browsers | Chromium, Firefox (Playwright projects) |
| Accounts | `standard_user`, `locked_out_user` (public demo credentials) |
| Data | Static product catalog provided by SauceDemo |

## 6. Entry / exit criteria

**Entry**

- SauceDemo is reachable over HTTPS
- Playwright browsers installed
- Credentials documented for standard and locked-out users

**Exit**

- Critical and high login/cart/checkout cases executed
- Failures triaged with screenshots/traces
- QA report published with pass/fail counts

## 7. Test design summary

| Area | Priority | Technique |
| --- | --- | --- |
| Login positive | High | Automated |
| Login negatives (data-driven) | High | Automated + JSON rows |
| Cart CRUD | High | Automated |
| Inventory sort | Medium | Automated |
| Checkout happy path | Critical | Automated |
| Checkout field validation | High | Automated |
| AI-generated story cases | Medium | Generated then human-reviewed |

## 8. Risks

- Public demo site latency or downtime can flake automation.
- SauceDemo UI changes may break selectors without product ownership.
- AI-generated cases are starting points only — always review before release use.

## 9. Deliverables

- Playwright suite under `tests/`, `pages/`, `fixtures/`
- `docs/qa-report.md` with execution results
- Optional `npm run generate` output for story-derived cases
- Showcase UI summarizing framework + sample cases
