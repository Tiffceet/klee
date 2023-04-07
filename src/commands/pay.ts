import {
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandMentionableOption,
} from "discord.js";
import { Command } from "../interfaces/Command";
import { getWallet } from "../services/wallet";

export const pay: Command = {
  command: new SlashCommandBuilder()
    .setName("pay")
    .setDescription("Pay another user.")
    .addMentionableOption((builder) =>
      builder.setName("user").setDescription("The user.").setRequired(true)
    )
    .addNumberOption((builder) =>
      builder.setName("amount").setDescription("The amount.").setRequired(true)
    ),
  execute: async (interaction: CommandInteraction) => {
    await interaction.deferReply();
    const user = interaction.options.get("user");
    const amount = Number(interaction.options.get("amount"));
    if (!interaction.guildId) {
      return interaction.editReply(
        "Please use this command in a discord server only"
      );
    }

    if (!user || !user.user) {
      return interaction.editReply("User do not exist");
    }

    if (String(user.user.id) === String(interaction.user.id))
      return interaction.editReply(
        "Bro seriously trying to pay himself :skull:"
      );

    const payerWallet = await getWallet(
      interaction.guildId,
      interaction.user.id
    );
    if (payerWallet.balance < amount) {
      return interaction.editReply("You do not have enough coins.");
    }

    // TODO: Prompt user
    // TODO: Implement onButtonInteraction on Command interface
  },
};
