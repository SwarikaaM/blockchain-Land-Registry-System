// src/services/mahabhulekh/verifier.service.js

const { fuzzyMatch, bestMatch } = require('../../utils/fuzzyMatch');
const { convert } = require('../../utils/areaConvert');
const logger = require('../../utils/logger');

/**
 * Configurable verification thresholds.
 */
const DEFAULTS = {
  nameThreshold: 0.8,        // Minimum fuzzy match score for name
  areaTolerancePercent: 0.05, // 5% area tolerance
  encumbranceKeywords: /loan|lien|mortgage|बोजा|कर्ज|गहाण|तारण|कब्जा/i
};

class VerifierService {
  /**
   * Verify user-entered data against Mahabhulekh scraped data.
   * Supports multi-owner matching, configurable thresholds, and structured verdicts.
   *
   * @param {Object} params
   * @param {Object} params.input - User-entered form data (ownerName, area, areaUnit, etc.)
   * @param {Object} params.scraped - Parsed Mahabhulekh data (owners[], area, encumbrances)
   * @param {Object} [params.options] - Custom thresholds
   * @returns {Object} Structured verification result
   */
  verify({ input, scraped, options = {} }) {
    const config = { ...DEFAULTS, ...options };

    const result = {
      nameMatch: false,
      nameScore: 0,
      nameDetails: [],      // Per-owner match scores
      areaMatch: false,
      areaScore: 0,
      areaDetails: {},
      encumbranceFlag: false,
      encumbranceText: '',
      score: 0,
      verdict: 'officer_review',  // 'auto_pass' | 'auto_fail' | 'officer_review'
      flags: [],            // Human-readable flag messages
      thresholds: {
        nameThreshold: config.nameThreshold,
        areaTolerance: config.areaTolerancePercent
      }
    };

    // ── Name Matching (multi-owner support) ────────────────────────
    if (input.ownerName && scraped.owners && scraped.owners.length > 0) {
      // Match user-entered name against all scraped owners
      const { match, score, index } = bestMatch(input.ownerName, scraped.owners);

      result.nameScore = Math.round(score * 10000) / 10000;
      result.nameMatch = score >= config.nameThreshold;

      // Per-owner detail for transparency
      result.nameDetails = scraped.owners.map((owner, i) => ({
        scrapedName: owner,
        score: Math.round(fuzzyMatch(input.ownerName, owner) * 10000) / 10000,
        isBestMatch: i === index
      }));

      if (!result.nameMatch) {
        result.flags.push(`Name mismatch: "${input.ownerName}" vs best match "${match}" (score: ${result.nameScore})`);
      }
    } else {
      result.flags.push('Owner name not available for comparison');
    }

    // ── Area Matching ──────────────────────────────────────────────
    const inputArea = parseFloat(input.area);
    const scrapedAreaRaw = parseFloat(scraped.area);

    if (!isNaN(inputArea) && inputArea > 0 && !isNaN(scrapedAreaRaw) && scrapedAreaRaw > 0) {
      // Attempt unit-aware comparison
      const inputUnit = input.areaUnit || 'sqm';
      let inputAreaSqm, scrapedAreaSqm;

      try {
        inputAreaSqm = convert(inputArea, inputUnit, 'sqm');
      } catch {
        inputAreaSqm = inputArea;  // Fallback: assume sqm
      }

      // Scraped area is usually in hectares from Mahabhulekh
      // Try to detect from the text, otherwise assume hectare
      let scrapedUnit = 'hectare';
      if (scraped.area && /चौ\.?\s*मी|sq\.?\s*m/i.test(scraped.area)) scrapedUnit = 'sqm';
      else if (/एकर|acre/i.test(scraped.area)) scrapedUnit = 'acre';
      else if (/गुंठा|guntha/i.test(scraped.area)) scrapedUnit = 'guntha';

      try {
        scrapedAreaSqm = convert(scrapedAreaRaw, scrapedUnit, 'sqm');
      } catch {
        scrapedAreaSqm = scrapedAreaRaw;
      }

      const diff = Math.abs(inputAreaSqm - scrapedAreaSqm);
      const tolerance = inputAreaSqm * config.areaTolerancePercent;

      result.areaMatch = diff <= tolerance;
      result.areaScore = result.areaMatch ? 1 : Math.max(0, 1 - (diff / inputAreaSqm));
      result.areaScore = Math.round(result.areaScore * 10000) / 10000;

      result.areaDetails = {
        inputArea: Math.round(inputAreaSqm * 100) / 100,
        inputUnit,
        scrapedArea: Math.round(scrapedAreaSqm * 100) / 100,
        scrapedUnit,
        diffSqm: Math.round(diff * 100) / 100,
        toleranceSqm: Math.round(tolerance * 100) / 100
      };

      if (!result.areaMatch) {
        result.flags.push(
          `Area mismatch: ${Math.round(inputAreaSqm)} sqm (entered) vs ${Math.round(scrapedAreaSqm)} sqm (scraped), diff ${Math.round(diff)} sqm exceeds ${config.areaTolerancePercent * 100}% tolerance`
        );
      }
    } else {
      result.flags.push('Area not available for comparison');
    }

    // ── Encumbrance Detection ──────────────────────────────────────
    if (scraped.encumbrances && scraped.encumbrances.trim()) {
      result.encumbranceText = scraped.encumbrances;
      result.encumbranceFlag = config.encumbranceKeywords.test(scraped.encumbrances);

      if (result.encumbranceFlag) {
        result.flags.push(`Encumbrance detected: "${scraped.encumbrances.substring(0, 100)}"`);
      }
    }

    // ── Overall Score & Verdict ────────────────────────────────────
    // Weighted: name 40%, area 40%, no-encumbrance 20%
    result.score =
      (result.nameScore * 0.4) +
      (result.areaScore * 0.4) +
      (!result.encumbranceFlag ? 0.2 : 0);
    result.score = Math.round(result.score * 10000) / 10000;

    // Verdict determination
    if (result.nameMatch && result.areaMatch && !result.encumbranceFlag) {
      result.verdict = 'auto_pass';
    } else if (result.score < 0.3) {
      result.verdict = 'auto_fail';
    } else {
      result.verdict = 'officer_review';
    }

    logger.info('Verification complete', {
      verdict: result.verdict,
      score: result.score,
      nameMatch: result.nameMatch,
      areaMatch: result.areaMatch,
      encumbranceFlag: result.encumbranceFlag,
      flagCount: result.flags.length
    });

    return result;
  }
}

module.exports = new VerifierService();