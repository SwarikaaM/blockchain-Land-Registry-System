// src/services/mahabhulekh/verifier.service.js

const fuzzyMatch = require('../../utils/fuzzyMatch');

class VerifierService {
  verify({ input, scraped }) {
    const result = {
      nameMatch: false,
      areaMatch: false,
      encumbranceFlag: false,
      score: 0
    };

    // Name matching
    const matches = scraped.owners.map(owner =>
      fuzzyMatch(owner, input.ownerName)
    );

    const maxMatch = Math.max(...matches);
    result.nameMatch = maxMatch > 0.8;

    // Area check (tolerance ±5%)
    const inputArea = parseFloat(input.area);
    const scrapedArea = parseFloat(scraped.area);

    const tolerance = inputArea * 0.05;
    result.areaMatch = Math.abs(inputArea - scrapedArea) <= tolerance;

    // Encumbrance
    result.encumbranceFlag = scraped.encumbrances.includes("loan");

    // Score
    result.score =
      (result.nameMatch ? 0.4 : 0) +
      (result.areaMatch ? 0.4 : 0) +
      (!result.encumbranceFlag ? 0.2 : 0);

    return result;
  }
}

module.exports = new VerifierService();