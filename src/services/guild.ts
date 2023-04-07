import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function createGuild(discordGuildId: string) {
  return await prisma.guild.create({
    data: {
      discordGuildId,
    },
  });
}

export async function getGuild(discordGuildId: string) {
  return await prisma.guild.findFirst({
    where: {
      discordGuildId,
    },
  });
}

export async function getAllGuilds() {
  return await prisma.guild.findMany({
    include: {
      guildConfig: true,
    },
  });
}
