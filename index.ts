import * as Discord from 'discord.js';

import { token } from './token';
import { clientOptions, pingBotOptions } from './options';

const client = new Discord.Client(clientOptions);

let currentlyPingSpamming: boolean = false;

let currentlySpammedUserId: string = '';

let currentIntervalId: number = -1;

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', messageListener);

// Login the bot
client.login(token);

function messageListener(message: Discord.Message): void {
  const words = message.content.split(' ');

  const firstWord = words[0];

  if (firstWord === pingBotOptions.commandParam) {
    const currentChannel: Discord.TextChannel = message.channel as Discord.TextChannel;
    const usersMentioned = message.mentions.users;

    if (usersMentioned !== null) {

      const firstUser: Discord.User = usersMentioned.first();

      if (firstUser) {
        currentIntervalId = startPingSpam(currentChannel, firstUser);
      } else {
        currentChannel.send('Error getting user to ping.');
      }
    } else if (currentlyPingSpamming) {
      stopPingSpam(currentChannel, currentIntervalId);
    } else {
      currentChannel.send(`${client.user.username} is not currently running. Please type ${pingBotOptions.commandParam} <tag> to ping someone.`);
    }
  }
}

/**
 * Pings a user repeatedly
 * @param channel The channel to ping the user in
 * @param user The Discord user to ping
 *
 * @returns The setInterval id number so it can be turned off later via clearInterval
 */
function startPingSpam(channel: Discord.TextChannel, user: Discord.User): number {
  channel.send(`Activated ${client.user.username}. Beginning ping spam.`);

  const userId: string = user.id;
  currentlyPingSpamming = true;
  currentlySpammedUserId = userId;

  const intervalId: number = setInterval(() => {
    channel.send(`<@${userId}>`);
  }, pingBotOptions.messageInterval);

  return intervalId;
}

/**
 * Stops pinging a user
 * @param channel The channel to send the message that the pings have stopped in
 * @param intervalId The id returned by setInterval to find and shut off the loop
 */
function stopPingSpam(channel: Discord.TextChannel, intervalId: number): void {
  currentlyPingSpamming = false;
  client.fetchUser(currentlySpammedUserId).then((user) => {
    channel.send(`Stopped pinging ${user.username}`);
  }).catch(() => {
    channel.send(`Error finding currently spammed user by user id.`);
  });
  currentlySpammedUserId = '';
  clearInterval(intervalId);
}
