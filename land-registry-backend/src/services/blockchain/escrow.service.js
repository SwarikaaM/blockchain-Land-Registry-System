const { getContract, getSigner } = require('./contract.service');
const logger = require('../../utils/logger');
const path = require('path');

const ABI_PATH = path.join(__dirname, '../../../contracts/abis/Escrow.json');
const CONTRACT_ADDRESS = process.env.ESCROW_CONTRACT_ADDRESS || '';

/**
 * Lock funds into the escrow contract.
 */
exports.lockFunds = async ({ transferId, amount, buyerKey }) => {
  if (!CONTRACT_ADDRESS) {
    logger.warn('Escrow contract not deployed');
    return { txHash: 'not-deployed' };
  }

  const signer = getSigner(buyerKey);
  const contract = getContract(ABI_PATH, CONTRACT_ADDRESS, signer);
  if (!contract) return { txHash: 'abi-empty' };

  try {
    const tx = await contract.lockFunds(transferId, { value: amount });
    const receipt = await tx.wait();
    logger.info('Funds locked in escrow', { txHash: tx.hash, amount });
    return { txHash: tx.hash, receipt };
  } catch (err) {
    logger.error('lockFunds failed', { error: err.message });
    throw err;
  }
};

/**
 * Release escrowed funds to the seller.
 */
exports.releaseFunds = async ({ transferId }) => {
  if (!CONTRACT_ADDRESS) return { txHash: 'not-deployed' };

  const signer = getSigner(process.env.DEPLOYER_PRIVATE_KEY);
  const contract = getContract(ABI_PATH, CONTRACT_ADDRESS, signer);
  if (!contract) return { txHash: 'abi-empty' };

  try {
    const tx = await contract.releaseFunds(transferId);
    const receipt = await tx.wait();
    logger.info('Escrow released', { txHash: tx.hash });
    return { txHash: tx.hash, receipt };
  } catch (err) {
    logger.error('releaseFunds failed', { error: err.message });
    throw err;
  }
};

/**
 * Refund escrowed funds to the buyer.
 */
exports.refundFunds = async ({ transferId }) => {
  if (!CONTRACT_ADDRESS) return { txHash: 'not-deployed' };

  const signer = getSigner(process.env.DEPLOYER_PRIVATE_KEY);
  const contract = getContract(ABI_PATH, CONTRACT_ADDRESS, signer);
  if (!contract) return { txHash: 'abi-empty' };

  try {
    const tx = await contract.refundFunds(transferId);
    const receipt = await tx.wait();
    logger.info('Escrow refunded', { txHash: tx.hash });
    return { txHash: tx.hash, receipt };
  } catch (err) {
    logger.error('refundFunds failed', { error: err.message });
    throw err;
  }
};
