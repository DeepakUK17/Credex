# METRICS.md — North Star & Measurement Plan

**Word count:** ~350 words

---

## North Star Metric

**Audits that generate a consultation booking.**

Not "audits completed" — that's easy to game with bot traffic. Not "email captures" — that's a vanity metric if they don't convert. The metric that directly measures the business value of this tool is: how many times does an audit lead to a booked Credex consultation?

**Why this is the right North Star:** Every other metric is upstream (audits, leads) or downstream (deals closed). This is the exact conversion point where the audit tool proves its value to Credex's core business.

**Target:** 2+ consultation bookings per 100 audits (2% audit → consultation rate).

---

## 3 Input Metrics

These drive the North Star:

| Input Metric | Target | Why It Matters |
|---|---|---|
| **Audit completion rate** | ≥70% of users who start complete the form | A high drop-off means the form is too long or friction is too high |
| **Email capture rate** | ≥12% of audit completions | Low capture rate = CTA copy or timing issue |
| **High-savings rate** | ≥30% of audits show >$200/mo savings | If this is too low, we're attracting small teams outside our ICP |

---

## Instrumentation Plan

**Events to track (via Plausible or PostHog — no Google Analytics):**

```
audit_started           → when form is loaded
audit_form_tool_added   → each time a tool row is added (tells us avg tools per audit)
audit_submitted         → form submission clicked
audit_completed         → results page loaded successfully
email_capture_opened    → lead modal shown
email_captured          → lead form submitted successfully
share_link_copied       → share button clicked
consultation_cta_clicked → "Book consultation" clicked on results page
```

No PII in any event. All events attached to the anonymous audit UUID.

---

## Pivot Trigger Numbers

If after **200 audits**:
- Audit → consultation rate < 1%: **Pivot trigger.** Problem is likely ICP mismatch. Consider adding team size gating (require ≥5 team members to get results).
- Email capture rate < 5%: **CTA problem.** A/B test the modal copy and trigger timing.
- High-savings rate < 15%: **Audience problem.** People auditing are too small/optimal already. Adjust acquisition messaging to attract higher-spend teams.
