const asyncHandler = require('../utils/asyncHandler');
const CoOwner = require('../models/CoOwner.model');
const Land = require('../models/Land.model');
const User = require('../models/User.model');
const ipfsPinService = require('../services/ipfs/pin.service');
const logger = require('../utils/logger');

/**
 * POST /land/:id/coowners
 * Add a co-owner to a land asset.
 * Supports both online (wallet-connected) and offline co-owners.
 */
exports.addCoOwner = asyncHandler(async (req, res) => {
  const land = await Land.findById(req.params.id);

  if (!land) {
    return res.status(404).json({ success: false, error: 'Land not found' });
  }

  if (land.owner.toString() !== req.userId.toString()) {
    return res.status(403).json({ success: false, error: 'Only the owner can add co-owners' });
  }

  const { fullName, walletAddress, sharePercent, isOnline } = req.body;

  if (!fullName || sharePercent === undefined) {
    return res.status(400).json({ success: false, error: 'fullName and sharePercent required' });
  }

  // If online (has wallet), try to find existing user
  let userId = null;
  if (walletAddress && isOnline !== false) {
    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (user) userId = user._id;
  }

  const coOwner = await CoOwner.create({
    land: land._id,
    user: userId,
    fullName,
    walletAddress: walletAddress ? walletAddress.toLowerCase() : null,
    sharePercent,
    isOnline: isOnline !== false && !!walletAddress,
    nocStatus: 'pending'
  });

  // Add co-owner ref to land
  land.coOwners.push(coOwner._id);
  await land.save();

  logger.info('Co-owner added', {
    landId: land._id,
    coOwnerId: coOwner._id,
    isOnline: coOwner.isOnline
  });

  res.status(201).json({ success: true, coOwner });
});

/**
 * GET /land/:id/coowners
 * List all co-owners for a land asset with NOC status.
 */
exports.listCoOwners = asyncHandler(async (req, res) => {
  const coOwners = await CoOwner.find({ land: req.params.id })
    .populate('user', 'walletAddress profile.fullName');

  res.json({ success: true, coOwners });
});

/**
 * POST /land/:id/coowners/:coOwnerId/noc
 * Upload an offline NOC PDF for an offline co-owner.
 * Pins the PDF to IPFS and updates the co-owner record.
 */
exports.uploadNoc = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'NOC PDF file required' });
  }

  const coOwner = await CoOwner.findById(req.params.coOwnerId);

  if (!coOwner || coOwner.land.toString() !== req.params.id) {
    return res.status(404).json({ success: false, error: 'Co-owner not found for this land' });
  }

  // Pin NOC to IPFS
  const nocCID = await ipfsPinService.pinBuffer(req.file.buffer);

  coOwner.nocDocumentCID = nocCID;
  coOwner.nocStatus = 'offline_uploaded';
  await coOwner.save();

  // Also store in land's noc documents array
  const land = await Land.findById(req.params.id);
  if (land) {
    land.documents.nocDocuments.push({
      coOwnerId: coOwner._id,
      cid: nocCID
    });
    await land.save();
  }

  logger.info('Offline NOC uploaded', {
    coOwnerId: coOwner._id,
    nocCID
  });

  res.json({
    success: true,
    coOwner,
    nocCID,
    gateway: `https://gateway.pinata.cloud/ipfs/${nocCID}`
  });
});

/**
 * PUT /land/:id/coowners/:coOwnerId/sign
 * Online co-owner signs NOC with their wallet.
 */
exports.signNoc = asyncHandler(async (req, res) => {
  const { signature } = req.body;

  if (!signature) {
    return res.status(400).json({ success: false, error: 'Wallet signature required' });
  }

  const coOwner = await CoOwner.findById(req.params.coOwnerId);

  if (!coOwner || coOwner.land.toString() !== req.params.id) {
    return res.status(404).json({ success: false, error: 'Co-owner not found' });
  }

  // Verify the signer is the co-owner
  if (!coOwner.walletAddress || coOwner.walletAddress !== req.user.walletAddress) {
    return res.status(403).json({ success: false, error: 'Only the co-owner can sign their NOC' });
  }

  coOwner.nocSignature = signature;
  coOwner.nocStatus = 'signed';
  coOwner.signedAt = new Date();
  await coOwner.save();

  logger.info('Co-owner NOC signed', {
    coOwnerId: coOwner._id,
    walletAddress: coOwner.walletAddress
  });

  res.json({ success: true, coOwner });
});
