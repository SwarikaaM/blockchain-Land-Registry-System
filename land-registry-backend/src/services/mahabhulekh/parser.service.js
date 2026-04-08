// src/services/mahabhulekh/parser.service.js

const cheerio = require('cheerio');

class ParserService {
  parseHTML(html) {
    const $ = cheerio.load(html);

    const owners = [];
    $('.owner-name').each((i, el) => {
      owners.push($(el).text().trim());
    });

    const area = $('#area').text().trim();
    const encumbrances = $('#encumbrance').text().trim();

    return {
      owners,
      area,
      encumbrances
    };
  }

  parsePDF(pdfBuffer) {
    // Placeholder for pdfplumber / pdf-parse
    return {
      extractedText: "PDF parsing not implemented yet"
    };
  }
}

module.exports = new ParserService();