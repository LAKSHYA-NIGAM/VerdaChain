# VerdaChain – Build Walkthrough

## What Was Built

A production-quality frontend for **VerdaChain – The Carbon Credit Lie Detector** with 5 pages, premium dark theme, and full mock data.

**Tech Stack:** Next.js (App Router) · Tailwind CSS · shadcn/ui · Framer Motion · Recharts

---

## Pages Delivered

### 1. Landing Page
Full-screen hero with canvas particle background, animated gradient text, "Start Verification" CTA with emerald glow, and trust badges.

![Landing Page](C:\Users\laksh\.gemini\antigravity\brain\83760fca-375f-468d-adb0-11194480c4bc\verdachain_landing_page_1774463193298.png)

### 2. Verifier Page (Main Focus)
- Glassmorphic search input with quick-select credit IDs
- Shimmer loading skeleton during verification
- **Risk Score:** Animated SVG circular ring (0 → 78), color-coded red for High Risk
- **AI Risk Analysis:** 4 severity-flagged bullet items
- **Project Metadata:** 6 labeled fields with credits count
- **Blockchain Proof:** Mock tx hash, block number, "View on Chain" button
- Toast notifications on completion

![Verification Results](C:\Users\laksh\.gemini\antigravity\brain\83760fca-375f-468d-adb0-11194480c4bc\verification_results_1774463370669.png)

### 3. Audit Logs Page
Searchable, filterable table with 12 mock records, color-coded score bars, status badges, and click-to-open detail modal.

![Audit Logs](C:\Users\laksh\.gemini\antigravity\brain\83760fca-375f-468d-adb0-11194480c4bc\audit_logs_page_1774463380868.png)

### 4. Analytics Page
4 stat cards + Recharts bar chart (risk distribution) and area chart (verification trends) with gradient fills.

---

## Design Highlights
- **Dark theme:** Deep black (`#050805`) with emerald (`#10b981`) accents
- **Glassmorphism:** Blurred panels, transparent borders, soft glow
- **Animations:** Framer Motion page transitions, staggered entries, hover effects, animated risk score counter
- **Responsive:** Mobile sidebar drawer, responsive grid layouts

## Verification

All pages tested in browser at `http://localhost:3000`:

| Page | Status |
|------|--------|
| Landing (`/`) | ✅ Particles, hero, CTA, trust badges |
| Verify (`/dashboard/verify`) | ✅ Input, shimmer, risk score 78, panels |
| Audit (`/dashboard/audit`) | ✅ Table, search, filter, modal |
| Analytics (`/dashboard/analytics`) | ✅ Stats, bar chart, area chart |

## Demo Recording

![Full App Demo](C:\Users\laksh\.gemini\antigravity\brain\83760fca-375f-468d-adb0-11194480c4bc\verify_flow_test_1774463314212.webp)
