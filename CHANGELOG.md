# ARAM IAS Mockup Changelog

## 2026-09-09 - Current Affairs "Today's Desk" rebuilt as a 3-card deck

- Replaced the old lead-story + important-news layout and removed the Quick Access section.
- New Today's Desk is a 3-card deck (`.ca-desk-grid`):
  - Card 1 "Today's News": centre date (default today) with prev/next day edge arrows; a manually scrollable vertical slider listing Mains items first, then Prelims.
  - Card 2 Calendar: themed month grid with prev/next month arrows, month name, and month+year picker; day cells carry Prelims/Mains/PIB markers (prototype data via `markersFor`). Legend below.
  - Card 3: thin vertical slab of quick buttons (Mains, Prelims, PIB → PDF links; Quiz, Revision → sections). No News Navigator.
- Removed the "Current desk" date box from the utility hero (calendar/deck now own date navigation).
- Moved the Prelims Sprint section to sit directly after the Mains Issue Desk (before PIB); renumbered sections.
- `js/current-affairs.js`: added calendar renderer + month/year pickers and rewired date nav to the new deck controls.
- Bumped `current-affairs.css`/`current-affairs.js` to `?v=4`.

## 2026-09-09 - Current Affairs page refinements (round 2)

- Subject chips reordered to group by GS paper: History/Geography/Society (GS I), Polity/Governance/IR (GS II), Economy/Environment/S&T (GS III), Ethics (GS IV).
- Added Ethics subject chip and mapped it to GS IV in `gsSubjectMap`.
- Lens filter: removed "Both" (All now covers both Prelims and Mains).
- News cards: hid the reading-time marker and the Prelims/Mains star-rating strip (via CSS).
- Quiz Hub: switched from dark to a light cream background; recoloured cards, featured card (coral), heading and links accordingly.
- Bumped `current-affairs.css`/`current-affairs.js` to `?v=3`.

## 2026-09-09 - Current Affairs page refinements

- Section headings: removed the secondary descriptive line (the `<h2>`) across all sections; kept only the primary kicker line and enlarged it (`css/current-affairs.css`, hidden via `.ca-section-heading h2 { display:none }`).
- News Navigator filters: selecting a GS paper now enables only the subjects relevant to that paper and disables the rest (line-through + dimmed); selecting GS = All re-enables everything (`js/current-affairs.js`, `gsSubjectMap`).
- Active filter chips now use the coral accent instead of dark navy.
- Quiz Hub section: replaced the near-black background with a warm coral-brown gradient.
- Removed the ALS "For You" placeholder block from the page.
- Bumped `current-affairs.css`/`current-affairs.js` to `?v=2`.

## 2026-09-09 - Current Affairs page integration

### Scope
Integrated the ARAM Current Affairs bundle as a native page in the site.

