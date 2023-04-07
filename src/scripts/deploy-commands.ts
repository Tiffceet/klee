if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const { REST, Routes } = require("discord.js");

import * as commands from "./../commands";

const commandJsons = [];
const commandsArr = Object.entries(commands);
for (const command of commandsArr) {
  const [name, commandObj] = command;
  if (!commandObj.command.toJSON) continue;
  // console.log(name)
  commandJsons.push(commandObj.command.toJSON());
}

const rest = new REST({ version: "10" }).setToken(process.env.token);

(async () => {
  try {
    console.log(`Started refreshing application (/) commands.`);

    // The put method is used to fully refresh all commands in the guild with the current set
    if (process.env.NODE_ENV !== "production") {
      await rest.put(
        Routes.applicationGuildCommands(
          process.env.CLIENT_ID,
          process.env.DEBUG_GUILD_ID
        ),
        { body: commandJsons }
      );
    } else {
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: commands,
      });
    }

    console.log(`Successfully reloaded application (/) commands.`);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
