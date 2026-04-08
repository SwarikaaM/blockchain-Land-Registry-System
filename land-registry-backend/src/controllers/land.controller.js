const asyncHandler = require('../utils/asyncHandler');
const Land = require('../models/Land.model');
const CoOwner = require('../models/CoOwner.model');
const AuditLog = require('../models/AuditLog.model');
const paginate = require('../utils/paginateQuery');
const logger = require('../utils/logger');

/**
 * POST /land/register
 * Create a new land asset in draft status.
 * Seller-only.
 */
exports.register = asyncHandler(async (req, res) => {
  const {
    district, districtValue,
    taluka, talukaValue,
    village, villageValue,
    surveyNumber, gatNumber,
    area, areaUnit,
    encumbrances, boundaryDescription
  } = req.body;

  const land = await Land.create({
    owner: req.userId,
    location: {
      district, districtValue,
      taluka, talukaValue,
      village, villageValue,
      surveyNumber, gatNumber
    },
    area: {
      value: parseFloat(area),
      unit: areaUnit || 'sqm'
    },
    encumbrances: encumbrances || '',
    boundaryDescription: boundaryDescription || '',
    status: 'draft'
  });

  // Audit log
  await AuditLog.create({
    actor: req.userId,
    action: 'land.register',
    target: `Land:${land._id}`,
    details: { surveyNumber, district, village },
    ipAddress: req.ip
  });

  logger.info('Land registered', { landId: land._id, survey: surveyNumber });

  res.status(201).json({
    success: true,
    land
  });
});

/**
 * GET /land
 * List current user's lands with pagination.
 */
exports.list = asyncHandler(async (req, res) => {
  const query = Land.find({ owner: req.userId });
  const result = await paginate(query, req.query);

  res.json({ success: true, ...result });
});

/**
 * GET /land/search
 * Search lands for buyers (only registered/listed lands).
 */
exports.search = asyncHandler(async (req, res) => {
  const filter = { status: { $in: ['registered', 'listed'] } };

  if (req.query.district) filter['location.district'] = new RegExp(req.query.district, 'i');
  if (req.query.taluka) filter['location.taluka'] = new RegExp(req.query.taluka, 'i');
  if (req.query.village) filter['location.village'] = new RegExp(req.query.village, 'i');
  if (req.query.surveyNumber) filter['location.surveyNumber'] = req.query.surveyNumber;

  const query = Land.find(filter)
    .populate('owner', 'walletAddress profile.fullName')
    .populate('verificationResult', 'comparison.verdict comparison.overallScore');

  const result = await paginate(query, req.query);

  res.json({ success: true, ...result });
});

/**
 * GET /land/:id
 * Get land details with populated references.
 */
exports.getById = asyncHandler(async (req, res) => {
  const land = await Land.findById(req.params.id)
    .populate('owner', 'walletAddress profile.fullName')
    .populate('coOwners')
    .populate('verificationResult');

  if (!land) {
    return res.status(404).json({ success: false, error: 'Land not found' });
  }

  res.json({ success: true, land });
});

/**
 * PUT /land/:id
 * Update a land draft (only if status is 'draft').
 */
exports.update = asyncHandler(async (req, res) => {
  const land = await Land.findById(req.params.id);

  if (!land) {
    return res.status(404).json({ success: false, error: 'Land not found' });
  }

  if (land.owner.toString() !== req.userId.toString()) {
    return res.status(403).json({ success: false, error: 'Not the owner of this land' });
  }

  if (land.status !== 'draft') {
    return res.status(400).json({ success: false, error: 'Can only edit lands in draft status' });
  }

  const allowedFields = [
    'location', 'area', 'encumbrances', 'boundaryDescription'
  ];

  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      land[field] = req.body[field];
    }
  });

  land.updatedAt = new Date();
  await land.save();

  res.json({ success: true, land });
});

/**
 * POST /land/:id/upload-documents
 * Upload 7/12 document and trigger verification.
 * Updates land status to 'documents_uploaded'.
 */
exports.uploadDocuments = asyncHandler(async (req, res) => {
  const land = await Land.findById(req.params.id);

  if (!land) {
    return res.status(404).json({ success: false, error: 'Land not found' });
  }

  if (land.owner.toString() !== req.userId.toString()) {
    return res.status(403).json({ success: false, error: 'Not the owner' });
  }

  // CIDs come from a prior /ipfs/upload or /ipfs/extract-and-compare call
  const { sevenTwelveCID, mahabhulekhSnapshotCID, mahabhunakshaSnapshotCID } = req.body;

  if (sevenTwelveCID) land.documents.sevenTwelveCID = sevenTwelveCID;
  if (mahabhulekhSnapshotCID) land.documents.mahabhulekhSnapshotCID = mahabhulekhSnapshotCID;
  if (mahabhunakshaSnapshotCID) land.documents.mahabhunakshaSnapshotCID = mahabhunakshaSnapshotCID;

  if (land.status === 'draft') {
    land.status = 'documents_uploaded';
  }

  await land.save();

  logger.info('Documents uploaded', { landId: land._id });

  res.json({ success: true, land });
});

/**
 * PUT /land/:id/status
 * Update land status (admin/officer or system use).
 */
exports.updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const land = await Land.findByIdAndUpdate(
    req.params.id,
    { $set: { status, updatedAt: new Date() } },
    { new: true }
  );

  if (!land) {
    return res.status(404).json({ success: false, error: 'Land not found' });
  }

  res.json({ success: true, land });
});
