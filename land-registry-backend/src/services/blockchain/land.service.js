const { getContract, getSigner } = require('./contract.service');
const logger = require('../../utils/logger');
const path = require('path');

const ABI_PATH = path.join(__dirname, '../../../contracts/abis/LandRegistry.json');
const CONTRACT_ADDRESS = process.env.LAND_REGISTRY_ADDRESS || '';

/**
 * Register a land asset on-chain.
 *
 * @param {Object} params
 * @param {string} params.tokenId - Unique token ID
 * @param {string} params.metadataHash - IPFS CID of land metadata
 * @param {string} params.owner - Owner wallet address
 * @param {string[]} params.coOwners - Co-owner wallet addresses
 * @param {number[]} params.shares - Co-owner shares (percentages)
 * @param {string} params.encumbrancesHash - Hash of encumbrances data
 * @param {string} params.geoCID - IPFS CID of GeoJSON polygon
 * @param {string} params.scrapeCID - IPFS CID of Mahabhulekh snapshot
 * @returns {{ txHash, receipt }}
 */
exports.registerLand = async (params) => {
  if (!CONTRACT_ADDRESS) {
    logger.warn('LandRegistry contract address not configured — skipping on-chain registration');
    return { txHash: 'not-deployed', receipt: null };
  }

  const signer = getSigner(process.env.DEPLOYER_PRIVATE_KEY);
  const contract = getContract(ABI_PATH, CONTRACT_ADDRESS, signer);

  if (!contract) {
    return { txHash: 'abi-empty', receipt: null };
  }

  try {
    const tx = await contract.registerLand(
      params.tokenId,
      params.metadataHash,
      params.owner,
      params.coOwners || [],
      params.shares || [],
      params.encumbrancesHash || '',
      params.geoCID || '',
      params.scrapeCID || ''
    );

    const receipt = await tx.wait();
    logger.info('Land registered on-chain', { txHash: tx.hash, tokenId: params.tokenId });

    return { txHash: tx.hash, receipt };
  } catch (err) {
    logger.error('On-chain registerLand failed', { error: err.message });
    throw err;
  }
};

/**
 * Get land data from chain.
 */
exports.getLand = async (tokenId) => {
  const contract = getContract(ABI_PATH, CONTRACT_ADDRESS);
  if (!contract) return null;

  try {
    return await contract.getLand(tokenId);
  } catch (err) {
    logger.error('getLand failed', { tokenId, error: err.message });
    return null;
  }
};
