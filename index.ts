import { Client } from 'discord.js';

import { token } from './token';
import { clientOptions, pingBotOptions } from './options';

import { PingBot } from './pingBot';

const client: Client = new Client(clientOptions);

const pingBot: PingBot = new PingBot(client, pingBotOptions);

pingBot.start(token);
