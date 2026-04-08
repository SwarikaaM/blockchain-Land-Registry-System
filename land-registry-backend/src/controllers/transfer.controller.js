const asyncHandler = require('../utils/asyncHandler');
const TransferRequest = require('../models/TransferRequest.model');
const Land = require('../models/Land.model');
const CoOwner = require('../models/CoOwner.model');
const OfficerCase = require('../models/OfficerCase.model');
const Notification = require('../models/Notification.model');
const AuditLog = require('../models/AuditLog.model');
const paginate = require('../utils/paginateQuery');
const logger = require('../utils/logger');

/**
 * POST /transfer/offer
 * Buyer submits a transfer offer for a listed land.
 */
exports.createOffer = asyncHandler(async (req, res) => {
  const { landId, price, currency } = req.body;

  const land = await Land.findById(landId).populate('coOwners');
  if (!land) return res.status(404).json({ success: false, error: 'Land not found' });

  if (!['registered', 'listed'].includes(land.status)) {
    return res.status(400).json({ success: false, error: 'Land is not available for transfer' });
  }

  if (land.owner.toString() === req.userId.toString()) {
    return res.status(400).json({ success: false, error: 'Cannot buy your own land' });
  }

  // Build co-owner consent array
  const coOwnerConsents = land.coOwners.map(co => ({
    coOwner: co._id,
    status: 'pending'
  }));

  const transfer = await TransferRequest.create({
    land: land._id,
    seller: land.owner,
    buyer: req.userId,
    price: { amount: price, currency: currency || 'POL' },
    status: 'offer_sent',
    coOwnerConsents
  });

  // Update land status
  land.status = 'transfer_pending';
  await land.save();

  // Notify seller
  await Notification.create({
    user: land.owner,
    type: 'transfer_offer',
    title: 'New Transfer Offer',
    message: `A buyer has offered ${price} ${currency || 'POL'} for your land.`,
    metadata: { transferId: transfer._id, landId: land._id }
  });

  // Notify co-owners
  for (const co of land.coOwners) {
    if (co.user) {
      await Notification.create({
        user: co.user,
        type: 'noc_request',
        title: 'NOC Required',
        message: `A transfer request has been made for land you co-own. Your NOC is required.`,
        metadata: { transferId: transfer._id, landId: land._id, coOwnerId: co._id }
      });
    }
  }

  await AuditLog.create({
    actor: req.userId,
    action: 'transfer.offer',
    target: `TransferRequest:${transfer._id}`,
    details: { landId, price },
    ipAddress: req.ip
  });

  logger.info('Transfer offer created', { transferId: transfer._id });

  res.status(201).json({ success: true, transfer });
});

/**
 * POST /transfer/:id/accept
 * Seller accepts the transfer offer.
 */
exports.acceptOffer = asyncHandler(async (req, res) => {
  const transfer = await TransferRequest.findById(req.params.id);
  if (!transfer) return res.status(404).json({ success: false, error: 'Transfer not found' });

  if (transfer.seller.toString() !== req.userId.toString()) {
    return res.status(403).json({ success: false, error: 'Only the seller can accept' });
  }

  if (transfer.status !== 'offer_sent') {
    return res.status(400).json({ success: false, error: `Cannot accept from status: ${transfer.status}` });
  }

  transfer.status = transfer.coOwnerConsents.length > 0

    ? 'coowner_consent_pending'
    : 'approved';  // No co-owners = direct approval

  await transfer.save();

  // Notify buyer
  await Notification.create({
    user: transfer.buyer,
    type: 'transfer_offer',
    title: 'Offer Accepted',
    message: 'The seller has accepted your transfer offer.',
    metadata: { transferId: transfer._id }
  });

  res.json({ success: true, transfer });
});

/**
 * POST /transfer/:id/reject
 * Seller rejects the offer.
 */
exports.rejectOffer = asyncHandler(async (req, res) => {
  const transfer = await TransferRequest.findById(req.params.id);
  if (!transfer) return res.status(404).json({ success: false, error: 'Transfer not found' });

  if (transfer.seller.toString() !== req.userId.toString()) {
    return res.status(403).json({ success: false, error: 'Only the seller can reject' });
  }

  transfer.status = 'rejected';
  await transfer.save();

  // Restore land status
  await Land.findByIdAndUpdate(transfer.land, { $set: { status: 'listed' } });

  res.json({ success: true, transfer });
});

