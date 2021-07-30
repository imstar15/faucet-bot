require('dotenv').config()
const Discord = require('discord.js');
const axios = require('axios');
const _ = require('lodash');
const pdKeyring = require('@polkadot/keyring');
const config = require('../config');


// Check environment variables valid
if (!process.env.ACCESS_TOKEN) {
  throw Error('Launch failed. ACCESS_TOKEN evironment variable is not set.');
}

if (!process.env.BACKEND_URL) {
  throw Error('Launch failed. BACKEND_URL evironment variable is not set.');
}

const { tokenSymbol, sendAmount, polkascanUrl, units } = config;

let ax = axios.create({
  baseURL: process.env.BACKEND_URL,
  timeout: 10000,
});

const client = new Discord.Client();
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
  const { content, author: { id: sender } } = msg;
  let [action, arg0, arg1] = content.split(' ');

  if (action === '!balance') {
    const res = await ax.get('/balance');
    const balance = res.data;

    msg.reply(`The faucet has ${balance/units} ${tokenSymbol}s remaining.`, `The faucet has ${balance/units} ${tokenSymbol}s remaining.`);
  }

  if (action === '!drip') {
    if (_.isEmpty(arg0)) {
      msg.reply('please enter a wallet address after !drip.');r
      return;
    }
    
    try {
      pdKeyring.decodeAddress(arg0);
    } catch (e) {
      msg.reply(`address ${arg0} entered is incompatible to OAK Network.`);
      return;
    }

    let amount = sendAmount;

    const res = await ax.post('/bot-endpoint', {
      sender,
      address: arg0,
      amount,
    });

    if (res.data === 'LIMIT') {
      msg.reply(`your Discord ID or the address has reached its daily quota. Please request only once every 24 hours.`);
      return;
    }

    msg.reply(`I just sent ${amount} ${tokenSymbol} to address ${arg0}. View on Polkascan: ${polkascanUrl}/transaction/${res.data}.`);
  }

  if (action === '!faucet') {
    msg.reply(`
Usage:
  !balance - Get the faucet's balance.
  !drip <Address> - Send ${tokenSymbol}s to <Address>.
  !faucet - Prints usage information.`);
  }
});

client.login(process.env.ACCESS_TOKEN);