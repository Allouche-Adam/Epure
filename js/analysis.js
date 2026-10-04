// Épure - password checks: duplicates, weak, reused, empty.
//
// Everything here is "pure": functions take data and return results,
// they never touch the page. That makes them easy to understand and to test on their own.


// Passwords that are weak no matter what (they are in every attacker's list)
const COMMON_PASSWORDS = [
  'password', 'password1', 'motdepasse', 'admin',
  'azerty', 'azerty123', 'qwerty',
  '123456', '12345678', '123456789', '000000', '111111',
];


/**
 * Extracts a clean domain from a URL, to compare sites.
 * getDomain('https://www.GitHub.com/login')  ->  'github.com'
 * getDomain('github.com')                    ->  'github.com'
 */
function getDomain(url) {
  url = (url || '').trim();
  if (!url) return '';
  try {
    // The URL class needs a protocol, so we add one if it's missing
    const fullUrl = url.includes('://') ? url : 'https://' + url;
    return new URL(fullUrl).hostname.toLowerCase().replace(/^www\./, '');
  } catch (error) {
    return url.toLowerCase(); // not a valid URL: compare it as plain text
  }
}


/**
 * True if a domain belongs to a site, subdomains included.
 * matchesSite('mail.google.com', 'google.com')  ->  true
 * matchesSite('notgoogle.com', 'google.com')    ->  false  (the "." check prevents this)
 */
function matchesSite(domain, site) {
  return domain === site || domain.endsWith('.' + site);
}


/**
 * A password is weak if:
 * - it is shorter than 8 characters, or
 * - it is a well-known common password, or
 * - it uses only one type of character (only lowercase, only digits...).
 */
function isWeakPassword(password) {
  if (password.length < 8) return true;
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) return true;

  const characterTypes = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/]; // lowercase, uppercase, digit, symbol
  const typesUsed = characterTypes.filter(type => type.test(password)).length;
  return typesUsed < 2;
}


/**
 * Looks at every entry and adds what we need to display and filter it:
 *   domain, username, password       (read from the CSV columns)
 *   isDuplicate, isWeak, isReused, isEmpty
 *
 * Called again after every change, because these flags depend on the whole list
 * (a password is only "reused" if another entry has it too).
 */
function analyzeEntries(entries, columns) {
  // Pass 1: read the useful values, and note which sites use each password.
  // sitesByPassword looks like: { 'hire-me123': Set { 'netflix.com', 'spotify.com' } }
  const sitesByPassword = new Map();
  for (const entry of entries) {
    entry.domain = getDomain(entry.fields[columns.url]);
    entry.username = columns.username ? (entry.fields[columns.username] || '') : '';
    entry.password = entry.fields[columns.password] || '';

    if (entry.password) {
      if (!sitesByPassword.has(entry.password)) sitesByPassword.set(entry.password, new Set());
      sitesByPassword.get(entry.password).add(entry.domain);
    }
  }

  // Pass 2: set the flags.
  // A Set only keeps unique values, so "have we seen this exact combination before?" is a quick lookup.
  const seen = new Set();
  for (const entry of entries) {
    // Two entries are duplicates if site, username and password are all the same.
    // The first one is not a duplicate; the next ones are.
    const key = [entry.domain, entry.username.toLowerCase(), entry.password].join('\u0001'); // a separator no one types
    entry.isDuplicate = seen.has(key);
    seen.add(key);

    entry.isEmpty = entry.password.trim() === '';
    entry.isWeak = !entry.isEmpty && isWeakPassword(entry.password);
    // Reused = the same password is used on more than one different site
    entry.isReused = !entry.isEmpty && sitesByPassword.get(entry.password).size > 1;
  }
}
