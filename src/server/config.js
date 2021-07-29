const { units, sendAmount } = require('../config')

// Check evironment variables valid
if (!process.env.FAUCET_MNEMONIC) {
  throw Error('Launch failed. FAUCET_MNEMONIC evironment variable is not set.');
}

if (!process.env.CHAIN_WS_ENDPOINT) {
  throw Error('Launch failed. FAUCET_MNEMONIC evironment variable is not set.');
}

module.exports = {
  mnemonic: process.env.FAUCET_MNEMONIC,
  endpoint: process.env.CHAIN_WS_ENDPOINT,
  units,
  sendAmount,
  sendTimesLimit: 1,
  types: {
    ProjectIndex: 'u32',
    ProjectOf: 'Project',
    RoundIndex: 'u32',
    RoundOf: 'Round',
    BlockNumberFor: 'BlockNumber',
    Round: {
      start: 'BlockNumber',
      end: 'BlockNumber',
      matching_fund: 'Balance',
      grants: 'Vec<Grant>',
      is_canceled: 'bool',
      is_finalized: 'bool',
    },
    Grant: {
      project_index: 'ProjectIndex',
      contributions: 'Vec<Contribution>',
      is_approved: 'bool',
      is_canceled: 'bool',
      is_withdrawn: 'bool',
      withdrawal_expiration: 'BlockNumber',
      matching_fund: 'Balance',
    },
    Contribution: {
      account_id: 'AccountId',
      value: 'Balance',
    },
    Project: {
      name: 'Vec<u8>',
      logo: 'Vec<u8>',
      description: 'Vec<u8>',
      website: 'Vec<u8>',
      owner: 'AccountId',
      create_block_number: 'BlockNumber',
    },
  },
  rpc: {
    getProjects: {
      description: 'getProjects',
      params: [],
      type: 'Vec<Project>',
    },
  },
};
