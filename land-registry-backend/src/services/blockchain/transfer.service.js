const { getContract, getSigner } = require('./contract.service');
const logger = require('../../utils/logger');
const path = require('path');

const ABI_PATH = path.join(__dirname, '../../../contracts/abis/TransferManager.json');
const CONTRACT_ADDRESS = process.env.TRANSFER_MANAGER_ADDRESS || '';

/**
 * Initiate a land transfer on-chain.
 */
exports.initiateTransfer = async ({ tokenId, seller, buyer, price }) => {
  if (!CONTRACT_ADDRESS) {
    logger.warn('TransferManager not deployed — skipping');
    return { txHash: 'not-deployed' };
  }

  const signer = getSigner(process.env.DEPLOYER_PRIVATE_KEY);
  const contract = getContract(ABI_PATH, CONTRACT_ADDRESS, signer);
  if (!contract) return { txHash: 'abi-empty' };

  try {
    const tx = await contract.initiateTransfer(tokenId, seller, buyer, price);
    const receipt = await tx.wait();
    logger.info('Transfer initiated on-chain', { txHash: tx.hash });
    return { txHash: tx.hash, receipt };
  } catch (err) {
    logger.error('initiateTransfer failed', { error: err.message });
    throw err;
  }
};

/**
 * Approve a transfer (called by each co-owner or officer).
 */
exports.approveTransfer = async ({ transferId, signer: signerKey }) => {
  if (!CONTRACT_ADDRESS) return { txHash: 'not-deployed' };

  const signer = getSigner(signerKey);
  const contract = getContract(ABI_PATH, CONTRACT_ADDRESS, signer);
  if (!contract) return { txHash: 'abi-empty' };

  try {
    const tx = await contract.approveTransfer(transferId);
    const receipt = await tx.wait();
    return { txHash: tx.hash, receipt };
  } catch (err) {
    logger.error('approveTransfer failed', { error: err.message });
    throw err;
  }
};

/**
 * Complete a transfer after all approvals.
 */
exports.completeTransfer = async ({ transferId }) => {
  if (!CONTRACT_ADDRESS) return { txHash: 'not-deployed' };

  const signer = getSigner(process.env.DEPLOYER_PRIVATE_KEY);
  const contract = getContract(ABI_PATH, CONTRACT_ADDRESS, signer);
  if (!contract) return { txHash: 'abi-empty' };

  try {
    const tx = await contract.completeTransfer(transferId);
    const receipt = await tx.wait();
    logger.info('Transfer completed on-chain', { txHash: tx.hash });
    return { txHash: tx.hash, receipt };
  } catch (err) {
    logger.error('completeTransfer failed', { error: err.message });
    throw err;
  }
};
