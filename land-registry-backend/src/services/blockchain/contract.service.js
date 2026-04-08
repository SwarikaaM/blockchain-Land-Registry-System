const { ethers } = require('ethers');
const logger = require('../../utils/logger');

/**
 * Blockchain contract service — creates ethers.js contract instances.
 * Requires contract ABI files and deployed addresses in env vars.
 */

const RPC_URL = process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com';

let provider;

/**
 * Get or create the JSON-RPC provider.
 */
exports.getProvider = () => {
  if (!provider) {
    provider = new ethers.JsonRpcProvider(RPC_URL);
  }
  return provider;
};

/**
 * Create a contract instance from ABI and address.
 *
 * @param {string} abiPath - Path to ABI JSON file
 * @param {string} address - Deployed contract address
 * @param {ethers.Signer} [signer] - Optional signer for write operations
 * @returns {ethers.Contract}
 */
exports.getContract = (abiPath, address, signer = null) => {
  try {
    const abi = require(abiPath);

    if (!abi || (Array.isArray(abi) && abi.length === 0)) {
      logger.warn('Contract ABI is empty — blockchain calls will fail', { abiPath });
      return null;
    }

    const prov = exports.getProvider();
    return new ethers.Contract(address, abi, signer || prov);
  } catch (err) {
    logger.error('Failed to load contract', { abiPath, error: err.message });
    return null;
  }
};

/**
 * Create a wallet signer from a private key.
 */
exports.getSigner = (privateKey) => {
  const prov = exports.getProvider();
  return new ethers.Wallet(privateKey, prov);
};
