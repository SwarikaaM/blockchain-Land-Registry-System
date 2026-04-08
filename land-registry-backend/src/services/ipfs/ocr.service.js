const Tesseract = require('tesseract.js');
const logger = require('../../utils/logger');

class OCRService {
  /**
   * Extract text from an image buffer using Tesseract.js.
   * Supports Marathi (mar) + English (eng) for 7/12 extracts.
   *
   * @param {Buffer} imageBuffer - Image file buffer
   * @param {string[]} langs - Language codes (default: mar+eng)
   * @returns {{ rawText: string, confidence: number }}
   */
  async extractText(imageBuffer, langs = ['mar', 'eng']) {
    try {
      logger.info('Starting OCR extraction', { langs: langs.join('+') });

      const result = await Tesseract.recognize(
        imageBuffer,
        langs.join('+'),
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              logger.debug('OCR progress', { progress: Math.round(m.progress * 100) });
            }
          }
        }
      );

      const rawText = result.data.text;
      const confidence = result.data.confidence;

      logger.info('OCR extraction complete', {
        textLength: rawText.length,
        confidence
      });

      return { rawText, confidence };
    } catch (err) {
      logger.error('OCR extraction failed', { error: err.message });
      throw new Error(`OCR failed: ${err.message}`);
    }
  }

  /**
   * Parse a Marathi 7/12 land record OCR output to extract structured fields.
   *
   * Looks for common Marathi labels:
   * - मालकाचे नाव / खातेदाराचे नाव → Owner name
   * - सर्व्हे नंबर / गट नंबर → Survey/Gat number
   * - क्षेत्र / एकूण क्षेत्र → Area
   * - भार / बोजा → Encumbrances
   *
   * @param {string} rawText - Raw OCR text
   * @returns {{ ownerName, surveyNumber, area, areaUnit, encumbrances }}
   */
  parseMarathiLandRecord(rawText) {
    const fields = {
      ownerName: null,
      surveyNumber: null,
      area: null,
      areaUnit: null,
      encumbrances: null
    };

    if (!rawText || !rawText.trim()) return fields;

    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const nextLine = lines[i + 1] || '';

      // Owner name patterns (Marathi)
      if (/मालकाचे\s*नाव|खातेदाराचे\s*नाव|owner\s*name|malik/i.test(line)) {
        // Owner name is usually on the same line after a colon/dash, or on the next line
        const colonSplit = line.split(/[:：\-–—]/).pop().trim();
        fields.ownerName = colonSplit.length > 2 ? colonSplit : nextLine;
      }

      // Survey / Gat number patterns
      if (/सर्व्हे\s*नं|गट\s*नं|survey\s*no|gat\s*no/i.test(line)) {
        const numMatch = line.match(/\d+[\/\\]?\s*[A-Za-z]?\d*/);
        if (numMatch) {
          fields.surveyNumber = numMatch[0].trim();
        } else {
          const nextMatch = nextLine.match(/\d+[\/\\]?\s*[A-Za-z]?\d*/);
          if (nextMatch) fields.surveyNumber = nextMatch[0].trim();
        }
      }

      // Area patterns
      if (/क्षेत्र|एकूण\s*क्षेत्र|area|kshetra/i.test(line)) {
        const areaMatch = line.match(/(\d+\.?\d*)\s*(हे\.?|आर\.?|चौ\.?मी\.?|sq\.?\s*m|hectare|acre|guntha)?/i);
        if (areaMatch) {
          fields.area = parseFloat(areaMatch[1]);
          const unitRaw = (areaMatch[2] || '').toLowerCase();
          if (/हे|hectare/i.test(unitRaw)) fields.areaUnit = 'hectare';
          else if (/आर|acre/i.test(unitRaw)) fields.areaUnit = 'acre';
          else if (/चौ|sq/i.test(unitRaw)) fields.areaUnit = 'sqm';
          else if (/guntha/i.test(unitRaw)) fields.areaUnit = 'guntha';
          else fields.areaUnit = 'sqm';
        }
      }

      // Encumbrance patterns
      if (/भार|बोजा|encumbrance|loan|lien/i.test(line)) {
        const colonSplit = line.split(/[:：\-–—]/).pop().trim();
        fields.encumbrances = colonSplit.length > 2 ? colonSplit : nextLine;
      }
    }

    return fields;
  }
}

module.exports = new OCRService();
