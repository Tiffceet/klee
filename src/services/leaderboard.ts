import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getWalletLeaderboard(discordGuildId: string) {
  const wallets = await prisma.wallet.findMany({
    where: {
      discordGuildId,
    },
    orderBy: {
      balance: "desc",
    },
  });

  return wallets;
}
export async function getWalletRank(discordGuildId: string, userId: string) {
  const wallets = await getWalletLeaderboard(discordGuildId);
  for (let i = 0; i < wallets.length; i++) {
    if (wallets[i].userId === userId) {
      return i + 1;
    }
  }
  return -1;
}
export async function getMessageCountLeaderboard(discordGuildId: string) {
  const wallets = await prisma.wallet.findMany({
    where: {
      discordGuildId,
    },
    orderBy: {
      messagesSent: "desc",
    },
  });

  return wallets;
}
export async function getMessageCountRank(discordGuildId: string, userId: string) {
  const wallets = await getMessageCountLeaderboard(discordGuildId);
  for (let i = 0; i < wallets.length; i++) {
    if (wallets[i].userId === userId) {
      return i + 1;
    }
  }
  return -1;
}
