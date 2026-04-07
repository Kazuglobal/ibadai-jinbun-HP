# Local SEO Four Pages Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen `/services`, `/cases`, `/recruit`, and `/contact` so they better match Hachinohe/Aomori local search intent in both page content and structured data.

**Architecture:** Keep the current page layout and route structure intact, then add concise local-intent copy blocks and page-specific JSON-LD generation in `AppComponent`. The implementation should avoid introducing new routes or data models and should preserve prerendered SEO output.

**Tech Stack:** Angular 21 standalone app, Angular prerender, TypeScript, HTML templates, Vercel static hosting

---

### Task 1: Add page-specific schema support in the SEO layer

**Files:**
- Modify: `src/app.component.ts`

**Step 1: Write the failing verification target**

Target output:
- `/services` includes service-area and service catalog schema content
- `/cases` includes collection-style page context
- `/recruit` includes hiring/recruitment page context
- `/contact` includes contact page context

**Step 2: Add a route-aware schema builder**

Implement helper methods in `src/app.component.ts` that inspect the current pathname and append route-specific schema nodes to the existing `@graph`.

**Step 3: Keep the base organization/webpage schema intact**

Ensure the new route-specific schema is additive and does not remove the existing organization, website, webpage, breadcrumb, or FAQ behavior.

**Step 4: Verify minimal logic**

Run: `npm run build`
Expected: Build passes and prerender still completes.

### Task 2: Strengthen `/services` local-intent content

**Files:**
- Modify: `src/components/services/services.component.html`

**Step 1: Add a local SEO intro block**

Insert a concise section under the hero that explains:
- service coverage in Hachinohe and Aomori
- supported project types
- design, construction, and maintenance coverage

**Step 2: Add a local CTA support block**

Before the final CTA, add a compact section clarifying who should contact the company and what nearby-area support looks like.

**Step 3: Verify rendering**

Run: `npm run build`
Expected: No template errors and prerender output contains the new copy.

### Task 3: Strengthen `/cases` local-intent content

**Files:**
- Modify: `src/components/cases-detail/cases-detail.component.html`

**Step 1: Add a local project summary block**

Add a short explanatory section that frames the case list as projects across Hachinohe and Aomori for factories, commercial facilities, public sites, and infrastructure.

**Step 2: Add a trust/consultation bridge**

Add a compact section that connects these case studies to future inquiries and estimates.

**Step 3: Verify rendering**

Run: `npm run build`
Expected: No template errors and prerender output contains the new copy.

### Task 4: Strengthen `/recruit` local-intent content

**Files:**
- Modify: `src/components/recruit-details/recruit-details.component.html`

**Step 1: Add a local recruitment summary**

Insert a section near the intro that explains the role in terms of Hachinohe/Aomori infrastructure work, career growth, and regional contribution.

**Step 2: Add an applicant guidance block**

Add a simple block before the entry CTA explaining who should apply and what kinds of candidates are welcomed.

**Step 3: Verify rendering**

Run: `npm run build`
Expected: No template errors and prerender output contains the new copy.

### Task 5: Strengthen `/contact` local-intent content

**Files:**
- Modify: `src/components/contact/contact.component.html`

**Step 1: Add a contact scope summary**

Insert a compact section describing inquiry types:
- electrical equipment work
- telecom/fire systems
- solar/power support
- recruitment inquiries

**Step 2: Add area-coverage reassurance**

Add a short note about responding from Hachinohe across Aomori and nearby areas.

**Step 3: Verify rendering**

Run: `npm run build`
Expected: No template errors and prerender output contains the new copy.

### Task 6: Verify prerendered HTML and commit

**Files:**
- Verify output: `dist/services/index.html`
- Verify output: `dist/cases/index.html`
- Verify output: `dist/recruit/index.html`
- Verify output: `dist/contact/index.html`

**Step 1: Build production output**

Run: `npm run build`
Expected: Success with prerendered routes.

**Step 2: Inspect representative route output**

Check that each route still has correct title/description/canonical and that the generated HTML contains the newly added local-intent copy and schema markers.

**Step 3: Commit**

```bash
git add src/app.component.ts src/components/services/services.component.html src/components/cases-detail/cases-detail.component.html src/components/recruit-details/recruit-details.component.html src/components/contact/contact.component.html docs/plans/2026-04-07-local-seo-four-pages-design.md docs/plans/2026-04-07-local-seo-four-pages.md
git commit -m "feat: strengthen local seo on key pages"
```
