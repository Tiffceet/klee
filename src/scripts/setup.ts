import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function setup() {
  const guild = await prisma.guild.create({
    data: {
      discordGuildId: "680297709420412942",
      guildConfig: {
        create: {
          earningChannelIds: ["819603708740239443"],
          eventChannelIds: ["819603708740239443"],
        },
      },
    },
  });
  console.log("Guild created");
  console.log(JSON.stringify(guild));
}

setup();
