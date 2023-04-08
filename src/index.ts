if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
import { startAllCronJobs } from "./cron";
import { Client, Events, GatewayIntentBits, InteractionType } from "discord.js";
import {
  onMessageCreate,
  onInteractionCreate,
  onceClientReady,
} from "./handlers";

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Client events
client.once(Events.ClientReady, onceClientReady);
client.on(Events.MessageCreate, onMessageCreate);
client.on(Events.InteractionCreate, onInteractionCreate);

// Cron
startAllCronJobs();

// Log in to Discord with your client's token
client.login(process.env.TOKEN);

export { client };
