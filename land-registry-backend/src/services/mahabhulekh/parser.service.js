// src/services/mahabhulekh/parser.service.js

const cheerio = require('cheerio');
const logger = require('../../utils/logger');

class ParserService {
  /**
   * Parse scraped Mahabhulekh v2.0 HTML to extract structured land record data.
   *
   * Mahabhulekh response structure:
   * - Owner table: #gvOwnerDetails (ASP.NET GridView)
   *   - Columns: Sr.No, Khatedar Name, Area (He./Acre/R)
   * - Land info in #ContentPlaceHolder1_lbl* labels
   * - Area displayed in Hectare-Are format (He.आर.चौ.मी)
   *
   * @param {string} html - Raw HTML from Mahabhulekh portal
   * @returns {{ owners: string[], area: string, encumbrances: string, surveyNumber: string, villageName: string }}
   */
  parseHTML(html) {
    const result = {
      owners: [],
      area: '',
      encumbrances: '',
      surveyNumber: '',
      villageName: ''
    };

    if (!html || typeof html !== 'string' || html.trim().length === 0) {
      logger.warn('Parser received empty HTML');
      return result;
    }

    const $ = cheerio.load(html);

    // ── Extract owner names from gvOwnerDetails table ──────────────
    // Mahabhulekh uses ASP.NET GridView with id pattern: gvOwnerDetails
    const ownerTableSelectors = [
      '#gvOwnerDetails tr',          // Standard Mahabhulekh
      '#ContentPlaceHolder1_gvOwnerDetails tr',
      'table.owner-table tr',         // Alternate layout
      '[id*="OwnerDetails"] tr',      // Fuzzy ID match
      '[id*="ownerdetail"] tr'
    ];

    for (const selector of ownerTableSelectors) {
      const rows = $(selector);
      if (rows.length > 1) { // First row is header
        rows.each((i, row) => {
          if (i === 0) return; // Skip header row
          const cells = $(row).find('td');
          if (cells.length >= 2) {
            // Column 1 = Sr.No, Column 2 = Khatedar/Owner name
            const name = $(cells[1]).text().trim();
            if (name && name.length > 0 && !/^[\d\s.]+$/.test(name)) {
              result.owners.push(name);
            }
          }
        });
        if (result.owners.length > 0) break;
      }
    }

    // Fallback: Look for owner names in Marathi-labeled sections
    if (result.owners.length === 0) {
      $('td, span, div').each((i, el) => {
        const text = $(el).text().trim();
        // Look for text after Marathi labels for owner/khatedar
        if (/खातेदाराचे\s*नाव|मालकाचे\s*नाव|khatedar/i.test(text)) {
          const nextSibling = $(el).next().text().trim();
          const colonSplit = text.split(/[:：\-–—]/).pop().trim();
          const name = colonSplit.length > 2 ? colonSplit : nextSibling;
          if (name && !/खातेदार|मालक|khatedar/i.test(name)) {
            result.owners.push(name);
          }
        }
      });
    }

    // ── Extract area ───────────────────────────────────────────────
    // Mahabhulekh format: "He. आर. चौ.मी." or just numeric values
    const areaSelectors = [
      '#ContentPlaceHolder1_lblArea',
      '#ContentPlaceHolder1_lblTotalArea',
      '[id*="lblArea"]',
      '[id*="Area"]'
    ];

    for (const selector of areaSelectors) {
      const areaText = $(selector).text().trim();
      if (areaText && areaText.length > 0) {
        result.area = areaText;
        break;
      }
    }

    // Fallback: Search for area in Marathi labels
    if (!result.area) {
      $('td, span').each((i, el) => {
        const text = $(el).text().trim();
        if (/क्षेत्र|एकूण\s*क्षेत्र|total\s*area/i.test(text)) {
          const value = text.match(/[\d]+\.?\d*/);
          if (value) {
            result.area = value[0];
          } else {
            const nextText = $(el).next().text().trim();
            if (nextText) result.area = nextText;
          }
        }
      });
    }

    // ── Extract encumbrances (भार/बोजा) ───────────────────────────
    const encumbranceSelectors = [
      '#ContentPlaceHolder1_lblEncumbrance',
      '[id*="lblEncumbrance"]',
      '[id*="Encumbrance"]',
      '[id*="boja"]',
      '[id*="Bhar"]'
    ];

    for (const selector of encumbranceSelectors) {
      const encText = $(selector).text().trim();
      if (encText && encText.length > 0) {
        result.encumbrances = encText;
        break;
      }
    }

    // Fallback: Marathi label search
    if (!result.encumbrances) {
      $('td, span').each((i, el) => {
        const text = $(el).text().trim();
        if (/भार|बोजा|encumbrance|loan|lien/i.test(text)) {
          const colonSplit = text.split(/[:：\-–—]/).pop().trim();
          if (colonSplit.length > 1 && !/भार|बोजा/i.test(colonSplit)) {
            result.encumbrances = colonSplit;
          } else {
            const nextText = $(el).next().text().trim();
            if (nextText) result.encumbrances = nextText;
          }
        }
      });
    }

    // ── Extract survey/gat number ──────────────────────────────────
    const surveySelectors = [
      '#ContentPlaceHolder1_lblSurveyNo',
      '#ContentPlaceHolder1_lblGatNo',
      '[id*="lblSurvey"]',
      '[id*="lblGat"]',
      '[id*="SurveyNo"]'
    ];

    for (const selector of surveySelectors) {
      const surveyText = $(selector).text().trim();
      if (surveyText && surveyText.length > 0) {
        result.surveyNumber = surveyText;
        break;
      }
    }

    // ── Extract village name ───────────────────────────────────────
    const villageSelectors = [
      '#ContentPlaceHolder1_lblVillage',
      '[id*="lblVillage"]',
      '[id*="Village"]'
    ];

    for (const selector of villageSelectors) {
      const villageText = $(selector).text().trim();
      if (villageText && villageText.length > 0) {
        result.villageName = villageText;
        break;
      }
    }

    logger.info('Mahabhulekh HTML parsed', {
      ownersFound: result.owners.length,
      hasArea: !!result.area,
      hasEncumbrances: !!result.encumbrances,
      hasSurvey: !!result.surveyNumber
    });

    return result;
  }

  /**
   * Parse Mahabhulekh PDF buffer (placeholder).
   */
  parsePDF(pdfBuffer) {
    logger.warn('PDF parsing not yet implemented — use HTML parsing');
    return {
      extractedText: 'PDF parsing not implemented yet'
    };
  }
}

module.exports = new ParserService();