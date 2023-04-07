import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function getWallet(discordGuildId: string, userId: string) {
  let wallet = await prisma.wallet.findFirst({
    where: {
      discordGuildId,
      userId,
    },
  });

  if (!wallet) {
    wallet = await createWallet(discordGuildId, userId);
  }

  return wallet;
}

export async function createWallet(discordGuildId: string, userId: string) {
  return await prisma.wallet.create({
    data: {
      discordGuildId,
      userId,
      balance: 0,
      messagesSent: 0,
      userReputation: 0,
    },
  });
}

export async function updateWallet(
  discordGuildId: string,
  userId: string,
  data: Prisma.WalletUpdateInput
) {
  return await prisma.wallet.update({
    data,
    where: {
      userId_discordGuildId: {
        discordGuildId,
        userId,
      },
    },
  });
}

export async function addBalance(
  discordGuildId: string,
  userId: string,
  amount: number
) {
  let wallet = await getWallet(discordGuildId, userId);

  if (!wallet) {
    wallet = await createWallet(discordGuildId, userId);
  }

  const newBalance = wallet.balance + amount;

  return await prisma.wallet.update({
    data: {
      balance: newBalance,
    },
    where: {
      id: wallet.id,
    },
  });
}

export async function removeBalance(
  discordGuildId: string,
  userId: string,
  amount: number
) {
  let wallet = await getWallet(discordGuildId, userId);

  if (!wallet) {
    wallet = await createWallet(discordGuildId, userId);
  }

  const newBalance = wallet.balance - amount;

  if (newBalance < 0) {
    throw new Error("Invalid amount");
  }

  return await prisma.wallet.update({
    data: {
      balance: newBalance,
    },
    where: {
      id: wallet.id,
    },
  });
}
