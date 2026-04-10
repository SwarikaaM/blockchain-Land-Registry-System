// src/services/mahabhulekh/compare.service.js

const { fuzzyMatch } = require('../../utils/fuzzyMatch');
const logger = require('../../utils/logger');

class CompareService {

  // ─────────────────────────────────────────────
  // NORMALIZATION (CRITICAL FIX)
  // ─────────────────────────────────────────────
  normalizeName(name) {
    return (name || '')
      .replace(/\u200B|\u200C|\u200D/g, '') // zero-width chars
      .replace(/\s+/g, ' ')
      .trim();
  }

  // ─────────────────────────────────────────────
  // HARD MATCH (EXACT IDENTITY MATCH)
  // ─────────────────────────────────────────────
  hardMatch(a, b) {
    return this.normalizeName(a) === this.normalizeName(b);
  }

  // ─────────────────────────────────────────────
  // SAFE BEST MATCH (FIXED Fuzzy + Exact priority)
  // ─────────────────────────────────────────────
  safeBestMatch(userName, list) {
    const nUser = this.normalizeName(userName);

    let best = { match: '', score: 0 };

    for (const item of list) {
      const nItem = this.normalizeName(item);

      // 🔥 EXACT MATCH FIRST (CRITICAL FIX)
      if (nUser === nItem) {
        return { match: item, score: 1 };
      }

      const score = fuzzyMatch(nUser, nItem);

      if (score > best.score) {
        best = { match: item, score };
      }
    }

    return best;
  }

  // ─────────────────────────────────────────────
  // MAIN COMPARE FUNCTION
  // ─────────────────────────────────────────────
  compare(userInput, parsed) {

    const result = {
      nameMatch: { score: 0, passed: false, details: [] },
      surveyMatch: { score: 0, passed: false },
      areaMatch: { score: 0, passed: false },
      encumbranceFlag: false,
      overallScore: 0,
      verdict: 'officer_review',
      extraOwners: [],
      missingOwners: []
    };

    // ─────────────────────────────────────────────
    // 1. NAME MATCH (FIXED SET-BASED LOGIC)
    // ─────────────────────────────────────────────
    if (userInput.ownerName && parsed.owners?.length > 0) {

      const userNames = userInput.ownerName
        .split(',')
        .map(n => this.normalizeName(n))
        .filter(Boolean);

      const ocrOwners = parsed.owners.map(n => this.normalizeName(n));

      // ── Forward match (user → OCR) ──
      const forwardMatches = userNames.map(u => {
        const m = this.safeBestMatch(u, ocrOwners);
        return {
          userName: u,
          bestMatch: m.match,
          score: m.score
        };
      });

      const forwardScore =
        forwardMatches.reduce((a, b) => a + b.score, 0) /
        Math.max(forwardMatches.length, 1);

      // ── Reverse match (OCR → user) ──
      const reverseMatches = ocrOwners.map(o => {
        const m = this.safeBestMatch(o, userNames);
        return {
          ocrName: o,
          bestMatch: m.match,
          score: m.score
        };
      });

      const reverseScore =
        reverseMatches.reduce((a, b) => a + b.score, 0) /
        Math.max(reverseMatches.length, 1);

      // ── FINAL BALANCED SCORE ──
      result.nameMatch.score =
        (forwardScore * 0.7) + (reverseScore * 0.3);

      result.nameMatch.passed = result.nameMatch.score >= 0.8;

      result.nameMatch.details = forwardMatches;

      // ── EXTRA OWNERS DETECTION ──
      result.extraOwners = ocrOwners.filter(o =>
        !userNames.some(u => this.hardMatch(u, o))
      );

      // ── MISSING OWNERS DETECTION ──
      result.missingOwners = userNames.filter(u =>
        !ocrOwners.some(o => this.hardMatch(u, o))
      );

      // ── FAST PATH: PERFECT MATCH OVERRIDE ──
      const allExact =
        userNames.every(u =>
          ocrOwners.some(o => this.hardMatch(u, o))
        );

      if (allExact) {
        result.nameMatch.score = 1;
        result.nameMatch.passed = true;
        result.extraOwners = [];
        result.missingOwners = [];
      }
    }

    // ─────────────────────────────────────────────
    // 2. SURVEY MATCH
    // ─────────────────────────────────────────────
    if (userInput.fullSurveyInput && parsed.surveyNumber) {
      const userSurvey = userInput.fullSurveyInput
        .replace(/\s/g, '')
        .toLowerCase();

      const parsedSurvey = parsed.surveyNumber
        .replace(/\s/g, '')
        .toLowerCase();

      result.surveyMatch.score = fuzzyMatch(userSurvey, parsedSurvey);
      result.surveyMatch.passed = result.surveyMatch.score >= 0.85;
    }

    // ─────────────────────────────────────────────
    // 3. AREA MATCH
    // ─────────────────────────────────────────────
    if (userInput.area && parsed.area) {
      const userArea = parseFloat(userInput.area);
      const parsedArea = parseFloat(parsed.area);

      if (userArea > 0 && parsedArea > 0) {
        const diff = Math.abs(userArea - parsedArea);

        result.areaMatch.passed = diff <= userArea * 0.1;

        result.areaMatch.score = result.areaMatch.passed
          ? 1
          : Math.max(0, 1 - (diff / userArea));
      }
    }

    // ─────────────────────────────────────────────
    // 4. ENCUMBRANCE CHECK
    // ─────────────────────────────────────────────
    if (parsed.encumbrances) {
      result.encumbranceFlag =
        /बोजा|कर्ज|गहाण|भार|lien|loan/i.test(parsed.encumbrances) &&
        !/नाही|फेरफार\s*नाही/i.test(parsed.encumbrances);
    }

    // ─────────────────────────────────────────────
    // 5. OVERALL SCORE
    // ─────────────────────────────────────────────
    result.overallScore =
      (result.nameMatch.score * 0.45) +
      (result.surveyMatch.score * 0.35) +
      (result.areaMatch.score * 0.20);

    result.overallScore =
      Math.round(result.overallScore * 10000) / 10000;

    // ─────────────────────────────────────────────
    // 6. VERDICT LOGIC
    // ─────────────────────────────────────────────
    if (
      result.nameMatch.passed &&
      result.surveyMatch.passed &&
      result.areaMatch.passed &&
      !result.encumbranceFlag
    ) {
      result.verdict = 'auto_pass';
    } else if (
      result.overallScore < 0.4 ||
      !result.surveyMatch.passed
    ) {
      result.verdict = 'auto_fail';
    } else {
      result.verdict = 'officer_review';
    }

    // ─────────────────────────────────────────────
    // 7. LOGGING
    // ─────────────────────────────────────────────
    logger.info('Comparison completed', {
      nameScore: result.nameMatch.score,
      surveyScore: result.surveyMatch.score,
      areaScore: result.areaMatch.score,
      overall: result.overallScore,
      verdict: result.verdict,
      extraOwners: result.extraOwners,
      missingOwners: result.missingOwners
    });

    return result;
  }
}

module.exports = new CompareService();