// src/controllers/verification.controller.js
const cheerio = require('cheerio');

const scraper = require('../services/mahabhulekh/scraper.service');
const parser = require('../services/mahabhulekh/parser.service');
const verifier = require('../services/mahabhulekh/verifier.service');
const mapper = require('../services/mahabhulekh/fieldMapper.service');
const ipfsService = require('../services/ipfs/pin.service');
const ocrService = require('../services/ipfs/ocr.service');
const compareService = require('../services/ipfs/compare.service');
const VerificationResult = require('../models/VerificationResult.model');
const Land = require('../models/Land.model');
const OfficerCase = require('../models/OfficerCase.model');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../utils/logger');

/**
 * POST /verification/mahabhulekh
 * Original Mahabhulekh scraper verification flow.
 * Scrapes → parses → verifies → pins HTML+PDF to IPFS.
 */
exports.verifyLand = asyncHandler(async (req, res) => {
  logger.info('Mahabhulekh verification started', { body: req.body });

  const mapped = mapper.mapToMahabhulekh(req.body);
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
    // If landId provided, update land status and create officer case
    if (req.body.landId) {
      await Land.findByIdAndUpdate(req.body.landId, {
        $set: { status: 'verification_failed', legacyFlag: true }
      });
      await OfficerCase.create({
        land: req.body.landId,
        type: 'verification_review',
        status: 'queued'
      });
    }

    return res.json({
      success: false,
      legacyFlag: true,
      reason: scrapeResult.reason || "Land record verification failed"
    });
  }

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
  const pdfBuffer = scrapeResult.pdfBuffer || Buffer.from('');
  const pdfCID = await ipfsService.pinBuffer(pdfBuffer);

  // Save VerificationResult
  let verResult = null;
  if (req.body.landId) {
    verResult = await VerificationResult.create({
      land: req.body.landId,
      source: 'mahabhulekh',
      userInput: {
        ownerName: req.body.ownerName,
        surveyNumber: req.body.fullSurveyInput,
        area: parseFloat(req.body.area) || null,
        district: req.body.district,
        taluka: req.body.taluka,
        village: req.body.village,
      },
      scrapedData: parsed,
      comparison: {
        nameMatch: { score: verification.score, passed: verification.nameMatch },
        areaMatch: { score: verification.areaMatch ? 1 : 0, passed: verification.areaMatch },
        encumbranceFlag: verification.encumbranceFlag,
        overallScore: verification.score,
        verdict: verification.score >= 0.8 ? 'auto_pass' : 'officer_review'
      },
      cids: { htmlCID, pdfCID }
    });

    // Update land status
    const verdict = verification.score >= 0.8 ? 'verification_passed' : 'officer_review';
    await Land.findByIdAndUpdate(req.body.landId, {
      $set: {
        verificationResult: verResult._id,
        status: verdict,
        'documents.mahabhulekhSnapshotCID': htmlCID,
        legacyFlag: verdict !== 'verification_passed'
      }
    });

    if (verdict === 'officer_review') {
      await OfficerCase.create({
        land: req.body.landId,
        type: 'verification_review',
        status: 'queued'
      });
    }
  }

  return res.json({
    success: true,
    surveyLabel,
    parsed,
    verification,
    cids: { htmlCID, pdfCID },
    verificationId: verResult?._id
  });
});

/**
 * POST /verification/document-compare
 * Alternative verification: upload image → OCR → compare.
 * Delegates to ipfs.controller.extractAndCompare internally.
 */
exports.documentCompare = asyncHandler(async (req, res) => {
  // This endpoint is a thin wrapper — the real logic is in ipfs.controller.extractAndCompare
  // Kept for API completeness
  const ipfsController = require('./ipfs.controller');
  return ipfsController.extractAndCompare(req, res);
});

/**
 * GET /verification/:landId/result
 * Get full verification result for a land.
 */
exports.getResult = asyncHandler(async (req, res) => {
  const result = await VerificationResult.findOne({ land: req.params.landId })
    .sort({ createdAt: -1 });

  if (!result) {
    return res.status(404).json({ success: false, error: 'No verification result found' });
  }

  res.json({ success: true, result });
});

/**
 * POST /verification/:landId/retry
 * Retry failed verification.
 */
exports.retry = asyncHandler(async (req, res) => {
  const land = await Land.findById(req.params.landId);
  if (!land) return res.status(404).json({ success: false, error: 'Land not found' });

  // Reset status to allow re-verification
  land.status = 'verification_pending';
  land.legacyFlag = false;
  await land.save();

  res.json({ success: true, message: 'Ready for re-verification', land });
});