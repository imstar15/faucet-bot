const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config()

const Actions = require('./actions.js');

const Storage = require('./storage.js');
const config = require('./config');

// Check config valid
const { mnemonic, endpoint } = config;

if (!mnemonic) {
  console.error('Launch failed. FAUCET_MNEMONIC evironment variable is not set.');
  return;
}

if (!endpoint) {
  console.error('Launch failed. CHAIN_WS_ENDPOINT evironment variable is not set.');
  return;
}

const storage = new Storage();

const app = express();
app.use(bodyParser.json());
const port = 5555;

app.get('/health', (_, res) => {
  res.send('Faucet backend is healthy.');
});

const createAndApplyActions = async () => {
  const { mnemonic, endpoint, types, units, sendTimesLimit } = config;
  const actions = new Actions();
  await actions.create({ mnemonic, endpoint, types, units });

  app.get('/balance', async (_, res) => {
    const balance = await actions.checkBalance();
    res.send(balance.toString());
  });
  
  app.post('/bot-endpoint', async (req, res) => {
    const { address, amount, sender } = req.body;

    if (!(await storage.isValid(sender, address, sendTimesLimit)) && !sender.endsWith(':web3.foundation')) {
      res.send('LIMIT');
    } else {
      storage.saveData(sender, address);
    
      const hash = await actions.sendDOTs(address, amount);
      res.send(hash);
    }
  });
  
  
  app.post('/web-endpoint', (req, res) => {
  
  });
}

const main = async () => {
  await createAndApplyActions();

  app.listen(port, () => console.log(`Faucet backend listening on port ${port}.`));
}

try {
  main();
} catch (e) { console.error(e); }
