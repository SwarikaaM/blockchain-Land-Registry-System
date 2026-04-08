const { distance } = require('fastest-levenshtein');

/**
 * Normalize a string for comparison:
 * - Lowercase
 * - Trim whitespace
 * - Normalize Unicode (NFC for consistent Marathi/Devanagari)
 * - Remove extra spaces
 */
function normalize(str) {
  if (!str) return '';
  return str
    .normalize('NFC')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Fuzzy match two strings using Levenshtein distance.
 * Returns a similarity score between 0 and 1.
 *
 * Handles Marathi (Devanagari) and English names.
 *
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} Similarity score (0-1)
 */
function fuzzyMatch(a, b) {
  if (!a || !b) return 0;

  const na = normalize(a);
  const nb = normalize(b);

  if (na === nb) return 1;
  if (!na.length || !nb.length) return 0;

  const maxLen = Math.max(na.length, nb.length);
  const dist = distance(na, nb);

  return Math.max(0, (maxLen - dist) / maxLen);
}

/**
 * Find the best match for a name against an array of candidates.
 *
 * @param {string} target - Name to match
 * @param {string[]} candidates - Array of possible names
 * @returns {{ match: string, score: number, index: number }}
 */
function bestMatch(target, candidates) {
  if (!candidates || !candidates.length) return { match: null, score: 0, index: -1 };

  let best = { match: null, score: 0, index: -1 };

  candidates.forEach((candidate, i) => {
    const score = fuzzyMatch(target, candidate);
    if (score > best.score) {
      best = { match: candidate, score, index: i };
    }
  });

  return best;
}

module.exports = fuzzyMatch;
module.exports.fuzzyMatch = fuzzyMatch;
module.exports.bestMatch = bestMatch;
module.exports.normalize = normalize;