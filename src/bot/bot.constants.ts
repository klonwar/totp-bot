import { BotCommand } from 'typegram';

export enum AvailableCommands {
  START = 'start',
  GENERATE = 'gen',
}

export const BotCommandsDescriptions: Record<AvailableCommands, string> = {
  [AvailableCommands.START]: 'Start an account',
  [AvailableCommands.GENERATE]: 'Generate one time password',
};

export const myCommands: BotCommand[] = Object.entries(
  BotCommandsDescriptions,
).map(([key, value]) => ({
  command: key,
  description: value,
}));
