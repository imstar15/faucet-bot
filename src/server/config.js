const config = require('../config');

// Check evironment variables valid
if (!process.env.FAUCET_MNEMONIC) {
  throw Error('Launch failed. FAUCET_MNEMONIC evironment variable is not set.');
}

module.exports = {
  units: config.units,
  sendAmount: config.sendAmount,
  mnemonic: process.env.FAUCET_MNEMONIC,
  polkadot: {
    endpoint: process.env.CHAIN_WS_ENDPOINT || 'wss://rpc.testnet.oak.tech',
    ss58Preifx: 51,
  },
  port: process.env.PORT || 5555,
  sendTimesLimit: 1,
};
