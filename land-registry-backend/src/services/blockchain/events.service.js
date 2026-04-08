const { getProvider } = require('./contract.service');
const logger = require('../../utils/logger');

/**
 * Blockchain event listener service.
 *
 * Listens for on-chain events emitted by the Land Registry smart contracts
 * and triggers corresponding backend actions (status updates, notifications).
 *
 * NOTE: Requires deployed contracts with valid ABIs and addresses.
 * Until contracts are deployed, this service operates as a no-op stub.
 */

const listeners = new Map();

/**
 * Start listening for events on a contract.
 *
 * @param {ethers.Contract} contract - ethers.js contract instance
 * @param {string} eventName - Solidity event name
 * @param {Function} handler - Callback (eventArgs...) => void
 */
exports.listen = (contract, eventName, handler) => {
  if (!contract) {
    logger.warn('Cannot listen — contract not initialized', { eventName });
    return;
  }

  const key = `${contract.target || contract.address}:${eventName}`;
  if (listeners.has(key)) {
    logger.warn('Listener already registered', { key });
    return;
  }

  contract.on(eventName, (...args) => {
    logger.info('On-chain event received', { eventName, args: args.slice(0, -1).map(String) });
    try {
      handler(...args);
    } catch (err) {
      logger.error('Event handler failed', { eventName, error: err.message });
    }
  });

  listeners.set(key, { contract, eventName });
  logger.info('Event listener registered', { key });
};

/**
 * Stop listening for a specific event.
 */
exports.unlisten = (contract, eventName) => {
  if (!contract) return;
  const key = `${contract.target || contract.address}:${eventName}`;
  contract.removeAllListeners(eventName);
  listeners.delete(key);
  logger.info('Event listener removed', { key });
};

/**
 * Stop all listeners.
 */
exports.unlistenAll = () => {
  for (const [key, { contract, eventName }] of listeners) {
    contract.removeAllListeners(eventName);
  }
  listeners.clear();
  logger.info('All event listeners removed');
};

/**
 * Initialize event listeners for deployed contracts.
 * Called once during server startup (after contract deployment).
 *
 * Stub: No-op until contracts are deployed.
 */
exports.initializeListeners = () => {
  const LAND_REGISTRY_ADDRESS = process.env.LAND_REGISTRY_ADDRESS;
  const TRANSFER_MANAGER_ADDRESS = process.env.TRANSFER_MANAGER_ADDRESS;

  if (!LAND_REGISTRY_ADDRESS && !TRANSFER_MANAGER_ADDRESS) {
    logger.info('No contract addresses configured — skipping event listeners');
    return;
  }

  logger.info('Event listeners would be initialized here once contracts are deployed');

  // Future: When contracts are deployed, add listeners like:
  //
  // const landContract = getContract(landAbiPath, LAND_REGISTRY_ADDRESS);
  // listen(landContract, 'LandRegistered', (tokenId, owner) => { ... });
  // listen(landContract, 'TransferCompleted', (tokenId, from, to) => { ... });
};
