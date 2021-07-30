# Faucet Bot

## Install dependencies
```
yarn
```

## Install pm2
```
npm i pm2 -g
```

## Add ecosystem.config.js
```
module.exports = {
  apps : [{
    name: 'server',
    script: './src/server/index.js',
    env: {
      FAUCET_MNEMONIC: '',
      CHAIN_WS_ENDPOINT: '',
      PORT: 5555
    },
  }, {
    name: 'discord',
    script: './src/bot/discord.js',
    env: {
      ACCESS_TOKEN: '',
      BACKEND_URL: 'http://127.0.0.1:5555'
    },
  }],
};
```

## Launch
```
pm2 start ecosystem.config.js
```
