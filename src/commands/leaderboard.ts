import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces/Command";

export const leaderboard: Command = {
  command: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Replies with Pong!"),
  execute: async (interaction: CommandInteraction) => {
    await interaction.reply("Pong!");
  },
};
