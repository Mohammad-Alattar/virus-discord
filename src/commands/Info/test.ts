import { CommandInteraction } from 'discord.js';

import { Command } from '../../structures/command';

export default class PingCommand extends Command {
    name = "test";
    description = "test command!";
    async check(interaction: CommandInteraction<"cached">): Promise<any> {
        if (!interaction.memberPermissions.has("Administrator")) return
    }
    async run(interaction: CommandInteraction) {

    }
    async error(interaction: CommandInteraction, error: any) {
    }
}