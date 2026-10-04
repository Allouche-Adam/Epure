// Épure - reading and writing CSV files.
//
// A CSV file is plain text: one line per row, values separated by commas.
//   url,username,password
//   https://github.com,me,hunter2
// If a value contains a comma, a quote or a line break, it is wrapped in double quotes,
// and a quote inside it is written twice:  "say ""hi"", please"  ->  say "hi", please
//
// We can't just split on commas, because of those quoted values. So we read character by character.


/**
 * Turns CSV text into an array of rows. Each row is an array of strings.
 * parseCsv('a,b\n1,"x,y"')  ->  [['a', 'b'], ['1', 'x,y']]
 */
function parseCsv(text) {
  // Some programs add an invisible "byte order mark" at the very start of the file. Remove it.
  text = text.replace(/^﻿/, '');

  const rows = [];
  let currentRow = [];
  let currentValue = '';
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (insideQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        currentValue += '"'; // "" inside quotes means one real quote character
        i++;                 // skip the second quote
      } else if (char === '"') {
        insideQuotes = false; // closing quote
      } else {
        currentValue += char; // inside quotes, commas and line breaks are just text
      }
    } else if (char === '"') {
      insideQuotes = true; // opening quote
    } else if (char === ',') {
      currentRow.push(currentValue); // end of a value
      currentValue = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i++; // Windows ends lines with "\r\n": count it once
      currentRow.push(currentValue); // end of a value and of the row
      rows.push(currentRow);
      currentRow = [];
      currentValue = '';
    } else {
      currentValue += char;
    }
  }

  // The last line often has no line break after it: don't forget it
  if (currentValue !== '' || currentRow.length > 0) {
    currentRow.push(currentValue);
    rows.push(currentRow);
  }

  // Remove blank lines (rows where every value is empty)
  return rows.filter(row => row.some(value => value !== ''));
}


/** Prepares one value for writing: adds quotes only when the value needs them. */
function escapeCsvValue(value) {
  if (/[",\n\r]/.test(value)) {
    return '"' + value.replace(/"/g, '""') + '"';
  }
  return value;
}


/**
 * Turns entries back into CSV text, with the same columns and column order as the imported file.
 * Every original column is kept (name, note, etc.), not only the ones Épure uses.
 */
function toCsv(headers, entries) {
  const lines = [headers.map(escapeCsvValue).join(',')];
  for (const entry of entries) {
    const values = headers.map(header => escapeCsvValue(entry.fields[header] ?? ''));
    lines.push(values.join(','));
  }
  return lines.join('\r\n'); // "\r\n" line endings: the most compatible choice for CSV
}


/**
 * Finds which header matches one of the possible names (ignoring case and spaces).
 * Browsers name columns differently: Chrome says "url", Firefox says "url" too,
 * but other tools use "login_uri" or "website". The first name in the list wins.
 * Returns the header exactly as written in the file, or null if none matches.
 */
function findColumn(headers, possibleNames) {
  for (const name of possibleNames) {
    const match = headers.find(header => header.toLowerCase().trim() === name);
    if (match) return match;
  }
  return null;
}
