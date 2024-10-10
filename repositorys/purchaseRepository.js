import prismaClient from "../utils/prismaClient.js";

// 사용자 구매내역 조회
export const getUserPurchase = async (userId, filters) => {
  const { page, pageSize, orderBy, keyword, grade, genre, isSoldOut } = filters;

  const where = {
    userId,
    card: {
      OR: [
        { name: { contains: keyword, mode: "insensitive" } },
        { description: { contains: keyword, mode: "insensitive" } },
      ],
      ...(grade && { grade }),
      ...(genre && { genre }),
    },
  };

  const order = {
    ...(orderBy === "recent" && { createAt: "desc" }),
    ...(orderBy === "old" && { createAt: "asc" }),
    ...(orderBy === "lowPrice" && { card: { price: "asc" } }),
    ...(orderBy === "highPrice" && { card: { price: "desc" } }),
  };

  const cards = await prismaClient.purchase.findMany({
    where,
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: order,
    include: {
      card: true,
    },
  });

  return cards;
};

// 사용자의 구매 내역 총 개수 조회
export const getUserPurchaseCount = async (userId, filters) => {
  const { keyword, grade, genre, isSoldOut } = filters;

  const where = {
    userId,
    card: {
      OR: [
        { name: { contains: keyword, mode: "insensitive" } },
        { description: { contains: keyword, mode: "insensitive" } },
      ],
      ...(grade && { grade }),
      ...(genre && { genre }),
    },
  };

  const totalCount = await prismaClient.purchase.count({ where });
  return totalCount;
};
