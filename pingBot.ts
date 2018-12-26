import { Message, TextChannel, User, Client } from 'discord.js';

import { IPingBotOptions } from './options';

export class PingBot {

  private currentIntervalId: number = -1;
  private currentlyPingSpamming: boolean = false;
  private currentlySpammedUserId: string = '';

  constructor(private readonly discordClient: Client, private readonly options: IPingBotOptions) {}

  /**
   * Listens for the message event
   * @param message The message that was sent
   */
  public messageListener(message: Message): void {
    const words = message.content.split(' ');

    const firstWord = words[0];

    if (firstWord === this.options.commandParam) {
      const currentChannel: TextChannel = message.channel as TextChannel;
      const usersMentioned = message.mentions.users;

      if (usersMentioned !== null) {

        const firstUser: User = usersMentioned.first();

        if (firstUser) {
          this.currentIntervalId = this.startPingSpam(currentChannel, firstUser);
        } else {
          currentChannel.send('Error getting user to ping.');
        }
      } else if (this.currentlyPingSpamming) {
        this.stopPingSpam(currentChannel, this.currentIntervalId);
      } else {
        currentChannel.send(`${this.discordClient.user.username} is not currently running. Please type ${this.options.commandParam} <tag> to ping someone.`);
      }
    }
  }

  /**
   * Listens for the ready event
   */
  public readyListener(): void {
    console.log(`${this.discordClient.user.username} finished start up at: ${this.discordClient.readyAt.toLocaleTimeString()}`);
  }

  /**
   * Pings a user repeatedly
   * @param channel The channel to ping the user in
   * @param user The Discord user to ping
   *
   * @returns The setInterval id number so it can be turned off later via clearInterval
   */
  private startPingSpam(channel: TextChannel, user: User): number {
    channel.send(`Activated ${this.discordClient.user.username}. Beginning ping spam.`);

    const userId: string = user.id;
    this.currentlyPingSpamming = true;
    this.currentlySpammedUserId = userId;

    const intervalId: number = setInterval(() => {
      channel.send(`<@${userId}>`);
    }, this.options.messageInterval);

    return intervalId;
  }

  /**
   * Stops pinging a user
   * @param channel The channel to send the message that the pings have stopped in
   * @param intervalId The id returned by setInterval to find and shut off the loop
   */
  private stopPingSpam(channel: TextChannel, intervalId: number): void {
    this.currentlyPingSpamming = false;
    this.discordClient.fetchUser(this.currentlySpammedUserId).then((user) => {
      channel.send(`Stopped pinging ${user.username}`);
    }).catch(() => {
      channel.send(`Error finding currently spammed user by user id.`);
    });
    this.currentlySpammedUserId = '';
    clearInterval(intervalId);
  }
}
