const express = require('express');
const bodyParser = require('body-parser');

const Actions = require('./actions.js');
const storage = require('./storage');
const config = require('./config');

const app = express();
app.use(bodyParser.json());

app.get('/health', (_, res) => {
  res.send('Faucet backend is healthy.');
});

const createAndApplyActions = async () => {
  const { mnemonic, polkadot, sendTimesLimit, sendAmount, units } = config;
  const actions = new Actions();
  await actions.create({ mnemonic, polkadot });

  app.get('/balance', async (_, res) => {
    const balance = await actions.checkBalance();
    res.send(balance.toString());
  });
  
  app.post('/bot-endpoint', async (req, res) => {
    try {
      const { address, sender } = req.body;
      if (!(await storage.isValid(sender, address, sendTimesLimit)) && !sender.endsWith(':web3.foundation')) {
        res.send('LIMIT');
      } else {
        storage.saveData(sender, address);
        const hash = await actions.sendToken(address, sendAmount * units);
        res.send(hash);
      }
    } catch (error) {
      console.log('/bot-endpoint, error: ', error);
      res.send('ERROR');
    }
  });
}

const main = async () => {
  const { port } = config;
  await createAndApplyActions();
  app.listen(port, () => console.log(`Faucet backend listening on port ${port}.`));
}

try {
  main();
} catch (e) { console.error(e); }
