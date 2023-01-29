import { Events } from 'discord.js';

export interface EventType {
  name: string | Events;
  once: boolean;
  execute: (...args: any) => Promise<void>;
}
