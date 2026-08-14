# Mila Oyun Merkezi 1.0.0 Release Checklist

Production URL source: the canonical, Open Graph, JSON-LD, robots, sitemap, and SEO regression tests identify `https://mila-game-center.vercel.app/` as the stable production URL. This repository is a dependency-free static Vercel deployment; there is no build command or output directory.

## Before deployment

- Back up representative player data from Ebeveyn Alanı before destructive migration or reset checks.
- Run `node --test` and confirm zero failures/skips.
- Run `node --check` for `app.js`, `sw.js`, every `js/**/*.js`, and every `tests/**/*.js` file.
- Confirm `index.html`, local asset references, JSON data, `robots.txt`, `sitemap.xml`, `favicon.svg`, and `og-image.png` pass `tests/release-readiness.test.js`.
- Confirm there is no `noindex`, localhost URL, Vercel preview URL, console error, or missing asset.
- Confirm storage migration/import tests preserve existing player data and never call `localStorage.clear()`.
- Smoke-test 360×640, 390×844, 768×1024, 1024×768, and desktop layouts without horizontal overflow or clipped controls.
- When releasing a changed asset set, bump `1.0.0` consistently in `index.html`, `app.js`, `sw.js`, and `js/ParentExperience.js`; the release tests enforce equality.

## Deployment and post-deployment smoke test

- Deploy the repository root to the configured Vercel production project; no build command is required.
- Confirm HTTP 200 for `/`, `/robots.txt`, `/sitemap.xml`, `/og-image.png`, `/favicon.svg`, `/styles.css`, `/app.js`, and `/sw.js`.
- Confirm the Home canonical is `https://mila-game-center.vercel.app/` and response headers match `vercel.json`.
- Open DevTools and verify no application-owned errors, unhandled rejections, blocked core assets, or unexpected external hosts.
- Complete a fresh-player flow: player selection, world change, Learning quiz with speech replay and pause/resume, Learning Path stage, Mini Game, Daily Mission update, Rewards, Settings/audio, Parent gate/stats/export, reload, and persistence check.
- After one online load, switch offline, reload Home, and complete one local activity; restore network afterward.
- Test a documented legacy fixture and a backup export/import roundtrip without changing real browser data.

## Google Search Console handoff

1. Verify the production property.
2. Submit `https://mila-game-center.vercel.app/sitemap.xml`.
3. Use URL Inspection for `https://mila-game-center.vercel.app/`.
4. Confirm the live canonical and robots result, then request indexing.
5. Recheck coverage after deployment; indexing is not immediate.
