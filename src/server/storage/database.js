const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_SCHEMA || 'root',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
  }
);

const Faucet = sequelize.define('faucet', {
  item: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
});

module.exports = { sequelize, Faucet };
