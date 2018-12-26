/**
 * A ping pong bot, whenever you send "ping", it replies "pong".
 */

import * as Discord from 'discord.js';

import { token } from './token';

// Create an instance of a Discord client
const client = new Discord.Client();

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', (message) => {
  // If the message is "ping"
  if (message.mentions.users.size === 1) {
    // Send "pong" to the same channel

    const user = message.mentions.users.first();

    message.channel.send(`User ${user.username} mentioned by ${message.author} in ${message.channel.id}`);
  }
});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(token);
