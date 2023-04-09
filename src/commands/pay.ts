import {
  CommandInteraction,
  SlashCommandBuilder,
  ComponentType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { Command } from "../interfaces/Command";
import { addBalance, getWallet, removeBalance } from "../services/wallet";

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
    const userInteractionOption = interaction.options.get("user");
    const amountInteractionOption = interaction.options.get("amount");

    if (!userInteractionOption) {
      return interaction.editReply("User was not provided");
    }

    if (!amountInteractionOption) {
      return interaction.editReply("Amount was not provided");
    }

    const user = userInteractionOption.user;
    const amount = amountInteractionOption.value;

    if (typeof amount !== "number") {
      return interaction.editReply("Amount is not a number");
    }

    if (!interaction.guildId) {
      return interaction.editReply(
        "Please use this command in a discord server only"
      );
    }

    if (!user) {
      return interaction.editReply("User do not exist");
    }

    if (String(user.id) === String(interaction.user.id))
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
    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("confirm")
          .setLabel("Confirm")
          .setStyle(ButtonStyle.Success)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId("cancel")
          .setLabel("Cancel")
          .setStyle(ButtonStyle.Danger)
      );

    const embed = new EmbedBuilder()
      .setTitle("Transaction Confirmation")
      .setColor(0xfee65c)
      .setDescription(
        `Are you sure you want to pay \`${amount} Coins\` to <@${user.id}>?`
      );

    const message = await interaction.editReply({
      embeds: [embed],
      components: [row],
    });

    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 10000,
    });

    let userResponded = false;

    collector.on("collect", async (buttonInteraction) => {
      // Prevent other user from pressing
      if (buttonInteraction.user.id !== interaction.user.id) {
        buttonInteraction.reply("You are not allowed to do this.");
        return;
      }

      // Tell user the transaction is processing
      userResponded = true;
      const processingComponents =
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("processing")
            .setLabel("Processing...")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true)
        );
      interaction.editReply({
        embeds: [embed],
        components: [processingComponents],
      });

      // Process response
      buttonInteraction.deferUpdate();
      const response: "confirm" | "cancel" = buttonInteraction.customId as any;
      if (response === "cancel") {
        const embed = new EmbedBuilder()
          .setTitle("Transaction Canceled!")
          .setColor(0xff0000)
          .setDescription("You have canceled the transaction.");
        interaction.editReply({
          components: [],
          embeds: [embed],
        });
        return;
      }

      if (response === "confirm") {
        await addBalance(String(interaction.guildId), user.id, amount);
        await removeBalance(
          String(interaction.guildId),
          interaction.user.id,
          amount
        );
        const embed = new EmbedBuilder()
          .setTitle("Transaction Completed!")
          .setColor(0x57f288)
          .setDescription(`You paid \`${amount} Coins\` to <@${user.id}>`);
        interaction.editReply({
          components: [],
          embeds: [embed],
        });
        return;
      }
    });

    // Timed out
    collector.on("end", (collected) => {
      if (userResponded) return;
      const embed = new EmbedBuilder()
        .setTitle("Transaction Timed Out!")
        .setColor(0xff0000)
        .setDescription(
          `You did not confirm or cancel the transaction in time.`
        );
      interaction.editReply({
        embeds: [embed],
        components: [],
      });
    });
  },
};
