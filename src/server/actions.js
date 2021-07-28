const { WsProvider, ApiPromise } = require('@polkadot/api');
const pdKeyring = require('@polkadot/keyring');
const config = require('./config');

const { endpoint, types } = config;

class Actions {
  async create(mnemonic, url = endpoint) {
    const provider = new WsProvider(url);
    this.api = await ApiPromise.create({ provider, types });
    const keyring = new pdKeyring.Keyring({ type: 'sr25519' });
    this.account = keyring.addFromMnemonic(mnemonic);
  }

  async sendDOTs(address, amount = 150) {
    amount = amount * 10**10;
    const transfer = this.api.tx.balances.transfer(address, amount);
    const hash = await transfer.signAndSend(this.account);

    return hash.toHex();
  }

  async checkBalance() {
    const { data: { free } } = await this.api.query.system.account(this.account.address);
    return free;
  }
}

module.exports = Actions;
