const { Sequelize } = require('sequelize');

const db = require('./database');
const { sha256, now, DAY } = require('../util');
const moment = require('moment');

class DatabaseStorage {
  constructor () {}
  isValid = async (username, addr, limit = 2, span = DAY) => {
    const cryptedUsername = sha256(username);
    const cryptedAddr = sha256(addr);

    const totalUsername = await this.queryItem(cryptedUsername, span);
    const totalAddr = await this.queryItem(cryptedAddr, span);

    if (totalUsername < limit && totalAddr < limit) {
      return true;
    }

    return false;
  }

  saveData = async (username, addr) => {
    const cryptedUsername = sha256(username);
    const cryptedAddr = sha256(addr);

    await this.saveItem(cryptedUsername);
    await this.saveItem(cryptedAddr);
  }

  saveItem = async (item) => db.Faucet.create({ item });

  queryItem =  async (item, span) => {
    const timestamp = now();
    const docs = await db.Faucet.findAll({
      where: Sequelize.and(
        { item },
        { updatedAt: { [Sequelize.Op.gt]: moment(timestamp - span).utc().format('YYYY-MM-DDTHH:mm:ss.SSSSZ') } }
      ),
    });
    return docs;
  }
}

module.exports = DatabaseStorage;