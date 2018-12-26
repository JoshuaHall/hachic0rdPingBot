import * as Discord from 'discord.js';

import { token } from './token';
import { clientOptions, pingBotOptions } from './options';

import { PingBot } from './pingBot';

const client = new Discord.Client(clientOptions);

const pingBot = new PingBot(client, pingBotOptions);

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', pingBot.messageListener);

// Login the bot
client.login(token);
