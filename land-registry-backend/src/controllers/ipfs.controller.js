const asyncHandler = require('../utils/asyncHandler');
const ipfsPinService = require('../services/ipfs/pin.service');
const ocrService = require('../services/ipfs/ocr.service');
const compareService = require('../services/ipfs/compare.service');
const VerificationResult = require('../models/VerificationResult.model');
const Land = require('../models/Land.model');
const OfficerCase = require('../models/OfficerCase.model');
const logger = require('../utils/logger');
const axios = require('axios');

/**
 * POST /ipfs/upload
 * Upload a file (image/PDF) to IPFS via Pinata.
 */
exports.upload = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }

  const cid = await ipfsPinService.pinBuffer(req.file.buffer);

  logger.info('File uploaded to IPFS', { cid, size: req.file.size, mime: req.file.mimetype });

  res.json({
    success: true,
    cid,
    gateway: `https://gateway.pinata.cloud/ipfs/${cid}`,
    size: req.file.size,
    mimetype: req.file.mimetype
  });
});

/**
 * GET /ipfs/:cid
 * Fetch a file from IPFS gateway.
 */
exports.fetch = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;

  try {
    const response = await axios.get(gatewayUrl, { responseType: 'arraybuffer', timeout: 30000 });
    const contentType = response.headers['content-type'] || 'application/octet-stream';

    res.set('Content-Type', contentType);
    res.send(response.data);
  } catch (err) {
    logger.error('IPFS fetch failed', { cid, error: err.message });
    res.status(404).json({ success: false, error: 'File not found on IPFS' });
  }
});

/**
 * POST /ipfs/extract-and-compare
 * Core endpoint: Upload image → IPFS → OCR → Compare with user input.
 *
 * Body (multipart): file (image), userInput (JSON string)
 * userInput: { ownerName, surveyNumber, area, areaUnit, landId }
 */
exports.extractAndCompare = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'Image file required' });
  }

  let userInput;
  try {
    userInput = typeof req.body.userInput === 'string'
      ? JSON.parse(req.body.userInput)
      : req.body.userInput;
  } catch (e) {
    return res.status(400).json({ success: false, error: 'Invalid userInput JSON' });
  }

  if (!userInput || !userInput.ownerName) {
    return res.status(400).json({ success: false, error: 'userInput with ownerName required' });
  }

  logger.info('Extract-and-compare started', { landId: userInput.landId });

  // Step 1: Pin image to IPFS
  const imageCID = await ipfsPinService.pinBuffer(req.file.buffer);
  logger.info('Image pinned to IPFS', { imageCID });

  // Step 2: OCR — extract text from image
  const { rawText, confidence } = await ocrService.extractText(req.file.buffer);

  // Step 3: Parse extracted text for structured fields
  const ocrExtracted = ocrService.parseMarathiLandRecord(rawText);
  ocrExtracted.rawText = rawText;

  // Step 4: Pin OCR result to IPFS for audit trail
  const ocrResultCID = await ipfsPinService.pinBuffer(
    Buffer.from(JSON.stringify({ ocrExtracted, confidence, timestamp: new Date() }))
  );

  // Step 5: Compare user input vs OCR output
  const comparison = compareService.compare(userInput, ocrExtracted);

  // Step 6: Save VerificationResult
  const verificationData = {
    source: 'manual_upload',
    userInput: {
      ownerName: userInput.ownerName,
      surveyNumber: userInput.surveyNumber,
      area: parseFloat(userInput.area) || null,
      areaUnit: userInput.areaUnit || 'sqm',
      district: userInput.district,
      taluka: userInput.taluka,
      village: userInput.village,
    },
    ocrExtracted: {
      ownerName: ocrExtracted.ownerName,
      surveyNumber: ocrExtracted.surveyNumber,
      area: ocrExtracted.area,
      areaUnit: ocrExtracted.areaUnit,
      rawText: rawText.substring(0, 5000),  // cap at 5K chars
    },
    comparison,
    cids: {
      imageCID,
      ocrResultCID,
    }
  };

  // If landId provided, link to land and update status
  if (userInput.landId) {
    verificationData.land = userInput.landId;

    const verResult = await VerificationResult.create(verificationData);

    // Update land status based on verdict
    const statusMap = {
      'auto_pass': 'verification_passed',
      'auto_fail': 'verification_failed',
      'officer_review': 'officer_review'
    };

    const updateData = {
      verificationResult: verResult._id,
      status: statusMap[comparison.verdict] || 'officer_review',
      'documents.sevenTwelveCID': imageCID,
    };

    if (comparison.verdict === 'auto_fail' || comparison.verdict === 'officer_review') {
      updateData.legacyFlag = true;
    }

    await Land.findByIdAndUpdate(userInput.landId, { $set: updateData });

    // If officer review needed, create a case
    if (comparison.verdict === 'officer_review' || comparison.verdict === 'auto_fail') {
      await OfficerCase.create({
        land: userInput.landId,
        type: 'verification_review',
        status: 'queued'
      });
      logger.info('Officer case queued', { landId: userInput.landId });
    }

    res.json({
      success: true,
      verificationId: verResult._id,
      imageCID,
      ocrResultCID,
      ocrExtracted: {
        ownerName: ocrExtracted.ownerName,
        surveyNumber: ocrExtracted.surveyNumber,
        area: ocrExtracted.area,
        areaUnit: ocrExtracted.areaUnit,
      },
      comparison,
      confidence,
      landStatus: statusMap[comparison.verdict]
    });
  } else {
    // Standalone comparison (no land linked)
    res.json({
      success: true,
      imageCID,
      ocrResultCID,
      ocrExtracted: {
        ownerName: ocrExtracted.ownerName,
        surveyNumber: ocrExtracted.surveyNumber,
        area: ocrExtracted.area,
        areaUnit: ocrExtracted.areaUnit,
      },
      comparison,
      confidence
    });
  }
});
