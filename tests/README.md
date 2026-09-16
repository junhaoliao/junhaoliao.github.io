# Browser checks

Install the locked dependencies with `npm ci`, then install the test browser with `npx playwright install chromium`.

Run `npm run build`, then `npm test`. The configuration starts a dedicated static server on port 48762 to exercise the production export and shuts it down afterward. That port must be free before running the suite.

Run `npm test -- tests/web-interface.spec.ts` to select only the accessibility checks. The other suites protect localized static output, navigation, preference storage, and client payload boundaries.

The checks cover section navigation and history, keyboard/QR links, the mobile sheet, skip navigation, reduced motion changes, theme metadata, locale synchronization, calendar dates in a timezone west of UTC, and semantic headings with fixed-header offsets. They do not cover the separate shadcn composition/styling review findings or device browser chrome rendering.
