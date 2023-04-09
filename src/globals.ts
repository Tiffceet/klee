import { Guild, GuildConfig } from "@prisma/client";
import { getAllGuilds } from "./services/guild";
import { addBalance, getWallet, updateWallet } from "./services/wallet";

export const discordGuilds: Record<
  string,
  Guild & {
    guildConfig: GuildConfig | null;
  }
> = {};

interface UserCache {
  messageCount: number;
}

type UsersCacheObject = Record<string, UserCache>;
type GuildCacheObject = Record<string, { users: UsersCacheObject }>;
export const userMessagesCounterCache: {
  guilds: GuildCacheObject;
} = {
  guilds: {},
};

export async function flushUserMessagesCounterCache() {
  Object.entries(userMessagesCounterCache.guilds).forEach(
    ([discordGuildId, { users }]) => {
      Object.entries(users).forEach(async ([userId, { messageCount }]) => {
        // TODO: Improve this into a batch update instead of a 1 time update for each user to save database writes
        await addBalance(discordGuildId, userId, messageCount);
        const wallet = await getWallet(discordGuildId, userId);
        await updateWallet(discordGuildId, userId, {
          messagesSent: wallet.messagesSent + messageCount,
          dailyMessagesSent: wallet.dailyMessagesSent + messageCount,
        });
        // TODO: If user reached quest target, reward user

        // Clear user messsage count cache
        delete userMessagesCounterCache.guilds[discordGuildId].users[userId];
      });
    }
  );
}

export async function setupGlobalStore() {
  const guilds = await getAllGuilds();
  guilds.forEach((guild) => {
    discordGuilds[guild.discordGuildId] = guild;
  });
}
