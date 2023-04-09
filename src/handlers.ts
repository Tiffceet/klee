import * as commands from "./commands";
import {
  discordGuilds,
  setupGlobalStore,
  userMessagesCounterCache,
} from "./globals";
import { Command } from "./interfaces/Command";
import {
  Client,
  Message,
  Interaction,
  InteractionType,
  ChannelType,
  MessageType,
} from "discord.js";
export async function onceClientReady(client: Client<true>) {
  await setupGlobalStore();
  console.log(`Ready! Logged in as ${client.user.tag}`);
}

export function onMessageCreate(message: Message) {
  if (!message.guildId) return;
  if (message.author.bot) return;

  // Check if user is in earning channels first
  if (!discordGuilds[message.guildId]) return;
  if (!discordGuilds[message.guildId].guildConfig) return;
  if (
    !discordGuilds[message.guildId].guildConfig?.earningChannelIds.includes(
      message.channelId
    )
  )
    return;

  if (!userMessagesCounterCache.guilds[message.guildId]) {
    userMessagesCounterCache.guilds[message.guildId] = {
      users: {},
    };
  }

  if (
    !userMessagesCounterCache.guilds[message.guildId].users[message.author.id]
  ) {
    userMessagesCounterCache.guilds[message.guildId].users[message.author.id] =
      {
        messageCount: 0,
      };
  }

  userMessagesCounterCache.guilds[message.guildId].users[message.author.id]
    .messageCount++;
}

export function onInteractionCreate(interaction: Interaction) {
  if (interaction.type !== InteractionType.ApplicationCommand) return;

  if (interaction.channel?.type === ChannelType.DM) return;

  if (interaction.user.bot) return;

  const command: Command | undefined = (commands as any)[
    interaction.commandName
  ];

  if (!command) {
    // command not found
    return;
  }

  command.execute(interaction);
}
