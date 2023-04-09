import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces/Command";

export const quests: Command = {
  command: new SlashCommandBuilder()
    .setName("quests")
    .setDescription("Replies with Pong!"),
  execute: async (interaction: CommandInteraction) => {
    // TODO: Implement view quests
    await interaction.reply("Pong!");
  },
};
