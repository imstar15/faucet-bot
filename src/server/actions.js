const { WsProvider, ApiPromise } = require('@polkadot/api');
const pdKeyring = require('@polkadot/keyring');

class Actions {
  async create({ mnemonic, endpoint, types, units }) {
    this.units = units;
    const provider = new WsProvider(endpoint);
    this.api = await ApiPromise.create({ provider, types });
    const keyring = new pdKeyring.Keyring({ type: 'sr25519' });
    this.account = keyring.addFromMnemonic(mnemonic);
  }

  async sendDOTs(address, amount = 150) {
    amount = amount * this.units;
    const transfer = this.api.tx.balances.transfer(address, amount);
    const hash = await transfer.signAndSend(this.account);

    return hash.toHex();
  }

  async checkBalance() {
    let balance = 0;
    try {
      const { data: { free } } = await this.api.query.system.account(this.account.address);
      balance = free;
    } catch (error) {
      console.error('Check balance failed. error: ', error);
    }
    return free;
  }
}

module.exports = Actions;
