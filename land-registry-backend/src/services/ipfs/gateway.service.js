const logger = require('../../utils/logger');

/**
 * IPFS Gateway configuration and URL builder.
 * Supports configurable gateways via environment variables.
 */

const DEFAULT_GATEWAY = process.env.IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';

/**
 * Build a gateway URL for a given CID.
 */
exports.buildUrl = (cid, gateway = DEFAULT_GATEWAY) => {
  if (!cid) throw new Error('CID is required');
  const base = gateway.endsWith('/') ? gateway : `${gateway}/`;
  return `${base}${cid}`;
};

/**
 * Build an IPFS protocol URI.
 */
exports.buildIpfsUri = (cid) => {
  if (!cid) throw new Error('CID is required');
  return `ipfs://${cid}`;
};

/**
 * Get the Pinata-specific URL for a CID.
 */
exports.pinataUrl = (cid) => {
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
};

/**
 * Get metadata URL (useful for NFT metadata).
 */
exports.metadataUrl = (cid, filename = '') => {
  const base = exports.buildUrl(cid);
  return filename ? `${base}/${filename}` : base;
};

/**
 * List of configured gateways (for health checks and fallback).
 */
exports.getGateways = () => {
  const customGateways = process.env.IPFS_GATEWAYS;
  if (customGateways) {
    return customGateways.split(',').map(g => g.trim());
  }
  return [
    'https://gateway.pinata.cloud/ipfs/',
    'https://ipfs.io/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
    'https://dweb.link/ipfs/'
  ];
};
