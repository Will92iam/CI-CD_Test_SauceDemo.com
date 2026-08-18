# CI-CD_Test_SauceDemo.com

End-to-end tests for [saucedemo.com](https://www.saucedemo.com) built with [Playwright](https://playwright.dev/) and TypeScript, using the Page Object Model (POM). Runs locally and in GitHub Actions on every push/PR to `main`/`master`.

## Project structure

```
pages/            Page objects — one class per page, locators + actions only, no assertions
  BasePage.ts          Shared goto() (with retry) and title getter, extended by all pages
  LoginPage.ts
  InventoryPage.ts
  CartPage.ts
  CheckoutStepOnePage.ts    "Your Information"
  CheckoutStepTwoPage.ts    "Overview"
  CheckoutCompletePage.ts

fixtures/
  pages.ts          Extends Playwright's `test` with one fixture per page object
  test-data.ts       Centralized test data: users, checkout info, product names, error strings

tests/
  login/            Page-level tests for the login screen (positive + negative cases)
  e2e/              Full user journeys spanning multiple pages (e.g. checkout flow)
```

**Why this split:** `tests/login/` verifies one page's behavior in isolation (including
negative/edge cases like locked-out or invalid users). `tests/e2e/` verifies a full journey
across pages (login → add to cart → checkout → confirmation). As more pages are covered,
new page-level folders (e.g. `tests/inventory/`, `tests/cart/`) can follow the same pattern.

## Setup

```bash
npm install
npx playwright install --with-deps
```

## Running tests

```bash
npm test              # headless, all browsers (chromium, firefox, webkit)
npm run test:headed   # headed, so you can watch the browser
npm run test:ui       # interactive UI mode — step through actions, inspect DOM snapshots
npm run report        # open the HTML report from the last run
```

Run a single project or file directly with the Playwright CLI, e.g.:

```bash
npx playwright test tests/login --project=chromium
npx playwright test tests/e2e/checkout.spec.ts --project=chromium --headed
```

### Slow motion

To slow down actions in a headed run (useful for demos/debugging), set `SLOWMO` (ms):

```bash
SLOWMO=500 npx playwright test --headed --workers=1
```

## Test data

Users, checkout details, product names, and expected error messages live in
[`fixtures/test-data.ts`](fixtures/test-data.ts) rather than being hardcoded in specs.

## Notes

- `baseURL` is set to `https://www.saucedemo.com` in [`playwright.config.ts`](playwright.config.ts).
- saucedemo.com is a free public demo site and can intermittently reset connections or
  rate-limit under concurrent automated traffic. To keep runs stable, `playwright.config.ts`
  caps local workers at 4 (CI uses 1) and enables a retry both locally and on CI; `BasePage.goto()`
  additionally retries navigation a few times with backoff before failing a test.
- CI workflow: [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml) — runs
  `npx playwright test` on push/PR to `main`/`master` and uploads the HTML report as an artifact.
