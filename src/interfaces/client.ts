import type { ApplicationCommandDataResolvable } from "discord.js";

export interface registerAppCommandsOptions {
  guildId?: string;
  commands: ApplicationCommandDataResolvable[];
}
