import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces/Command";
import { createWallet } from "../services/wallet";
import { discordGuilds } from "../globals";

export const ping: Command = {
  command: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  execute: async (interaction: CommandInteraction) => {
    await interaction.deferReply();
    if (!interaction.guildId) {
      return;
    }
    const guild = discordGuilds[interaction.guildId];
    console.log(JSON.stringify(guild));
    interaction.editReply(JSON.stringify(guild));
    // if (!interaction.guildId) {
    //   interaction.editReply("Oops");
    //   return;
    // }
    // interaction.editReply("Creating wallet");
    // await createWallet(interaction.guildId, interaction.user.id);
    // interaction.editReply("Wow wallet created");
  },
};
