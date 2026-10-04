# Épure

**Clean your browser's password export, without sending it anywhere.**

**Live:** [epure-cleaner.vercel.app](https://epure-cleaner.vercel.app)

Drop the CSV exported from Chrome, Edge, Firefox or Brave. Épure finds what needs cleaning and gives you back a clean file. No real file at hand? Click **Try with sample data**: every entry is fake.

## Features

- Detects **duplicates**, **weak passwords**, **reused passwords** and **empty entries**
- Removes every entry of a site, subdomains included
- Add or edit entries, search, filter
- Undo any step, or restore the original file
- Exports a clean CSV (your original file is never modified)
- English, French and Spanish
- Works on desktop and phone

## Privacy

Everything runs in your browser. No server, no account, no upload, no tracking.
You can check it yourself: open your browser's Network tab, load a file, and nothing is sent.

## Run it locally

No install and no build step. Download the project and open `index.html` in your browser.

## Project structure

```
index.html            page structure
css/style.css         styles
js/i18n.js            translations (EN, FR, ES)
js/csv.js             reading and writing CSV
js/analysis.js        duplicate, weak and reused password checks
js/sample-data.js     fake demo data
js/app.js             app logic: state, rendering, actions
assets/hero.mp4       hero video
```

## Built with

Plain HTML, CSS and JavaScript, with no framework and no library. Deployed on Vercel.
Built with AI as a coding partner. The hero animation was made with Google AI Studio (Gemini).

## Feedback

Found a bug or have an idea? Use the **Feedback** button on the site, or open an issue.
