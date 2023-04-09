import { TextChannel } from "discord.js";
import { discordGuilds } from "../globals";
import { client } from "./../index";
export async function initServerEvent() {
  if (!client.isReady()) {
    console.log("Client is not ready...");
    return;
  }
  Object.entries(discordGuilds).forEach(([discordGuildId, guild]) => {
    if (!guild.guildConfig) return;
    guild.guildConfig.eventChannelIds.forEach((channelId) => {
      executeGuessNameEvent(discordGuildId, channelId);
    });
  });
}

export async function executeGuessNameEvent(
  discordGuildId: string,
  channelId: string,
  waitTime = 5000,
  messageCollectionTime = 5000
) {
  // Event starting soon...
  // Send another in 5 seconds
  // Initiate message collector
  // End messagec collector
  // Credit rewards

  // TODO: Proper implementation
  const textChannel = client.channels.cache.get(channelId) as TextChannel;
  if (!textChannel) {
    console.log(`Text channel <#${channelId}> not found...`);
    return;
  }
  textChannel.send("Event starting soon...");
  async function guessNameEvent() {
    const sentEventMsg = await textChannel.send("Guess this name...");
    const collector = textChannel.createMessageCollector({
      time: messageCollectionTime,
    });
    let guessedCorrectly = false;
    collector.on("collect", (m) => {
      if (guessedCorrectly) return;
      if (m.content === "answer") {
        guessedCorrectly = true;
        sentEventMsg.edit("<Looz> has guessed correctly");
      }
    });

    collector.on("end", (collected) => {
      if (!guessedCorrectly) {
        sentEventMsg.edit("No one have guessed correctly what a shame...");
      }
    });
  }
  setTimeout(guessNameEvent, waitTime);
}

export async function executeCountNumberEvent(
  discordGuildId: string,
  channelId: string
) {
  // TODO: Missing implentation
}
