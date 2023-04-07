import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../interfaces/Command";
import { getWallet } from "../services/wallet";

export const wallet: Command = {
  command: new SlashCommandBuilder()
    .setName("wallet")
    .setDescription("View your wallet."),
  execute: async (interaction: CommandInteraction) => {
    await interaction.deferReply();
    if (!interaction.guildId) {
      interaction.editReply(
        "Please only use this command in a discord server."
      );
      return;
    }

    const wallet = await getWallet(interaction.guildId, interaction.user.id);

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Wallet")
      .setDescription(
        ` | **Current Balance:** \`${wallet.balance} Coins\` (#rank)
 | **Messages Sent:** \`${wallet.messagesSent} Messages\` (#rank)
 | **User Reputation:** \`+${wallet.userReputation} Rating\``
      )
      .setThumbnail(interaction.user.avatarURL());

    interaction.editReply({ embeds: [embed] });
  },
};
