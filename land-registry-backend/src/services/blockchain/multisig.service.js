const { getContract, getSigner } = require('./contract.service');
const logger = require('../../utils/logger');
const path = require('path');

const ABI_PATH = path.join(__dirname, '../../../contracts/abis/MultiSig.json');
const CONTRACT_ADDRESS = process.env.MULTISIG_ADDRESS || '';

/**
 * Submit an officer signature to the multi-sig contract.
 */
exports.submitSignature = async ({ caseId, decision, officerKey }) => {
  if (!CONTRACT_ADDRESS) {
    logger.warn('MultiSig contract not deployed');
    return { txHash: 'not-deployed' };
  }

  const signer = getSigner(officerKey);
  const contract = getContract(ABI_PATH, CONTRACT_ADDRESS, signer);
  if (!contract) return { txHash: 'abi-empty' };

  try {
    const tx = await contract.submitSignature(caseId, decision === 'approve');
    const receipt = await tx.wait();
    logger.info('Officer signature submitted', { txHash: tx.hash, caseId });
    return { txHash: tx.hash, receipt };
  } catch (err) {
    logger.error('submitSignature failed', { error: err.message });
    throw err;
  }
};

/**
 * Check if the multi-sig threshold is met for a case.
 */
exports.checkThreshold = async ({ caseId }) => {
  if (!CONTRACT_ADDRESS) return { met: false, reason: 'not-deployed' };

  const contract = getContract(ABI_PATH, CONTRACT_ADDRESS);
  if (!contract) return { met: false, reason: 'abi-empty' };

  try {
    const result = await contract.checkThreshold(caseId);
    return { met: result, reason: result ? 'threshold-met' : 'pending' };
  } catch (err) {
    logger.error('checkThreshold failed', { error: err.message });
    return { met: false, reason: err.message };
  }
};
