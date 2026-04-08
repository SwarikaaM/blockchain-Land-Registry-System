const { ethers } = require('ethers');
const { SiweMessage } = require('siwe');
const crypto = require('crypto');

/**
 * Generate a random nonce for SIWE challenge.
 */
exports.generateNonce = () => {
  return crypto.randomBytes(16).toString('hex');
};

/**
 * Build a SIWE message string for the user to sign.
 */
exports.buildSiweMessage = ({ address, nonce, chainId = 137, domain = 'localhost', uri = 'http://localhost:3000' }) => {
  const message = new SiweMessage({
    domain,
    address: ethers.getAddress(address.toLowerCase()),  // normalize then checksum
    statement: 'Sign in to Land Registry System',
    uri,
    version: '1',
    chainId,
    nonce
  });
  return message.prepareMessage();
};

/**
 * Verify a signed SIWE message.
 * Returns the recovered wallet address if valid, throws if invalid.
 */
exports.verifySiweSignature = async ({ message, signature }) => {
  const siweMessage = new SiweMessage(message);
  const result = await siweMessage.verify({ signature });

  if (!result.success) {
    throw new Error('Invalid SIWE signature');
  }

  return result.data.address.toLowerCase();
};

/**
 * Checksum a wallet address.
 */
exports.checksumAddress = (address) => {
  return ethers.getAddress(address.toLowerCase());
};

/**
 * Validate a wallet address format.
 */
exports.isValidAddress = (address) => {
  return ethers.isAddress(address);
};
