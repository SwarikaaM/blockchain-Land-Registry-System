const asyncHandler = require('../utils/asyncHandler');
const OfficerCase = require('../models/OfficerCase.model');
const OfficerSignature = require('../models/OfficerSignature.model');
const Land = require('../models/Land.model');
const TransferRequest = require('../models/TransferRequest.model');
const Notification = require('../models/Notification.model');
const paginate = require('../utils/paginateQuery');
const logger = require('../utils/logger');

/**
 * GET /officer/cases
 * List officer cases with optional status filter.
 */
exports.listCases = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.type) filter.type = req.query.type;

  // If officer has a tehsil, only show cases in their jurisdiction
  // For now, show all queued/assigned cases
  if (req.user.role === 'officer' && req.user.officerMeta?.tehsil) {
    // Could filter by land's taluka matching officer's tehsil
  }

  const query = OfficerCase.find(filter)
    .populate({
      path: 'land',
      select: 'location area status owner documents',
      populate: { path: 'owner', select: 'walletAddress profile.fullName' }
    })
    .populate('transferRequest', 'buyer seller price status')
    .populate('assignedOfficer', 'walletAddress profile.fullName')
    .populate('signatures');

  const result = await paginate(query, req.query);
  res.json({ success: true, ...result });
});

/**
 * GET /officer/cases/:id
 * Get full case details.
 */
exports.getCaseById = asyncHandler(async (req, res) => {
  const caseDoc = await OfficerCase.findById(req.params.id)
    .populate({
      path: 'land',
      populate: [
        { path: 'owner', select: 'walletAddress profile.fullName' },
        { path: 'coOwners' },
        { path: 'verificationResult' }
      ]
    })
    .populate({
      path: 'transferRequest',
      populate: [
        { path: 'buyer', select: 'walletAddress profile.fullName' },
        { path: 'seller', select: 'walletAddress profile.fullName' }
      ]
    })
    .populate({
      path: 'signatures',
      populate: { path: 'officer', select: 'walletAddress profile.fullName' }
    });

  if (!caseDoc) {
    return res.status(404).json({ success: false, error: 'Case not found' });
  }

  res.json({ success: true, case: caseDoc });
});

/**
 * POST /officer/cases/:id/approve
 * Officer approves a case with justification.
 */
exports.approveCase = asyncHandler(async (req, res) => {
  const { justification, signatureHash } = req.body;

  const caseDoc = await OfficerCase.findById(req.params.id);
  if (!caseDoc) {
    return res.status(404).json({ success: false, error: 'Case not found' });
  }

  // Create officer signature
  const sig = await OfficerSignature.create({
    officerCase: caseDoc._id,
    officer: req.userId,
    decision: 'approve',
    justification: justification || '',
    signatureHash: signatureHash || '',
  });

  caseDoc.signatures.push(sig._id);
  caseDoc.status = 'approved';
  caseDoc.findings = justification || '';
  caseDoc.assignedOfficer = req.userId;
  caseDoc.resolvedAt = new Date();
  await caseDoc.save();

  // Update related land status
  if (caseDoc.type === 'verification_review') {
    await Land.findByIdAndUpdate(caseDoc.land, {
      $set: { status: 'verification_passed', legacyFlag: false }
    });
  }

  // If transfer review, update transfer
  if (caseDoc.type === 'transfer_review' && caseDoc.transferRequest) {
    await TransferRequest.findByIdAndUpdate(caseDoc.transferRequest, {
      $set: { status: 'approved' }
    });
  }

  // Notify the land owner
  const land = await Land.findById(caseDoc.land);
  if (land) {
    await Notification.create({
      user: land.owner,
      type: 'verification_complete',
      title: 'Case Approved',
      message: `Your ${caseDoc.type.replace('_', ' ')} has been approved by an officer.`,
      metadata: { caseId: caseDoc._id, landId: land._id }
    });
  }

  logger.info('Case approved', { caseId: caseDoc._id, officer: req.userId });

  res.json({ success: true, case: caseDoc });
});

/**
 * POST /officer/cases/:id/reject
 */
exports.rejectCase = asyncHandler(async (req, res) => {
  const { justification, signatureHash } = req.body;

  const caseDoc = await OfficerCase.findById(req.params.id);
  if (!caseDoc) {
    return res.status(404).json({ success: false, error: 'Case not found' });
  }

  const sig = await OfficerSignature.create({
    officerCase: caseDoc._id,
    officer: req.userId,
    decision: 'reject',
    justification: justification || '',
    signatureHash: signatureHash || '',
  });

  caseDoc.signatures.push(sig._id);
  caseDoc.status = 'rejected';
  caseDoc.findings = justification || '';
  caseDoc.assignedOfficer = req.userId;
  caseDoc.resolvedAt = new Date();
  await caseDoc.save();

  // Update related records
  if (caseDoc.type === 'verification_review') {
    await Land.findByIdAndUpdate(caseDoc.land, { $set: { status: 'verification_failed' } });
  }
  if (caseDoc.type === 'transfer_review' && caseDoc.transferRequest) {
    await TransferRequest.findByIdAndUpdate(caseDoc.transferRequest, { $set: { status: 'rejected' } });
  }

  logger.info('Case rejected', { caseId: caseDoc._id, officer: req.userId });

  res.json({ success: true, case: caseDoc });
});
