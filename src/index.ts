import 'dotenv/config';

import { GatewayIntentBits } from 'discord.js';

import Bot from './structures/client';

export const client = new Bot({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent],
});
client.start();
