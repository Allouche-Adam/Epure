// Épure - main app: state, screen updates and buttons.
//
// Loaded last, after i18n.js, csv.js, analysis.js and sample-data.js.
// Plain <script> tags share one global scope, so this file can use their functions directly
// (t, parseCsv, toCsv, findColumn, getDomain, matchesSite, analyzeEntries, SAMPLE_CSV...).
//
// How the app works, in one sentence:
// every action builds a new list of entries, saves the old list for Undo, then render() redraws the screen.
//
// An entry looks like this:
//   { id: 3, fields: { name: 'github.com', url: 'https://github.com/login', username: 'me', password: '...', note: '' } }
// "fields" keeps every column of the original CSV, so the exported file contains them all.
// analyzeEntries() then adds: domain, username, password, isDuplicate, isWeak, isReused, isEmpty.


// ===================== Settings =====================

// Google Form for feedback. While empty, the feedback buttons stay hidden.
const FEEDBACK_URL = 'https://forms.gle/EFHqs7Pad2trdgGE6';

// Drawing thousands of table rows makes the page slow, so we stop here (the search narrows it down).
const MAX_ROWS_SHOWN = 500;

// The filter tabs. Each one has a translation key for its label and a test that says
// whether an entry belongs to it. Also used for the summary counts and the status tags.
const FILTERS = {
  all:        { label: 'filterAll',        test: entry => true },
  duplicates: { label: 'filterDuplicates', test: entry => entry.isDuplicate },
  weak:       { label: 'filterWeak',       test: entry => entry.isWeak },
  reused:     { label: 'filterReused',     test: entry => entry.isReused },
  empty:      { label: 'filterEmpty',      test: entry => entry.isEmpty },
};


// ===================== State =====================
// Everything the app remembers. The screen is always redrawn from these variables.

let csvHeaders = [];         // column names from the first line of the CSV, in their original order
let columns = {};            // which header holds the url, the username and the password
let entries = [];            // the current list: what you see and what gets exported
let originalEntries = [];    // the list as it was imported, for "Restore original"
let undoHistory = [];        // previous versions of `entries`, the most recent last
let lastAction = null;       // 'site', 'duplicates' or 'empty': which small Undo button is active
let selectedIds = new Set(); // ids of the entries ticked in the table
let revealedIds = new Set(); // ids of the entries whose password is shown
let activeFilter = 'all';    // key of the selected filter tab
let fileName = 'passwords.csv';
let nextId = 0;              // every entry gets a unique id, so we can find it again after changes
let editingId = null;        // id of the entry being edited, or null when the form adds a new one

// Shortcut, because we use it everywhere
function byId(id) {
  return document.getElementById(id);
}

