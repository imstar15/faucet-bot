module.exports = {
  apps : [
    {
      name: 'server',
      script: './src/server/index.js',
      watch: false,
      env: {
        CHAIN_WS_ENDPOINT: 'wss://neumann.api.onfinality.io/public-ws',
        PORT: 5555
      },
    },
    // {
    //   name: 'discord',
    //   script: './src/bot/discord.js',
    //   watch: false,
    //   env: {
    //     BACKEND_URL: 'http://127.0.0.1:5555'
    //   },
    // }
  ],
};
