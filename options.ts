import { ClientOptions } from 'discord.js';

export interface IPingBotOptions {
  commandParam: string;
  messageInterval: number;
}

export const pingBotOptions: IPingBotOptions = {
  commandParam: '!pingspam',
  messageInterval: 1000,
};

export const clientOptions: ClientOptions = {
  disableEveryone: true,
};
