import { Client } from 'discord.js';

import { token } from './token';
import { clientOptions, pingBotOptions } from './options';

import { PingBot } from './pingBot';

const client: Client = new Client(clientOptions);

const pingBot: PingBot = new PingBot(client, pingBotOptions);

// Lets us know the bot is finished starting
client.on('ready', pingBot.readyListener);

// Prints useful messages to console
client.on('error', console.error);
client.on('warn', console.warn);
client.on('rateLimit', console.log);

// Listens for commands
client.on('message', pingBot.messageListener);

// Login the bot
client.login(token);
