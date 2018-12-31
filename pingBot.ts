import { Message, TextChannel, User, Client, Collection } from 'discord.js';

import { IPingBotOptions } from './options';

export class PingBot {

  private currentIntervalId: number = -1;
  private currentlyPingSpamming: boolean = false;
  private currentlySpammedUserId: string = '';

  constructor(private readonly discordClient: Client, private readonly pingBotOptions: IPingBotOptions) { }

  /**
   * Starts the ping bot
   * @param token Bot token to login with
   */
  public start(token: string): void {

    console.log(`Beginning client startup process at ${new Date().toLocaleTimeString()}`);

    // Lets us know the bot is finished starting
    this.discordClient.on('ready', () => {
      this.readyListener();
    });

    // Prints useful messages to console
    // client.on('error', console.error);
    // client.on('warn', console.warn);
    // client.on('rateLimit', console.log);

    // Listens for commands
    this.discordClient.on('message', (msg) => {
      this.messageListener(msg);
    });

    // Login the bot
    this.discordClient.login(token);
  }

  /**
   * Listens for the message event
   * @param message The message that was sent
   */
  private messageListener(message: Message): void {
    const words = message.content.split(' ');

    const firstWord = words[0];

    if (firstWord === this.pingBotOptions.commandParam) {
      const currentChannel: TextChannel = message.channel as TextChannel;
      const usersMentioned: Collection<string, User> = message.mentions.users;

      const firstUser: User = usersMentioned.first();

      if (firstUser !== undefined) {
        this.currentIntervalId = this.startPingSpam(currentChannel, firstUser);
      } else if (this.currentlyPingSpamming) {
        this.stopPingSpam(currentChannel, this.currentIntervalId);
      } else {
        currentChannel.send(`${this.discordClient.user.username} is not currently running. Please type ${this.pingBotOptions.commandParam} <tag> to ping someone.`);
      }
    }
  }

  /**
   * Listens for the ready event
   */
  private readyListener(): void {
    console.log(`Ping bot start up finished at ${new Date().toLocaleTimeString()}`);
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
    }, this.pingBotOptions.messageInterval) as unknown as number;

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
    }).catch((err) => {
      channel.send(`Error finding currently spammed user by user id.`);
      console.error(err);
    });
    this.currentlySpammedUserId = '';
    clearInterval(intervalId);
  }
}