New files:
- `current-affairs.html` — multi-segment Current Affairs page (Today's Desk, Quick Access, News Navigator with GS/Subject/Lens filters, Mains Issue Desk, PIB, Prelims Sprint, Event Chains, Quiz Hub, Revision Centre, Browse by Subject, ALS "For You" placeholder).
- `css/current-affairs.css` — page-specific styles using existing design tokens from `main.css`.
- `js/current-affairs.js` — filtering, global search (`/` shortcut), sticky subnav highlight, date navigation, save-story and mobile menu (prototype interactions).

Changed files:
- `js/content-blueprint.js` — added "Current Affairs" to the primary nav (after Post-Foundation); added a header-actions case so the Current Affairs page shows a "Start Today's Quiz" button.

Notes:
- The page loads `content-blueprint.js` (for the shared coral announcement bar, nav and footer) plus its own `current-affairs.js`. Because the page is not in the content-blueprint `pages` map, its hardcoded body content is preserved.
- Editorial content is sample/prototype data. Replace with CMS/API data per `current-affairs-content-schema.json` in the bundle. Placeholder links use `#`.
- No existing page was broken; the new nav item appears site-wide.

## 2026-08-25 - Audit-led content and layout recommendations pass

### Scope

Updated the high-impact vNext pages based on the ARAM IAS audit and the UPSC AI UX Architecture Proposal reference.

Touched files:
- `index.html`
- `aram-ai.html`
- `resources.html`
- `results.html`
- `programmes.html`
- `post-foundation.html`
- `css/main.css`

### Backup / Rollback

Pre-change backups were saved in:

`_revert/audit-changes-2026-08-25/`

To roll back this pass manually, copy the matching files from that folder back into `mockups-vnext/`.

Example:

```bash
cp _revert/audit-changes-2026-08-25/index.html index.html
cp _revert/audit-changes-2026-08-25/aram-ai.html aram-ai.html
cp _revert/audit-changes-2026-08-25/resources.html resources.html
cp _revert/audit-changes-2026-08-25/results.html results.html
cp _revert/audit-changes-2026-08-25/programmes.html programmes.html
cp _revert/audit-changes-2026-08-25/post-foundation.html post-foundation.html
cp _revert/audit-changes-2026-08-25/main.css css/main.css
```

### Changes

- Home: added an earlier proof strip and official-trust band so ARAM identity, timeline, materials and institutional proof are visible sooner.
- ARAM AI: reframed the page around the proposal's launchpad model: Prelims/Mains/Interview modes, Continue Studying, Study by Subject, Plan My Session, contextual AI actions and faculty/mentor oversight.
- Resources: replaced generic resource language with ARAM-specific product/content names such as News Navigator, Prediction Current Affairs Quiz, Mainframe and publication-led proof.
- Results: marked where real topper posters, student photos, video stills and recognition photos should replace designed placeholders.
- Foundation: clarified that Foundation is the broad chooser page, while Post Foundation is an after-syllabus performance system.
- Post Foundation: kept the simplified structure, clarified reading-material use, and preserved 3-per-row tile sections.
- CSS: added reusable audit-update components: trust bands, launchpad preview, journey tiles, workflow list, proof stats and publication cards.

### Asset Gaps

Still needed for final polish:
- Separate covers for Mainframe, Do Not Miss and Rush Through.
- Real recognition/award photos from ARAM.
- Official topper posters or video stills for AIR 42, AIR 47, AIR 119 and other verified results.
- Classroom/seminar/student-interaction photos.
- Centre/location photos for Chennai and Delhi.

## 2026-08-25 - Navigation and visibility correction pass

### Scope

Fixed the Home proof-card text contrast issue and clarified navigation state.

Touched files:
- `*.html` in `mockups-vnext/` for the explicit `Home` nav item and CSS cache bump.
- `index.html` for the correct active nav state.
- `css/main.css` for proof-card text contrast.

### Backup / Rollback

Pre-change backups for this pass were saved in:

`_revert/nav-visibility-2026-08-25/`

To roll back this pass, copy files from that folder back into `mockups-vnext/`.

### Changes

- Added explicit `Home` navigation across pages so the user does not need to infer Home from the logo.
- Set `Home` as active on `index.html` and removed the incorrect Post Foundation active state from the Home page.
- Fixed `.proof-stat` text contrast so white cards inside dark hero sections use dark text.
- Bumped CSS cache to `main.css?v=9`.

### Audit Notes

- Home still needs final proof assets: real classroom/student photos and separate publication covers.
- Results should replace designed award plaques with real recognition photos and exact verified award wording.
- Foundation should remain the chooser page; Home should carry the broad brand proof and primary entry points.

## 2026-08-25 - Home proof cards and class photo pass

### Scope

Used the supplied ARAM classroom/event photos on Home and fixed the clipped four proof cards.

Touched files:
- `index.html`
- `css/home-premium.css`
- `CHANGELOG.md`

Added assets:
- `assets/media/home-classroom.jpg`
- `assets/media/gov-speech-class.jpeg`

### Backup / Rollback

Pre-change backups for this pass were saved in:

`_revert/home-proof-photos-2026-08-25/`

To roll back this pass, copy the matching files from that folder back into `mockups-vnext/`.

### Changes

- Replaced the Home hero reception visual with two real class/event photos supplied by the user.
- Changed the four Home proof cards to concise impact points: `450+`, `Rank 2`, `Since 2011`, and `UPSC + TNPSC`.
- Made the Home proof cards a 2-by-2 grid on desktop and single-column on mobile so text no longer gets cut.
- Bumped the Home CSS cache references to `main.css?v=10` and `home-premium.css?v=4`.

## 2026-08-25 - Programmes label renamed to Foundation

### Scope

Renamed the public-facing `Programmes` label to `Foundation` across the live mockup pages while keeping existing filenames and URLs unchanged.

Touched files:
- Live `*.html` pages in `mockups-vnext/`
- `CHANGELOG.md`

### Backup / Rollback

Pre-change backups for this pass were saved in:

`_revert/programmes-to-foundation-2026-08-25/`

To roll back this pass, copy the matching files from that folder back into `mockups-vnext/`.

### Changes

- Updated the top navigation label from `Programmes` to `Foundation`.
- Updated footer column headings from `Programmes` to `Foundation`.
- Updated the broad chooser page title/hero from `Programmes` to `Foundation`.
- Updated the Home hero CTA from `Foundation Programmes` to `Foundation`.

## 2026-08-25 - About page specificity pass

### Scope

Reworked the About page to feel specific to ARAM's public identity without adding extra page length.

Touched files:
- `about.html`
- `CHANGELOG.md`

### Backup / Rollback

Pre-change backups for this pass were saved in:

`_revert/about-specific-2026-08-25/`

To roll back this pass, copy the matching files from that folder back into `mockups-vnext/`.

### Changes

- Replaced generic About copy with ARAM-specific points: Anna Nagar Chennai, since 2011, UPSC/TNPSC, current-affairs products, exclusive materials, Mains writing, recognitions and mentorship.
- Removed the longer leadership and publication sections so the page stays shorter.
- Added official Head Office and Academic Office addresses from the public ARAM site.
- Added the public-site warning that ARAM operates only from Anna Nagar, Chennai and has no other Tamil Nadu branches or affiliates.

### Reverted

- Reverted `about.html` back to the pre-pass version after user feedback to keep the earlier people, awards/publication-style material and avoid making the page sound Chennai-specific first.

## 2026-08-25 - About copy specificity without restructuring

### Scope

Sharpened selected About page sections while keeping the existing layout and earlier people/publication material.

Touched files:
- `about.html`
- `CHANGELOG.md`

### Backup / Rollback

Pre-change backups for this pass were saved in:

`_revert/about-copy-specific-2026-08-25/`

To roll back this pass, copy the matching files from that folder back into `mockups-vnext/`.

### Changes

- Updated Story cards to `Since 2011` and `Aram For Students`.
- Replaced generic Academic Engine cards with ARAM-specific offerings: Foundation Classes, Current Affairs Desk, Mains Writing, Exclusive Materials, Digital Platform, Results + Recognition.
- Updated Centres heading to mention both Chennai and Delhi while positioning Chennai as roots/academic base and Delhi as the performance hub.
