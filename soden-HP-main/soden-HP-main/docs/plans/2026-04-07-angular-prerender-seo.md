# Angular Prerender SEO Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make each public route output route-specific initial HTML metadata so search engines receive the correct title, description, canonical URL, and structured data without relying on client-side navigation.

**Architecture:** Convert the current SPA-only Angular build into a static prerendered build using Angular server rendering primitives. Share browser/server application configuration, prerender all public routes at build time, and verify the generated HTML for representative routes before deployment.

**Tech Stack:** Angular 21 standalone application, `@angular/build:application`, Angular SSR/prerender, Vercel static hosting

---

### Task 1: Record the current SEO regression

**Files:**
- Verify: `angular.json`
- Verify: `src/app.routes.ts`
- Verify: `src/app.component.ts`

**Step 1: Inspect the current build configuration**

Run: `Get-Content -Raw angular.json`
Expected: Build target has no `server`, `prerender`, or `outputMode` configuration.

**Step 2: Inspect route metadata**

Run: `Get-Content -Raw src/app.routes.ts`
Expected: Public routes define SEO metadata in `data`.

**Step 3: Inspect runtime-only meta handling**

Run: `Get-Content -Raw src/app.component.ts`
Expected: Metadata is applied only after `NavigationEnd`, which explains why direct requests return homepage metadata.

### Task 2: Add minimal server-rendering configuration

**Files:**
- Create: `src/app.config.ts`
- Create: `src/app.config.server.ts`
- Create: `src/app.routes.server.ts`
- Create: `main.server.ts`
- Modify: `index.tsx`

**Step 1: Extract the shared browser providers**

Move the current router and zoneless provider configuration from `index.tsx` into `src/app.config.ts`.

**Step 2: Add server-only application config**

Create `src/app.config.server.ts` that merges the shared config with `provideServerRendering(...)`.

**Step 3: Add server route definitions**

Create `src/app.routes.server.ts` with explicit public routes marked for prerendering.

**Step 4: Add a server bootstrap entry**

Create `main.server.ts` that bootstraps `AppComponent` using the merged server config.

**Step 5: Update the browser bootstrap**

Make `index.tsx` import and use the shared browser config instead of inline providers.

### Task 3: Enable prerendering in the build

**Files:**
- Modify: `angular.json`
- Modify: `package.json`

**Step 1: Configure the Angular application builder**

Add `server`, `prerender`, and `outputMode: "static"` to the build target so Angular emits prerendered route HTML.

**Step 2: Ensure required packages are installed**

Add `@angular/platform-server` and `@angular/ssr` if they are not already direct dependencies so the build can resolve server rendering APIs.

**Step 3: Keep developer ergonomics clear**

Retain the existing `build` script, and only add new scripts if verification or deployment flow clearly benefits.

### Task 4: Verify generated SEO output

**Files:**
- Verify output: `dist/services/index.html`
- Verify output: `dist/cases/index.html`

**Step 1: Run the production build**

Run: `npm run build`
Expected: Angular completes a static prerender build without SSR resolution errors.

**Step 2: Confirm representative route HTML**

Run checks against `dist/services/index.html` and `dist/cases/index.html`.
Expected: Each file contains the correct route-specific `<title>`, `description`, and canonical URL instead of homepage metadata.

**Step 3: Confirm sitemap compatibility**

Verify that existing sitemap routes align with prerendered output paths.
Expected: `public/sitemap.xml` still points at real public URLs that now have matching prerendered HTML.

### Task 5: Deploy and validate live SEO output

**Files:**
- Verify live URLs only

**Step 1: Push the prerender changes**

Commit only the SEO/prerender files.

**Step 2: Trigger a production deployment**

Use the existing Vercel-linked workflow so the static output replaces the current SPA-only production build.

**Step 3: Validate live route HTML**

Fetch `https://soudenkougyou.com/services` and `https://soudenkougyou.com/cases`.
Expected: Both URLs return route-specific initial metadata in the raw HTML response.

### Task 6: Follow-on SEO work after prerender

**Files:**
- Review only

**Step 1: Submit sitemap in Search Console**

Use `https://soudenkougyou.com/sitemap.xml`.

**Step 2: Request indexing for priority URLs**

Submit `/services`, `/cases`, `/recruit`, and `/contact`.

**Step 3: Expand content breadth**

Plan new pages for service-specific intent such as local electrical work, fire systems, telecom infrastructure, solar, and case studies in Hachinohe/Aomori.
