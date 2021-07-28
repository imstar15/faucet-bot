const Discord = require('discord.js');
const axios = require('axios');
const pdKeyring = require('@polkadot/keyring');

let ax = axios.create({
  baseURL: process.env.BACKEND_URL,
  timeout: 10000,
});

const client = new Discord.Client();
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
  console.log('msg: ', msg);
  const { content, author: { id: sender } } = msg;
  let [action, arg0, arg1] = content.split(' ');
  console.log('action: ', action);
  console.log('arg0: ', arg0);
  console.log('arg1: ', arg1);

  if (action === '!balance') {
    const res = await ax.get('/balance');
    const balance = res.data;

    msg.reply(`The faucet has ${balance/10**15} WNDs remaining.`, `The faucet has ${balance/10**15} OAKs remaining.`);
  }

  if (action === '!drip') {
    try {
      pdKeyring.decodeAddress(arg0);
    } catch (e) {
      msg.reply(`${sender} provided an incompatible address.`);
      return;
    }

    let amount = 150;
    if (sender.endsWith(':web3.foundation') && arg1) {
      amount = arg1;
    }

    const res = await ax.post('/bot-endpoint', {
      sender,
      address: arg0,
      amount,
    });

    if (res.data === 'LIMIT') {
      msg.reply(`${sender} has reached their daily quota. Only request twice per 24 hours.`);
      return;
    }

    msg.reply(`Sent ${sender} ${amount} OAKs.`);
  }

  if (action === '!faucet') {
    msg.reply(`
Usage:
  !balance - Get the faucet's balance.
  !drip <Address> - Send OAKs to <Address>.
  !faucet - Prints usage information.`);
  }
});

client.login(process.env.ACCESS_TOKEN);