const asyncHandler = require('../utils/asyncHandler');
const logger = require('../utils/logger');

/**
 * Escrow controller — stub for smart contract integration.
 * These endpoints will call the Escrow.sol contract once deployed.
 */

/**
 * POST /escrow/lock
 * Lock funds into escrow (intent deposit or full payment).
 */
exports.lockFunds = asyncHandler(async (req, res) => {
  const { transferId, amount, txHash } = req.body;

  const TransferRequest = require('../models/TransferRequest.model');
  const transfer = await TransferRequest.findById(transferId);

  if (!transfer) {
    return res.status(404).json({ success: false, error: 'Transfer not found' });
  }

  // Update escrow data
  transfer.escrow = {
    ...transfer.escrow,
    txHash,
    lockedAmount: amount,
    status: amount < transfer.price.amount ? 'intent_deposit' : 'locked'
  };

  if (transfer.escrow.status === 'locked') {
    transfer.status = 'escrow_locked';
  }

  await transfer.save();

  logger.info('Escrow locked', { transferId, amount, status: transfer.escrow.status });

  res.json({ success: true, escrow: transfer.escrow, transfer });
});

/**
 * POST /escrow/:id/release
 * Release escrow funds to seller upon successful transfer.
 */
exports.releaseFunds = asyncHandler(async (req, res) => {
  const TransferRequest = require('../models/TransferRequest.model');
  const transfer = await TransferRequest.findById(req.params.id);

  if (!transfer) {
    return res.status(404).json({ success: false, error: 'Transfer not found' });
  }

  if (transfer.escrow.status !== 'locked') {
    return res.status(400).json({ success: false, error: 'Escrow not in locked state' });
  }

  transfer.escrow.status = 'released';
  await transfer.save();

  logger.info('Escrow released', { transferId: transfer._id });

  res.json({ success: true, escrow: transfer.escrow });
});

/**
 * POST /escrow/:id/refund
 * Refund escrow to buyer on cancellation.
 */
exports.refundFunds = asyncHandler(async (req, res) => {
  const TransferRequest = require('../models/TransferRequest.model');
  const transfer = await TransferRequest.findById(req.params.id);

  if (!transfer) {
    return res.status(404).json({ success: false, error: 'Transfer not found' });
  }

  transfer.escrow.status = 'refunded';
  transfer.status = 'cancelled';
  await transfer.save();

  logger.info('Escrow refunded', { transferId: transfer._id });

  res.json({ success: true, escrow: transfer.escrow });
});

/**
 * GET /escrow/:id/status
 */
exports.getStatus = asyncHandler(async (req, res) => {
  const TransferRequest = require('../models/TransferRequest.model');
  const transfer = await TransferRequest.findById(req.params.id)
    .select('escrow price status');

  if (!transfer) {
    return res.status(404).json({ success: false, error: 'Transfer not found' });
  }

  res.json({ success: true, escrow: transfer.escrow, transferStatus: transfer.status });
});
