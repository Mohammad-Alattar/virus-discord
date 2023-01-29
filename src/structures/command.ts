import { ApplicationCommandDataResolvable, ApplicationCommandOptionData, CommandInteraction, SlashCommandBuilder } from 'discord.js';

import Bot from '../structures/client';


export abstract class Command {
  client!: Bot;
  abstract name: string;
  abstract description: string;
  options?: ApplicationCommandOptionData[];
  abstract run(interaction: CommandInteraction): Promise<any>;
  async error(interaction: CommandInteraction, error: any): Promise<any> {
    await interaction.reply("There is an error corrupted :" + error);
  }
  async check(interaction: CommandInteraction,): Promise<any> {
  }

  resolve(): ApplicationCommandDataResolvable {
    return {
      name: this.name,
      description: this.description,
      options: this.options,
    };
  }
}
