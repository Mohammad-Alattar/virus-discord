import { CacheType, CommandInteraction } from 'discord.js';

import { Command } from '../../structures/command';

export default class PingCommand extends Command {
  name = "ping";
  description = "ping pong!";
  async check(interaction: CommandInteraction<CacheType>): Promise<any> {
  }
  async run(interaction: CommandInteraction) {
    const ping = this.client.ws.ping
    await interaction.reply({ content: `Ping ${ping}!`, ephemeral: true })
  }
  async error(interaction: CommandInteraction, error: any) {
  }
}
