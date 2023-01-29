import { client } from '..';
import { Event } from '../structures/Event';

export default new Event("interactionCreate", async (interaction) => {
  // Chat Input Commands
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName) ?? client.subcommands.get(interaction.options?.getSubcommand());
  if (!command)
    return interaction.followUp("You have used a non existent command");
    if(await command?.check(interaction)) return;
    if(interaction.replied) return;
    command.run(interaction).catch((error) => {
    command?.error(interaction, error);
  });
});
