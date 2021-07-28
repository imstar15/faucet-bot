const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
});

client.login('ODY5ODk0NzQxMzI2NzA4NzY2.YQE2nA.FKZUxn1TiIi4w1E7NPmFHl7r4fQ');