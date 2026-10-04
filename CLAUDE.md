# Epure - project notes

## What it is
Epure is a browser tool that cleans a password CSV exported from Chrome, Edge, Firefox or Brave.
Everything runs locally in the page. No server, no upload, no account, no tracking.
It is a personal project for a student's resume, so the code must stay readable and explainable.
The owner is still learning the logic: explain how things work when you change them.

## Files
- `index.html` - page structure only. Text is filled by JS through `data-text` / `data-placeholder` / `data-aria-label` attributes.
- `css/style.css` - all styles, in sections (colors, header, hero, home sections, buttons, workspace, responsive, reduced motion).
- `js/i18n.js` - `TRANSLATIONS` (en, fr, es, grouped by page section), `t(key, values)`, `detectLanguage()`, `translatePage()`.
- `js/csv.js` - `parseCsv`, `toCsv`, `findColumn`. Pure functions.
- `js/analysis.js` - `getDomain`, `matchesSite`, `isWeakPassword`, `analyzeEntries`. Pure functions.
- `js/sample-data.js` - `SAMPLE_CSV` (fake demo file) and `RIBBON_ROWS` (home page band).
- `js/app.js` - state, rendering, actions, event wiring, startup. Loaded last.
- `assets/hero.mp4` - hero video: eraser on a legal pad, background already matches the page beige, 1920x1080, 15s loop, 7 MB. MP4 (H.264) so it plays everywhere, Safari included.
- `epure-prototype.html` - old landing page prototype (legal pad drawn in CSS). Visual only, not used.
- `nettoyeur_passwords.py` - command-line version (Python, standard library only).

## Code style
- Readable over short: descriptive names (`entries`, `undoHistory`, `selectedIds`), one idea per line, comments that explain why.
- The owner reads and must be able to explain every line. Keep this style in every change.
- Never mutate `entries` or an entry: build a new list / new entry and pass it to `applyChange()`, so Undo keeps working.

## Stack rules
- Plain HTML, CSS and JavaScript. No framework, no build step, no npm.
- Must still work by double-clicking the file (opened from disk).
- When splitting into several files, use plain `<script src>` tags. No ES module `import` (blocked on file://).
- No network requests. Never add analytics or external fonts.

## Features that exist
- Import CSV by drop or file picker (columns detected: url/login_uri/origin, username/login, password).
- Detect duplicates (same domain + username + password, first one kept), weak passwords, reused passwords, empty entries.
- Remove a site (subdomains included), remove duplicates, remove empty entries, remove selected rows.
- Search, filter tabs, show/hide each password, top sites list.
- Export cleaned CSV (original file never modified).
- Undo system: top Undo steps back through history. Each action button (site, duplicates, empty) also has its own Undo that only works right after that action; after any undo, the side buttons stay disabled until a new action.
- "Restore original" resets to the imported data (itself undoable).
- Logo click returns to the home screen (asks for confirmation if changes were made).
- Languages: English (default), French, Spanish. Auto-detected from the browser, selector in the header, choice saved in localStorage (wrapped in try/catch).
- Responsive: table turns into cards on phones.
- "Try with sample data" (hero button + link in the import card): loads the fake `SAMPLE` CSV in the script, built so every feature has something to show. A banner says the data is fake.
- Add an entry / edit an entry: one form in the Clean up card. "Edit" on a row pre-fills it. Edits build a new row object (never mutate) so undo still works. No password generator (owner's choice).
- Feedback: link to a Google Form, in the header and in a card shown after export. Set `FEEDBACK_URL` at the top of the script; while empty, the buttons stay hidden. It is a plain link, so the tool still sends nothing.

## Design
- Style: modern startup, inspired by Zen Browser and Wispr Flow. Warm and calm.
- Colors: background `#f2f0e3`, card `#fbfaf5`, ink `#2b2b2b`, muted `#767268`, line `#dfdccf`, accent coral `#f76f53`, accent hover `#e55a3d`. Dark text on coral buttons (white text is not readable on it).
- Logo: geometric key drawn in SVG (dark rounded square, white ring, coral center, white bar with teeth).
- Home hero: two columns. Left: uppercase eyebrow, serif headline (roman line + italic line), subtitle, dark "Choose a CSV file" button + "Try with sample data" button, compatibility note. Behind the text: looping eraser video as a background layer (position:absolute, z-index 0), edges faded with a CSS radial mask so it blends into the page. The whole hero is also a drop target. Stacks on screens under 860px.
- Below the hero: drop card, pills, animated tilted band of fake password rows, three steps, dark "Private by design" block, soft drifting shapes.
- No emojis. Professional tone. Sentence case. Honest copy: never promise a feature that does not exist.
- Respect `prefers-reduced-motion`.

## Rules
- Never commit a real password CSV. `.gitignore` must contain `*.csv`.
- Keep all user-visible text in `js/i18n.js` (English, French, Spanish).

## Planned next steps
1. Merge the legal pad + eraser animation from the prototype into the home screen (the pad becomes the drop zone).
2. ~~Split into files~~ Done (2026-10-04): index.html, css/style.css, js/*.js, readable rewrite.
3. General CSV mode: choose which columns define a duplicate, filter by column value, remove empty rows, sort.
4. README: what it does, how it works, privacy explanation, screenshots. Host on GitHub Pages.
5. Optional later: browser extension shortcut that opens the site. No .exe.

## Ideas for the video / marketing
- Hero video: eraser scrubbing handwritten passwords off a yellow legal pad. Example fake entries: `netflix : hire-me123`, `gmail : adam123`, `amazon : password1`, `leboncoin : azerty123`, `facebook : qwerty`.
