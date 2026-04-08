const axios = require('axios');
const logger = require('../../utils/logger');

const GATEWAYS = [
  'https://gateway.pinata.cloud/ipfs/',
  'https://ipfs.io/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://dweb.link/ipfs/'
];

/**
 * Fetch a file from IPFS using multiple gateway fallbacks.
 *
 * @param {string} cid - IPFS content identifier
 * @param {Object} options - { timeout, responseType }
 * @returns {{ data: Buffer, contentType: string, gateway: string }}
 */
exports.fetchFromIPFS = async (cid, options = {}) => {
  const { timeout = 30000, responseType = 'arraybuffer' } = options;

  for (const gateway of GATEWAYS) {
    const url = `${gateway}${cid}`;
    try {
      const response = await axios.get(url, {
        timeout,
        responseType,
        validateStatus: (status) => status < 500
      });

      if (response.status === 200) {
        logger.info('IPFS fetch success', { cid, gateway });
        return {
          data: response.data,
          contentType: response.headers['content-type'] || 'application/octet-stream',
          gateway
        };
      }
    } catch (err) {
      logger.warn('IPFS gateway failed, trying next', { gateway, cid, error: err.message });
    }
  }

  throw new Error(`Failed to fetch CID ${cid} from all ${GATEWAYS.length} gateways`);
};

/**
 * Check if a CID is accessible on IPFS.
 */
exports.isAvailable = async (cid) => {
  try {
    await exports.fetchFromIPFS(cid, { timeout: 10000 });
    return true;
  } catch {
    return false;
  }
};