/**
 * GET /transfer/my
 * Get user's transfers (as buyer or seller).
 */
exports.getMyTransfers = asyncHandler(async (req, res) => {
  const filter = {
    $or: [
      { buyer: req.userId },
      { seller: req.userId }
    ]
  };

  if (req.query.status) filter.status = req.query.status;

  const query = TransferRequest.find(filter)
    .populate('land', 'location area status documents')
    .populate('buyer', 'walletAddress profile.fullName')
    .populate('seller', 'walletAddress profile.fullName');

  const result = await paginate(query, req.query);
  res.json({ success: true, ...result });
});

/**
 * POST /transfer/:id/coowner-consent
 * Co-owner signs consent for the transfer.
 */
exports.coownerConsent = asyncHandler(async (req, res) => {
  const { coOwnerId, approve, signature } = req.body;

  const transfer = await TransferRequest.findById(req.params.id);
  if (!transfer) return res.status(404).json({ success: false, error: 'Transfer not found' });

  // Find the consent entry
  const consent = transfer.coOwnerConsents.find(
    c => c.coOwner.toString() === coOwnerId
  );

  if (!consent) {
    return res.status(404).json({ success: false, error: 'Co-owner consent entry not found' });
  }

  // Check if this is the right co-owner
  const coOwner = await CoOwner.findById(coOwnerId);
  if (!coOwner) return res.status(404).json({ success: false, error: 'Co-owner not found' });

  if (coOwner.walletAddress && coOwner.walletAddress !== req.user.walletAddress) {
    return res.status(403).json({ success: false, error: 'Not authorized to sign this consent' });
  }

  // If rejecting, cancel the entire transfer
  if (!approve) {
    consent.status = 'rejected';
    transfer.status = 'cancelled';
    await transfer.save();

    await Land.findByIdAndUpdate(transfer.land, { $set: { status: 'listed' } });

    return res.json({
      success: true,
      message: 'Co-owner rejected. Transfer cancelled.',
      transfer
    });
  }

  consent.status = 'approved';
  consent.signedAt = new Date();

  // Check if offline co-owner → auto-flag for officer review
  if (!coOwner.isOnline || coOwner.nocStatus === 'offline_uploaded') {
    const officerCase = await OfficerCase.create({
      land: transfer.land,
      transferRequest: transfer._id,
      type: 'transfer_review',
      status: 'queued'
    });
    transfer.officerCase = officerCase._id;
    transfer.status = 'officer_review';
    await transfer.save();

    return res.json({
      success: true,
      message: 'Offline co-owner flagged for officer review.',
      transfer
    });
  }

  // Check if all consents are approved
  const allApproved = transfer.coOwnerConsents.every(c => c.status === 'approved');
  if (allApproved) {
    transfer.status = 'escrow_locked';  // Ready for buyer to lock full payment
  }

  await transfer.save();

  res.json({ success: true, transfer });
});

/**
 * POST /transfer/:id/finalize
 * Finalize the transfer after all approvals + escrow lock.
 */
exports.finalize = asyncHandler(async (req, res) => {
  const transfer = await TransferRequest.findById(req.params.id);
  if (!transfer) return res.status(404).json({ success: false, error: 'Transfer not found' });

  if (!['approved', 'escrow_locked'].includes(transfer.status)) {
    return res.status(400).json({ success: false, error: 'Transfer not ready for finalization' });
  }

  // In production, this would call the smart contract
  transfer.status = 'completed';
  transfer.transferTxHash = req.body.txHash || 'pending-chain-confirmation';
  await transfer.save();

  // Update land ownership
  await Land.findByIdAndUpdate(transfer.land, {
    $set: {
      owner: transfer.buyer,
      status: 'transferred',
      coOwners: []
    }
  });

  // Notify both parties
  for (const userId of [transfer.buyer, transfer.seller]) {
    await Notification.create({
      user: userId,
      type: 'transfer_complete',
      title: 'Transfer Complete',
      message: 'The land transfer has been successfully completed.',
      metadata: { transferId: transfer._id }
    });
  }

  logger.info('Transfer finalized', { transferId: transfer._id });

  res.json({ success: true, transfer });
});
