/**
 * A ping pong bot, whenever you send "ping", it replies "pong".
 */

import * as Discord from 'discord.js';

import { token } from './token';

const commandParam = '!pingspam';

// Create an instance of a Discord client
const client = new Discord.Client();

client.options.disableEveryone = true;

let currentlyPingSpamming: boolean = false;

let currentlySpammedUserId: string = '';

let intervalId: number = -1;

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', (message) => {

  const words = message.content.split(' ');

  const firstWord = words[0];

  if (firstWord === commandParam) {
    const currentChannel: Discord.TextChannel = message.channel as Discord.TextChannel;
    const usersMentioned = message.mentions.users;

    usersMentioned.first();

    if (usersMentioned !== null) {

      const firstUser: Discord.User = usersMentioned.first();

      if (firstUser) {
        currentlyPingSpamming = true;

        currentChannel.send(`Activated ${client.user.username}. Beginning ping spam.`);

        currentlySpammedUserId = firstUser.id;

        intervalId = pingSpam(currentChannel, firstUser.id);
      } else {
        currentChannel.send('Error getting user to ping.');
      }
    } else if (currentlyPingSpamming) {
      stopPingSpam(currentChannel, intervalId);
    } else {
      currentChannel.send(`${client.user.username} is not currently running. Please type ${commandParam} <tag> to ping someone.`);
    }
  }
});

function pingSpam(channel: Discord.TextChannel, userId: string): number {
  return setInterval(() => {
    channel.send(`<@${userId}>`);
  }, 1000);
}

function stopPingSpam(channel: Discord.TextChannel, id: number): void {
  currentlyPingSpamming = false;
  client.fetchUser(currentlySpammedUserId).then((user) => {
    channel.send(`Stopped pinging ${user.username}`);
  }).catch(() => {
    channel.send(`Error finding currently spammed user by user id.`);
  });
  currentlySpammedUserId = '';
  clearInterval(id);
}

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(token);
