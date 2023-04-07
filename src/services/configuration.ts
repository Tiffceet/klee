import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function getGuildConfiguration(discordGuildId: string) {
  return await prisma.guild.findFirst({
    where: {
      discordGuildId,
    },
    include: {
      guildConfig: true,
    },
  });
}
