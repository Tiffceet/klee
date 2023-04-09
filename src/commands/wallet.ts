import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../interfaces/Command";
import { getWallet } from "../services/wallet";
import { getMessageCountRank, getWalletRank } from "../services/leaderboard";

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

    // prettier-ignore
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Wallet")
      .setDescription(
        ` | **Current Balance:** \`${wallet.balance} Coins\` (#${await getWalletRank(interaction.guildId, interaction.user.id)})
 | **Messages Sent:** \`${wallet.messagesSent} Messages\` (#${await getMessageCountRank(interaction.guildId, interaction.user.id)})
 | **User Reputation:** \`+${wallet.userReputation} Rating\``
      )
      .setThumbnail(interaction.user.avatarURL());

    interaction.editReply({ embeds: [embed] });
  },
};
