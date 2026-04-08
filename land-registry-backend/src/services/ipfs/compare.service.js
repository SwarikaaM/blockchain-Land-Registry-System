const { fuzzyMatch } = require('../../utils/fuzzyMatch');
const { convert } = require('../../utils/areaConvert');
const logger = require('../../utils/logger');

class CompareService {
  /**
   * Compare user-entered data against OCR-extracted data.
   * Returns per-field scores and an overall verdict.
   *
   * @param {Object} userInput - { ownerName, surveyNumber, area, areaUnit }
   * @param {Object} ocrExtracted - { ownerName, surveyNumber, area, areaUnit }
   * @param {Object} options - { nameThreshold, areaTolerancePercent }
   * @returns {Object} comparison result with verdict
   */
  compare(userInput, ocrExtracted, options = {}) {
    const {
      nameThreshold = 0.8,
      surveyThreshold = 0.9,
      areaTolerancePercent = 0.05
    } = options;

    const result = {
      nameMatch: { score: 0, passed: false },
      surveyMatch: { score: 0, passed: false },
      areaMatch: { score: 0, passed: false, tolerance: areaTolerancePercent },
      encumbranceFlag: false,
      overallScore: 0,
      verdict: 'officer_review'
    };

    // --- Name comparison ---
    if (userInput.ownerName && ocrExtracted.ownerName) {
      result.nameMatch.score = fuzzyMatch(userInput.ownerName, ocrExtracted.ownerName);
      result.nameMatch.passed = result.nameMatch.score >= nameThreshold;
    }

    // --- Survey number comparison ---
    if (userInput.surveyNumber && ocrExtracted.surveyNumber) {
      // Normalize survey numbers: remove spaces, lowercase
      const userSurvey = userInput.surveyNumber.replace(/\s/g, '').toLowerCase();
      const ocrSurvey = ocrExtracted.surveyNumber.replace(/\s/g, '').toLowerCase();

      if (userSurvey === ocrSurvey) {
        result.surveyMatch.score = 1;
        result.surveyMatch.passed = true;
      } else {
        result.surveyMatch.score = fuzzyMatch(userSurvey, ocrSurvey);
        result.surveyMatch.passed = result.surveyMatch.score >= surveyThreshold;
      }
    }

    // --- Area comparison ---
    if (userInput.area && ocrExtracted.area) {
      // Convert both to sqm for comparison
      const userUnit = userInput.areaUnit || 'sqm';
      const ocrUnit = ocrExtracted.areaUnit || 'sqm';

      const userAreaSqm = convert(userInput.area, userUnit, 'sqm');
      const ocrAreaSqm = convert(ocrExtracted.area, ocrUnit, 'sqm');

      if (userAreaSqm > 0 && ocrAreaSqm > 0) {
        const diff = Math.abs(userAreaSqm - ocrAreaSqm);
        const tolerance = userAreaSqm * areaTolerancePercent;

        result.areaMatch.passed = diff <= tolerance;
        result.areaMatch.score = result.areaMatch.passed
          ? 1
          : Math.max(0, 1 - (diff / userAreaSqm));
      }
    }

    // --- Encumbrance flag ---
    if (ocrExtracted.encumbrances) {
      const encText = ocrExtracted.encumbrances.toLowerCase();
      result.encumbranceFlag = /loan|lien|mortgage|बोजा|कर्ज|गहाण/.test(encText);
    }

    // --- Overall score and verdict ---
    const weights = { name: 0.4, survey: 0.3, area: 0.3 };
    result.overallScore =
      (result.nameMatch.score * weights.name) +
      (result.surveyMatch.score * weights.survey) +
      (result.areaMatch.score * weights.area);

    // Round to 4 decimal places
    result.overallScore = Math.round(result.overallScore * 10000) / 10000;
    result.nameMatch.score = Math.round(result.nameMatch.score * 10000) / 10000;
    result.surveyMatch.score = Math.round(result.surveyMatch.score * 10000) / 10000;
    result.areaMatch.score = Math.round(result.areaMatch.score * 10000) / 10000;

    // Determine verdict
    if (result.nameMatch.passed && result.surveyMatch.passed && result.areaMatch.passed && !result.encumbranceFlag) {
      result.verdict = 'auto_pass';
    } else if (result.overallScore < 0.4) {
      result.verdict = 'auto_fail';
    } else {
      result.verdict = 'officer_review';
    }

    logger.info('Comparison complete', {
      verdict: result.verdict,
      overallScore: result.overallScore
    });

    return result;
  }
}

module.exports = new CompareService();
