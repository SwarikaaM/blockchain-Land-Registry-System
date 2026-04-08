// src/controllers/verification.controller.js
const cheerio = require('cheerio'); // ← Added this

const scraper = require('../services/mahabhulekh/scraper.service');
const parser = require('../services/mahabhulekh/parser.service');
const verifier = require('../services/mahabhulekh/verifier.service');
const mapper = require('../services/mahabhulekh/fieldMapper.service');
const ipfsService = require('../services/ipfs/pin.service');

exports.verifyLand = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const mapped = mapper.mapToMahabhulekh(req.body);
    console.log("MAPPED:", mapped);

    const scrapeResult = await scraper.scrapeLandRecord(mapped);

    // Safety: Ensure html is always a string
    if (!scrapeResult.html || typeof scrapeResult.html !== 'string') {
      scrapeResult.html = '';
    }

    // Handle Invalid Captcha Case
    if (scrapeResult.retry) {
      return res.status(400).json({
        success: false,
        message: "Invalid Captcha. Please try again.",
        retry: true
      });
    }

    // Handle General Failure
    if (!scrapeResult.verified) {
      return res.json({
        success: false,
        legacyFlag: true,
        reason: scrapeResult.reason || "Land record verification failed"
      });
    }

    // Now safe to parse HTML
    const $ = cheerio.load(scrapeResult.html);

    const { surveyLabel } = scrapeResult;

    // Parse scraped data
    const parsed = parser.parseHTML(scrapeResult.html);

    // Verify data matches input
    const verification = verifier.verify({
      input: req.body,
      scraped: parsed
    });

    // Upload to IPFS
    const htmlCID = await ipfsService.pinBuffer(Buffer.from(scrapeResult.html));
    
    // Handle pdfBuffer safely (in case it's not generated yet)
    const pdfBuffer = scrapeResult.pdfBuffer || Buffer.from('');
    const pdfCID = await ipfsService.pinBuffer(pdfBuffer);

    return res.json({
      success: true,
      surveyLabel,
      parsed,
      verification,
      cids: { htmlCID, pdfCID }
    });

  } catch (err) {
    console.error("ERROR in verifyLand:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};