// Makes text safe to put inside HTML: "<b>" is shown as text instead of becoming bold.
// Important here because the CSV content comes from outside.
function escapeHtml(text) {
  const replacements = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(text).replace(/[&<>"']/g, char => replacements[char]);
}


// ===================== Loading a file =====================

function loadCsv(text, name) {
  const rows = parseCsv(text);
  if (rows.length < 2) { // we need at least a header line and one entry
    showMessage(t('msgBadFile'));
    return;
  }

  const headers = rows[0];
  const foundColumns = {
    url: findColumn(headers, ['url', 'login_uri', 'origin', 'hostname', 'website']),
    username: findColumn(headers, ['username', 'login_username', 'user', 'login']),
    password: findColumn(headers, ['password', 'login_password', 'pass']),
  };
  if (!foundColumns.url || !foundColumns.password) {
    showMessage(t('msgColumnsNotFound', { headers: headers.join(', ') }));
    return;
  }

  csvHeaders = headers;
  columns = foundColumns;
  // Turn each row (an array of values) into an entry (values stored by column name)
  entries = rows.slice(1).map(values => {
    const fields = {};
    headers.forEach((header, index) => {
      fields[header] = values[index] ?? ''; // a short row gets empty values for the missing columns
    });
    return { id: nextId++, fields };
  });
  originalEntries = entries.slice(); // a copy of the list (same entry objects, but a separate array)
  fileName = name;

  resetWorkState();
  setHomeMode(false);
  showMessage(t('msgImported', { count: entries.length }));
  render();
}

function readFile(file) {
  if (!file) return;
  // file.text() reads the file in the browser. Nothing is uploaded anywhere.
  file.text().then(text => loadCsv(text, file.name));
}

function trySample() {
  loadCsv(SAMPLE_CSV, 'sample-passwords.csv');
  byId('sample-banner').hidden = false;
  window.scrollTo(0, 0);
}


// ===================== Home and work modes =====================

function setHomeMode(isHome) {
  document.querySelector('main').classList.toggle('home-mode', isHome);
  byId('hero').hidden = !isHome;
  byId('workspace').hidden = isHome;
  byId('summary-card').hidden = isHome;
  byId('top-sites-card').hidden = isHome;
}

// Clears everything tied to the previous file
function resetWorkState() {
  undoHistory = [];
  lastAction = null;
  selectedIds.clear();
  revealedIds.clear();
  activeFilter = 'all';
  byId('sample-banner').hidden = true;
  byId('feedback-card').hidden = true;
  setEntryForm(null);
}

function goHome() {
  // Only ask if the user changed something, so a misclick doesn't lose their work
  const hasChanges = entries.length > 0 && undoHistory.length > 0;
  if (hasChanges && !confirm(t('confirmGoHome'))) return;

  csvHeaders = [];
  entries = [];
  originalEntries = [];
  resetWorkState();
  byId('file-input').value = ''; // so choosing the same file again still triggers "change"
  byId('search').value = '';
  byId('site-input').value = '';
  byId('message').hidden = true;
  setHomeMode(true);
  window.scrollTo(0, 0);
}


// ===================== Changes and Undo =====================
// Rule: we never modify the current list or its entries. Every change builds a NEW list.
// The old list goes into undoHistory untouched, so Undo just puts it back.

function applyChange(newEntries, message, action = null) {
  undoHistory.push(entries);
  entries = newEntries;
  selectedIds.clear();
  lastAction = action;
  render();
  showMessage(message, true);
}

function undo() {
  if (undoHistory.length === 0) return;
  entries = undoHistory.pop();
  selectedIds.clear();
  lastAction = null; // after any undo, the small Undo buttons are disabled until a new action
  render();
  showMessage(t('msgUndone'));
}

// The dark bar at the top of the workspace. The Undo button only shows when there is something to undo.
function showMessage(text, canUndo = false) {
  byId('message').hidden = false;
  byId('message-text').textContent = text;
  byId('undo-button').hidden = !(canUndo && undoHistory.length > 0);
}


// ===================== Drawing the screen =====================

function render() {
  analyzeEntries(entries, columns);

  const counts = {};
  for (const key in FILTERS) {
    counts[key] = entries.filter(FILTERS[key].test).length;
  }

  renderSummary(counts);
  renderTopSites();
  renderFilterTabs(counts);
  renderTable();
  updateButtons();
  updateSiteMatchCount();
}

function renderSummary(counts) {
  for (const key in counts) {
    byId('stat-' + key).textContent = counts[key];
  }
}

function renderTopSites() {
  // Count entries per site: { 'github.com': 2, 'netflix.com': 1, ... }
  const countBySite = {};
  for (const entry of entries) {
    countBySite[entry.domain] = (countBySite[entry.domain] || 0) + 1;
  }
  const topSites = Object.entries(countBySite)
    .sort((a, b) => b[1] - a[1]) // biggest count first
    .slice(0, 8);

  byId('top-sites-list').innerHTML = topSites.map(([domain, count]) => `
    <button class="site-row" data-site="${escapeHtml(domain)}">
      <span>${escapeHtml(domain || t('noSite'))}</span><b>${count}</b>
    </button>`).join('');
}

function renderFilterTabs(counts) {
  byId('filter-tabs').innerHTML = Object.keys(FILTERS).map(key => `
    <button class="filter-tab" data-filter="${key}" aria-pressed="${key === activeFilter}">
      ${t(FILTERS[key].label)} (${counts[key]})
    </button>`).join('');
}

function renderTable() {
  const search = byId('search').value.trim().toLowerCase();
  const visibleEntries = entries.filter(entry => {
    const matchesFilter = FILTERS[activeFilter].test(entry);
    const matchesSearch = !search || (entry.domain + ' ' + entry.username).toLowerCase().includes(search);
    return matchesFilter && matchesSearch;
  });

  const shownEntries = visibleEntries.slice(0, MAX_ROWS_SHOWN);
  byId('table-body').innerHTML = shownEntries.map(tableRowHtml).join('');
  // The "select all" box is ticked only if every row shown is selected.
  // Recomputed on each render, so it unticks itself after a removal, an undo or a new file.
  byId('select-all').checked = shownEntries.length > 0 && shownEntries.every(entry => selectedIds.has(entry.id));
  byId('no-entries').hidden = visibleEntries.length > 0;
  byId('table-cap').hidden = visibleEntries.length <= MAX_ROWS_SHOWN;
  byId('table-cap').textContent = t('tableCap', { shown: MAX_ROWS_SHOWN, total: visibleEntries.length });
}

function tableRowHtml(entry) {
  const isRevealed = revealedIds.has(entry.id);
  const statusTags = Object.keys(FILTERS)
    .filter(key => key !== 'all' && FILTERS[key].test(entry))
    .map(key => `<span class="status-tag">${t(FILTERS[key].label)}</span>`)
    .join('');

  // data-label is used by the phone layout to show the column name next to each value
  return `
    <tr>
      <td><input type="checkbox" data-select="${entry.id}" ${selectedIds.has(entry.id) ? 'checked' : ''}></td>
      <td data-label="${t('columnSite')}">${escapeHtml(entry.domain || entry.fields[columns.url])}</td>
      <td data-label="${t('columnUsername')}">${escapeHtml(entry.username)}</td>
      <td class="password-cell" data-label="${t('columnPassword')}">${isRevealed ? escapeHtml(entry.password) : '••••••••'}<button class="text-button" data-reveal="${entry.id}">${t(isRevealed ? 'hide' : 'show')}</button></td>
      <td data-label="${t('columnStatus')}">${statusTags}</td>
      <td><button class="text-button" data-edit="${entry.id}">${t('edit')}</button></td>
    </tr>`;
}

// Enables or disables buttons depending on the current state
function updateButtons() {
  const selectedCount = selectedIds.size;
  byId('remove-selected').disabled = selectedCount === 0;
  byId('remove-selected').textContent = t('removeSelection') + (selectedCount ? ` (${selectedCount})` : '');

  // A small Undo button works only right after its own action
  document.querySelectorAll('[data-undo]').forEach(button => {
    button.disabled = lastAction !== button.dataset.undo || undoHistory.length === 0;
  });

  // "Restore original" is useful only if the list differs from the imported one.
  // We compare the entry objects one by one: an edit creates a new object, so it counts as a change.
  const isUnchanged = entries.length === originalEntries.length
    && entries.every((entry, index) => entry === originalEntries[index]);
  byId('restore-original').disabled = isUnchanged;
}

// Live count under "Remove a site" while the user types
function updateSiteMatchCount() {
  const site = getDomain(byId('site-input').value);
  const count = site ? entries.filter(entry => matchesSite(entry.domain, site)).length : 0;
  byId('site-match-count').textContent = site ? t('matchCount', { count }) : '';
  byId('remove-site').disabled = count === 0;
}


// ===================== Clean up actions =====================

function removeSite() {
  const site = getDomain(byId('site-input').value);
  const count = entries.filter(entry => matchesSite(entry.domain, site)).length;
  applyChange(entries.filter(entry => !matchesSite(entry.domain, site)), t('msgSiteRemoved', { site, count }), 'site');
  byId('site-input').value = '';
  updateSiteMatchCount();
}

function removeDuplicates() {
  const count = entries.filter(entry => entry.isDuplicate).length;
  if (count === 0) {
    showMessage(t('msgNoDuplicates'));
    return;
  }
  applyChange(entries.filter(entry => !entry.isDuplicate), t('msgDuplicatesRemoved', { count }), 'duplicates');
}

function removeEmpty() {
  const count = entries.filter(entry => entry.isEmpty).length;
  if (count === 0) {
    showMessage(t('msgNoEmpty'));
    return;
  }
  applyChange(entries.filter(entry => !entry.isEmpty), t('msgEmptyRemoved', { count }), 'empty');
}

function removeSelected() {
  const count = selectedIds.size;
  applyChange(entries.filter(entry => !selectedIds.has(entry.id)), t('msgSelectionRemoved', { count }));
}

function restoreOriginal() {
  applyChange(originalEntries.slice(), t('msgRestored')); // undoable like any other change
}

function exportCsv() {
  const csvText = toCsv(csvHeaders, entries);
  // A Blob is a file that only exists in memory. We create a temporary link to it and click it,
  // which makes the browser download it. Still nothing leaves the device.
  const file = new Blob([csvText], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(file);
  link.download = fileName.replace(/\.csv$/i, '') + '_clean.csv';
  link.click();
  URL.revokeObjectURL(link.href); // free the memory

  showMessage(t('msgExported', { count: entries.length }));
  if (FEEDBACK_URL) byId('feedback-card').hidden = false;
}


// ===================== Add / edit an entry =====================
// One form does both jobs. editingId tells which one: null = add, an id = edit that entry.

function setEntryForm(entry) {
  editingId = entry ? entry.id : null;
  byId('entry-site').value = entry ? entry.fields[columns.url] : '';
  byId('entry-username').value = entry ? entry.username : '';
  byId('entry-password').value = entry ? entry.password : '';
  byId('entry-cancel').hidden = !entry;
  updateEntryFormLabels();
}

function updateEntryFormLabels() {
  const isEditing = editingId !== null;
  byId('entry-form-title').textContent = t(isEditing ? 'editEntryTitle' : 'addEntryTitle');
  byId('entry-save').textContent = t(isEditing ? 'save' : 'add');
}

function saveEntry() {
  const site = byId('entry-site').value.trim();
  const username = byId('entry-username').value.trim();
  const password = byId('entry-password').value;
  if (!site || !password) {
    showMessage(t('msgSiteAndPasswordNeeded'));
    return;
  }

  // Writes the form values into a fields object
  function fillFields(fields) {
    fields[columns.url] = site;
    if (columns.username) fields[columns.username] = username;
    fields[columns.password] = password;
    return fields;
  }

  const entryToEdit = entries.find(entry => entry.id === editingId);
  if (entryToEdit) {
    // Edit: build a NEW entry (same id, copied fields) instead of changing the old one.
    // The old entry stays untouched in undoHistory, so Undo can bring it back.
    const editedEntry = { id: entryToEdit.id, fields: fillFields({ ...entryToEdit.fields }) };
    const newEntries = entries.map(entry => (entry === entryToEdit ? editedEntry : entry));
    applyChange(newEntries, t('msgEdited', { site: getDomain(site) }));
  } else {
    // Add: a new entry with every column empty, then the form values
    const fields = {};
    csvHeaders.forEach(header => { fields[header] = ''; });
    const nameColumn = findColumn(csvHeaders, ['name', 'title']); // Chrome has a "name" column
    if (nameColumn) fields[nameColumn] = getDomain(site);
    applyChange([...entries, { id: nextId++, fields: fillFields(fields) }], t('msgAdded', { site: getDomain(site) }));
  }
  setEntryForm(null);
}

function startEditing(id) {
  setEntryForm(entries.find(entry => entry.id === id));
  byId('entry-form').scrollIntoView({ behavior: 'smooth', block: 'center' });
  byId('entry-site').focus({ preventScroll: true });
}


// ===================== Language =====================

function setLanguage(language) {
  currentLanguage = language;
  try {
    localStorage.setItem('lang', language); // remembered for the next visit
  } catch (error) {}

  document.documentElement.lang = language;
  byId('language').value = language;
  translatePage();
  updateEntryFormLabels();
  byId('message').hidden = true; // the old message is in the old language
  if (entries.length > 0) {
    render(); // table rows and tabs are generated by JS, so they must be redrawn
  } else {
    byId('remove-selected').textContent = t('removeSelection');
  }
}


// ===================== Home page decoration =====================

function buildRibbon() {
  const itemsHtml = RIBBON_ROWS.map(row => `
    <span class="ribbon-item">
      <b>${row.site}</b><span>${row.user}</span><span>••••••••</span>
      ${row.tag ? `<i class="ribbon-tag" data-text="${row.tag}"></i>` : ''}
    </span>`).join('');
  // The items are written twice; the CSS animation moves them by half, so the loop has no visible jump
  byId('ribbon-track').innerHTML = itemsHtml + itemsHtml;
}


// ===================== Connecting buttons to functions =====================

// Header
byId('home-button').addEventListener('click', goHome);
byId('language').addEventListener('change', event => setLanguage(event.target.value));

// Importing: file picker, drag and drop, sample data
byId('file-input').addEventListener('change', event => readFile(event.target.files[0]));
byId('try-sample').addEventListener('click', trySample);
byId('try-sample-link').addEventListener('click', trySample);

// Two drop targets: the import card and the whole hero (video included)
for (const dropTarget of [byId('drop-zone'), byId('hero')]) {
  // preventDefault() stops the browser from opening the dropped file itself
  dropTarget.addEventListener('dragenter', event => { event.preventDefault(); dropTarget.classList.add('drag-over'); });
  dropTarget.addEventListener('dragover', event => { event.preventDefault(); dropTarget.classList.add('drag-over'); });
  dropTarget.addEventListener('dragleave', event => { event.preventDefault(); dropTarget.classList.remove('drag-over'); });
  dropTarget.addEventListener('drop', event => {
    event.preventDefault();
    dropTarget.classList.remove('drag-over');
    readFile(event.dataTransfer.files[0]);
  });
}

// Clean up tools
byId('site-input').addEventListener('input', updateSiteMatchCount);
byId('remove-site').addEventListener('click', removeSite);
byId('remove-duplicates').addEventListener('click', removeDuplicates);
byId('remove-empty').addEventListener('click', removeEmpty);
byId('entry-save').addEventListener('click', saveEntry);
byId('entry-cancel').addEventListener('click', () => setEntryForm(null));
byId('restore-original').addEventListener('click', restoreOriginal);
byId('export-csv').addEventListener('click', exportCsv);

// Undo: the main button in the message bar, and the small ones next to each action
byId('undo-button').addEventListener('click', undo);
document.querySelectorAll('[data-undo]').forEach(button => {
  button.addEventListener('click', () => {
    if (lastAction === button.dataset.undo) undo();
  });
});

// Search and selection
byId('search').addEventListener('input', render);
byId('remove-selected').addEventListener('click', removeSelected);
byId('select-all').addEventListener('change', event => {
  // Ticks or unticks every row currently visible in the table
  document.querySelectorAll('#table-body input[data-select]').forEach(checkbox => {
    const id = Number(checkbox.dataset.select);
    if (event.target.checked) selectedIds.add(id);
    else selectedIds.delete(id);
  });
  render();
});

// Table rows are recreated on every render, so instead of adding listeners to each button,
// we listen once on the whole table and check what was clicked ("event delegation").
byId('table-body').addEventListener('click', event => {
  const { reveal, edit } = event.target.dataset;
  if (reveal) {
    const id = Number(reveal);
    if (revealedIds.has(id)) revealedIds.delete(id);
    else revealedIds.add(id);
    render();
  }
  if (edit) startEditing(Number(edit));
});
byId('table-body').addEventListener('change', event => {
  const checkbox = event.target;
  if (!checkbox.dataset.select) return;
  const id = Number(checkbox.dataset.select);
  if (checkbox.checked) selectedIds.add(id);
  else selectedIds.delete(id);
  render();
});

// Filter tabs and top sites (same delegation idea)
byId('filter-tabs').addEventListener('click', event => {
  const tab = event.target.closest('[data-filter]');
  if (!tab) return;
  activeFilter = tab.dataset.filter;
  render();
});
byId('top-sites-list').addEventListener('click', event => {
  const siteButton = event.target.closest('[data-site]');
  if (!siteButton) return;
  byId('site-input').value = siteButton.dataset.site; // fills "Remove a site", the user still confirms
  updateSiteMatchCount();
  byId('site-input').focus();
});

// Feedback: plain links to the Google Form, opened in a new tab. The tool itself sends nothing.
byId('feedback-link').href = FEEDBACK_URL;
byId('feedback-card-link').href = FEEDBACK_URL;
byId('feedback-link').hidden = !FEEDBACK_URL;
byId('feedback-card-close').addEventListener('click', () => { byId('feedback-card').hidden = true; });

// Reduced motion: keep the hero video still on its first frame instead of looping
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const video = byId('hero-video');
  video.removeAttribute('autoplay');
  video.pause();
}


// ===================== Start =====================
buildRibbon();
setLanguage(detectLanguage());
