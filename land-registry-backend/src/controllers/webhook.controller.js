const asyncHandler = require('../utils/asyncHandler');
const logger = require('../utils/logger');

/**
 * POST /webhook/pinata
 * Handle Pinata webhook calls when files are pinned/unpinned.
 */
exports.pinataWebhook = asyncHandler(async (req, res) => {
  const { event, data } = req.body;

  logger.info('Pinata webhook received', { event, cid: data?.cid });

  switch (event) {
    case 'pin_added':
      // File was successfully pinned
      logger.info('File pinned to IPFS', { cid: data.cid, size: data.size });
      break;
    case 'pin_removed':
      logger.warn('File unpinned from IPFS', { cid: data.cid });
      break;
    default:
      logger.warn('Unknown Pinata webhook event', { event });
  }

  res.json({ success: true, received: true });
});

/**
 * POST /webhook/blockchain
 * Handle blockchain event notifications (from external relay services).
 */
exports.blockchainWebhook = asyncHandler(async (req, res) => {
  const { eventName, txHash, data } = req.body;

  logger.info('Blockchain webhook received', { eventName, txHash });

  // In production, verify webhook signature/secret before processing
  const webhookSecret = req.headers['x-webhook-secret'];
  if (process.env.WEBHOOK_SECRET && webhookSecret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ success: false, error: 'Invalid webhook secret' });
  }

  switch (eventName) {
    case 'LandRegistered':
      logger.info('Land registered on-chain', { tokenId: data?.tokenId, txHash });
      break;
    case 'TransferCompleted':
      logger.info('Transfer completed on-chain', { transferId: data?.transferId, txHash });
      break;
    case 'EscrowLocked':
      logger.info('Escrow locked on-chain', { amount: data?.amount, txHash });
      break;
    case 'EscrowReleased':
      logger.info('Escrow released on-chain', { txHash });
      break;
    default:
      logger.warn('Unknown blockchain event', { eventName });
  }

  res.json({ success: true, received: true });
});
