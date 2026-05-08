# AI Spend Audit — TESTS.md

All tests use **Vitest** (configured in `vite.config.ts`).

## How to Run

```bash
npm run test           # Single run
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

## Test Files

### `src/__tests__/audit-engine.test.ts` — Audit Engine Logic

| # | Test Name | What It Verifies | Expected Result |
|---|---|---|---|
| 1 | Empty input → zero savings | Engine returns 0 when no tools are added | `totalMonthlySavings === 0` |
| 2 | Cursor Business 1 seat → recommend Pro | Plan downgrade rule for small teams on Cursor Business | Saves $20/month ($240/yr) |
| 3 | Copilot Business 1 seat → recommend Individual | Single-seat Business plan rule | Saves $9/month, priority 'high' |
| 4 | ChatGPT Team 1 seat → recommend Plus | Single-seat Team plan downgrade | Saves $10/month ($120/yr) |
| 5 | Claude Team 2 seats → recommend 2×Pro | Small team on Team plan | Saves $20/month |
| 6 | High spend → Credex credits | Credits rec fires when spend > $200/mo | monthlySavings = 20% of $500 = $100 |
| 7 | isHighSavings flag | Flag set correctly based on $500 threshold | `isHighSavings === (totalMonthlySavings > 500)` |
| 8 | spendPerDev calculation | Total spend / team size | $120 spend / 4 devs = $30/dev |
| 9 | Annual = 12× monthly | Annual savings derived correctly | `totalAnnualSavings === totalMonthlySavings * 12` |
| 10 | Optimal status | No recs when plan is right-sized | `status === 'optimal'` for Cursor Pro 1 seat |

## Coverage

The audit engine is the only component with unit tests (per assignment requirement for ≥5 tests). The engine is a **pure function** with no I/O, making it ideal for unit testing.

All Supabase, Anthropic, and Resend integrations are tested manually in the deployed environment (see DEVLOG.md for integration test notes).

## Running in CI

Tests run automatically on every push to `main` via `.github/workflows/ci.yml`. See the CI badge in README.md for current status.
