# Browser Favicon Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Switch the browser favicon to a dedicated favicon image without changing other icon usage in the site.

**Architecture:** Keep `logo.png` as the shared brand/logo asset for the page, Apple touch icon, and manifest. Add browser-only favicon files under `public/` and repoint only the `rel="icon"` tags in `index.html`. Protect the change with a regression assertion in the existing Node-based SEO regression test.

**Tech Stack:** Angular static entry HTML, Node regression script, public static assets, PowerShell image generation

---

### Task 1: Add favicon regression coverage

**Files:**
- Modify: `tests/seo-regressions.test.mjs`

**Step 1: Write the failing test**

Add assertions that `index.html` contains dedicated browser favicon links instead of `/logo.png`.

**Step 2: Run test to verify it fails**

Run: `node tests/seo-regressions.test.mjs`
Expected: FAIL because `index.html` still points `rel="icon"` at `/logo.png`.

### Task 2: Generate favicon assets and repoint browser favicon links

**Files:**
- Create: `public/favicon-32.png`
- Create: `public/favicon-16.png`
- Modify: `index.html`

**Step 1: Generate small square favicon assets from `public/logo.png`**

Trim white margins, preserve the green mark, and export browser-sized PNGs.

**Step 2: Update only browser favicon links**

Point `rel="icon"` links in `index.html` to the new PNG files.

**Step 3: Leave non-browser icon references unchanged**

Do not modify `apple-touch-icon` or `public/manifest.json`.

### Task 3: Verify regression coverage passes

**Files:**
- Verify: `tests/seo-regressions.test.mjs`

**Step 1: Run the regression test**

Run: `node tests/seo-regressions.test.mjs`
Expected: PASS
