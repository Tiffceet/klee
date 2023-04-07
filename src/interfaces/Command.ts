import { SlashCommandBuilder, CommandInteraction } from "discord.js";

export interface Command {
  command: Partial<SlashCommandBuilder>;
  execute: (interaction: CommandInteraction) => Promise<any>;
}
