import { PrismaClient, Shop, Card, User, Exchange } from "@prisma/client";
import prismaClient from "../utils/prismaClient.js";
import {
  CreateShopCardData,
  UpdateShopCardData,
  Filters,
  PaginationResult,
} from "../interfaces/shop/shopInterfaces.js";

const prisma = new PrismaClient();

// 사용자가 포토카드를 이미 상점에 등록했는지 확인
const getCheckCardById = async (
  userId: number,
  cardId: number
): Promise<Shop | null> => {
  return await prismaClient.shop.findUnique({
    where: {
      userId_cardId: { userId, cardId }, // 복합 고유 키 사용
    },
  });
};

// 상점 카드 생성
const createShopCard = async (data: CreateShopCardData): Promise<Shop> => {
  return await prismaClient.shop.create({
    data: {
      userId: data.userId,
      cardId: data.cardId,
      price: data.price,
      totalCount: data.totalCount,
      remainingCount: data.totalCount,
      exchangeGrade: data.exchangeGrade || "",
      exchangeGenre: data.exchangeGenre || "",
      exchangeDescription: data.exchangeDescription || "",
    },
  });
};

// 카드 잔여 개수 업데이트
const updateCardRemainingCount = async (
  cardId: number,
  decrement: number
): Promise<Card> => {
  return await prismaClient.card.update({
    where: { id: cardId },
    data: { remainingCount: { decrement } },
  });
};

// 상점 아이템 가져오기
const getShopItem = async (id: number): Promise<Shop | null> => {
  return prismaClient.shop.findFirst({
    where: { id },
  });
};

// 상점 카드 상세 정보 조회
const getShopById = async (
  shopId: number
): Promise<
  (Shop & { user: { nickname: string }; card: Partial<Card> }) | null
> => {
  return await prismaClient.shop.findUnique({
    where: { id: shopId },
    include: {
      user: { select: { nickname: true } },
      card: {
        select: {
          name: true,
          genre: true,
          grade: true,
          imageURL: true,
          description: true,
        },
      },
    },
  });
};

// 상점 카드 정보 업데이트
const updateShopCard = async (data: UpdateShopCardData): Promise<Shop> => {
  return await prismaClient.shop.update({
    where: { id: data.shopId },
    data: {
      price: data.price,
      totalCount: data.totalCount,
      remainingCount: data.remainingCount,
      exchangeGrade: data.exchangeGrade,
      exchangeGenre: data.exchangeGenre,
      exchangeDescription: data.exchangeDescription,
    },
  });
};

// 상점 카드 삭제 및 관련 정보 업데이트
const deleteShopCard = async (
  shopId: number,
  userId: number
): Promise<{ deletedShopCard: Shop; updatedCard: Card }> => {
  return await prismaClient.$transaction(async (prisma) => {
    const shopCard = await prisma.shop.findUnique({
      where: { id: shopId },
      include: { card: true, user: true },
    });

    if (!shopCard) throw new Error(`Shop card with ID ${shopId} not found.`);

    if (shopCard.userId !== userId) {
      throw new Error("Unauthorized access to this card");
    }

    const updatedCard = await prisma.card.update({
      where: { id: shopCard.cardId },
      data: { remainingCount: { increment: shopCard.remainingCount } },
    });

    const deletedShopCard = await prisma.shop.delete({
      where: { id: shopId },
    });

    return { deletedShopCard, updatedCard };
  });
};

/* 모든 상점 카드 조회 */
const getAllShopCards = async (
  filters: Filters = {},
  sortOrder: string = "createAt_DESC",
  page: number = 1,
  pageSize: number = 10
): Promise<PaginationResult> => {
  const { search, grade, genre, isSoldOut } = filters;

  const where: any = {
    AND: [
      ...(search ? [{ card: { name: { contains: search } } }] : []),
      ...(grade ? [{ card: { grade } }] : []),
      ...(genre ? [{ card: { genre } }] : []),
      ...(isSoldOut !== undefined
        ? [
            {
              remainingCount: isSoldOut ? 0 : { gt: 0 },
            },
          ]
        : []),
    ],
  };

  const totalCardsCount = await prismaClient.shop.count({ where });

  const shopCards = await prismaClient.shop.findMany({
    where,
    orderBy: [
      ...(sortOrder === "price_DESC" ? [{ price: "desc" }] : []),
      ...(sortOrder === "price_ASC" ? [{ price: "asc" }] : []),
      ...(sortOrder === "createAt_DESC" ? [{ createAt: "desc" }] : []),
      ...(sortOrder === "createAt_ASC" ? [{ createAt: "asc" }] : []),
    ],
    take: pageSize,
    skip: (page - 1) * pageSize,
    include: {
      card: {
        select: {
          name: true,
          genre: true,
          grade: true,
          imageURL: true,
        },
      },
      user: {
        select: {
          nickname: true,
        },
      },
    },
  });

  return {
    totalCards: totalCardsCount,
    currentPage: page,
    totalPages: Math.ceil(totalCardsCount / pageSize),
    cards: shopCards.map(
      (shopCard) =>
        ({
          ...shopCard,
          isSoldOut: shopCard.remainingCount === 0,
        } as any)
    ),
  };
};

// 특정 상점의 교환 정보 조회
const getExchangeByShopId = async (shopId: number): Promise<Exchange[]> => {
  return await prismaClient.exchange.findMany({
    where: { shopId },
    include: {
      user: { select: { id: true, nickname: true } },
      card: {
        select: {
          name: true,
          genre: true,
          grade: true,
          imageURL: true,
          purchasePrice: true,
        },
      },
    },
  });
};

export default {
  getCheckCardById,
  createShopCard,
  getShopById,
  getShopItem,
  updateShopCard,
  deleteShopCard,
  updateCardRemainingCount,
  getAllShopCards,
  getExchangeByShopId,
};
