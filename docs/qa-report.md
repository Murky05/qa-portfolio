# QA Execution Report — SauceDemo

## Summary

| Metric | Value |
| --- | --- |
| Date | 2026-11-17 |
| Environment | https://www.saucedemo.com |
| Tooling | Playwright `@playwright/test` ^1.48, Chromium + Firefox |
| Workers | 2 |
| Duration | ~10.1s |
| Total | 20 |
| Passed | 20 |
| Failed | 0 |
| Skipped | 0 |
| Flakes observed | None in this run |
| Verdict | **Pass** — suite ready for portfolio demo |

## Scope executed

| Spec | Cases (per browser) | Result |
| --- | --- | --- |
| `tests/login.spec.ts` | TC-01 valid login; NEG-01..04 data-driven errors; TC-06 logout | Pass |
| `tests/cart.spec.ts` | TC-03 add/remove; TC-07 sort price low→high | Pass |
| `tests/checkout.spec.ts` | TC-04 complete order; TC-05 missing first name | Pass |

Chromium: 10 passed · Firefox: 10 passed.

## Case-level notes

### Login

- Valid `standard_user` / `secret_sauce` reached Products and `/inventory`.
- Blank username/password, blank password, mismatched credentials, and `locked_out_user` each surfaced the expected `data-test=error` copy.
- Burger-menu logout returned a visible Login button.

### Cart / inventory

- Backpack + Bike Light raised cart badge to `2`; removing Bike Light left one line item.
- Sort option `lohi` produced a non-decreasing price list.

### Checkout

- Fleece Jacket path with name/ZIP completed with “Thank you for your order!”.
- Continue without shipping fields failed with “First Name is required”.

## Evidence

- Reporter: Playwright list + HTML (`playwright-report/`, gitignored).
- Traces / screenshots: configured on failure / first retry; none captured (clean run).
- Command: `npm test` after `npx playwright install chromium firefox`.

## Residual risk

- SauceDemo is a public third-party demo; latency or UI changes can flake selectors without notice.
- AI-generated cases from `npm run generate` were not executed as Playwright specs in this run; treat them as drafts pending human review.

## Sign-off

Automated smoke/regression for the portfolio demo **passed** (20/20). Suitable to ship with the Vite showcase and sample generator output.
