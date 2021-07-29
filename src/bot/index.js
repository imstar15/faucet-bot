const mSDK = require('matrix-js-sdk');
const axios = require('axios');
const pdKeyring = require('@polkadot/keyring');
const config = require('../config');
require('dotenv').config()

if (!process.env.MATRIX_ACCESS_TOKEN) {
  throw Error('Launch failed. MATRIX_ACCESS_TOKEN evironment variable is not set.');
}

if (!process.env.MATRIX_USER_ID) {
  throw Error('Launch failed. MATRIX_USER_ID evironment variable is not set.');
}

if (!process.env.BACKEND_URL) {
  throw Error('Launch failed. BACKEND_URL evironment variable is not set.');
}

const { tokenSymbol, sendAmount, polkascanUrl, units } = config;

const bot = mSDK.createClient({
  baseUrl: 'https://matrix.org',
  accessToken: process.env.MATRIX_ACCESS_TOKEN,
  userId: process.env.MATRIX_USER_ID,
  localTimeoutMs: 10000,
});

let ax = axios.create({
  baseURL: process.env.BACKEND_URL,
  timeout: 10000,
});

const sendMessage = (roomId, msg) => {
  bot.sendEvent(
    roomId,
    'm.room.message',
    { 'body': msg, 'msgtype': 'm.text' },
    '',
    console.error,
  );
}

bot.on('RoomMember.membership', (_, member) => {
  if (member.membership === 'invite' && member.userId === '@westend_faucet:matrix.org') {
    bot.joinRoom(member.roomId).done(() => {
      console.log(`Auto-joined ${member.roomId}.`);
    });
  }
});

bot.on('Room.timeline', async (event) => {
  if (event.getType() !== 'm.room.message') {
    return; // Only act on messages (for now).
  }

  const { content: { body }, room_id: roomId, sender } = event.event;

  let [action, arg0, arg1] = body.split(' ');

  if (action === '!balance') {
    const res = await ax.get('/balance');
    const balance = res.data;

    bot.sendHtmlMessage(
      roomId,
      `The faucet has ${balance/units} ${tokenSymbol}s remaining.`,
      `The faucet has ${balance/units} ${tokenSymbol}s remaining.`
    );
  }

  if (action === '!drip') {
    try {
      pdKeyring.decodeAddress(arg0);
    } catch (e) {
      sendMessage(roomId, `${sender} provided an incompatible address.`);
      return;
    }

    let amount = sendAmount;
    if (sender.endsWith(':web3.foundation') && arg1) {
      amount = arg1;
    }

    const res = await ax.post('/bot-endpoint', {
      sender,
      address: arg0,
      amount,
    });

    if (res.data === 'LIMIT') {
      sendMessage(roomId, `${sender} has reached their daily quota. Only request once per 24 hours.`);
      return;
    }

    bot.sendHtmlMessage(
      roomId,
      `Sent ${sender} ${amount} ${tokenSymbol}s. Extrinsic hash: ${res.data}.`,
      `Sent ${sender} ${amount} ${tokenSymbol}s. <a href="${polkascanUrl}/transaction/${res.data}">View on Polkascan.</a>`
    );
  }

  if (action === '!faucet') {
    sendMessage(roomId, `
Usage:
  !balance - Get the faucet's balance.
  !drip <Address> - Send ${tokenSymbol}s to <Address>.
  !faucet - Prints usage information.`);
  }
});

bot.startClient(0);
