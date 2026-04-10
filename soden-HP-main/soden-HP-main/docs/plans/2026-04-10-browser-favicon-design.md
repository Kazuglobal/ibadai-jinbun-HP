# Browser Favicon Design

**Goal:** Replace only the browser favicon with a dedicated favicon asset while leaving the existing site logo, Apple touch icon, and PWA manifest icon unchanged.

**Current State**
- [index.html](C:\Users\s1598\Downloads\soden-HP-main\soden-HP-main\index.html) points both `rel="icon"` and `rel="apple-touch-icon"` at `/logo.png`.
- [public/manifest.json](C:\Users\s1598\Downloads\soden-HP-main\soden-HP-main\public\manifest.json) also points its installable app icon at `/logo.png`.
- The user explicitly wants only the browser favicon changed.

**Recommended Approach**
- Generate dedicated browser favicon PNGs from the existing [public/logo.png](C:\Users\s1598\Downloads\soden-HP-main\soden-HP-main\public\logo.png).
- Keep them square and small so browser tabs render the mark more reliably than the current wide logo asset.
- Update only the `rel="icon"` links in [index.html](C:\Users\s1598\Downloads\soden-HP-main\soden-HP-main\index.html).
- Leave `apple-touch-icon` and `manifest.json` unchanged.

**Why This Approach**
- It isolates browser favicon behavior from all other icon consumers.
- It avoids unintended changes to home-screen icons, metadata, or on-page branding.
- It gives browsers assets sized for favicon usage instead of a general-purpose logo image.

**Files**
- Add generated favicon assets under `public/`.
- Modify [index.html](C:\Users\s1598\Downloads\soden-HP-main\soden-HP-main\index.html).
- Extend [tests/seo-regressions.test.mjs](C:\Users\s1598\Downloads\soden-HP-main\soden-HP-main\tests\seo-regressions.test.mjs) with a regression check for favicon references.

**Verification**
- Regression test confirms `index.html` points the browser favicon to the dedicated favicon asset.
- Browser-targeted assets exist in `public/`.
