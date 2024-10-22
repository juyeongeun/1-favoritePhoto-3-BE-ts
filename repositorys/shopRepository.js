import prismaClient from "../utils/prismaClient.js";

// 사용자가 포토카드를 이미 상점에 등록했는지 확인
const getCheckCardById = async (userId, cardId) => {
  return await prismaClient.shopCard.findUnique({
    where: {
      userId_cardId: { userId, cardId }, // 복합 고유 키 사용
    },
  });
};

// 상점 카드 생성
const createShopCard = async (data) => {
  return await prismaClient.shop.create({
    data: {
      ...data,
      exchangeGrade: data.exchangeGrade,
      exchangeGenre: data.exchangeGenre,
      exchangeDescription: data.exchangeDescription,
    },
  });
};

// 카드 잔여 개수 업데이트
const updateCardRemainingCount = async (cardId, decrement) => {
  return await prismaClient.card.update({
    where: { id: cardId },
    data: { remainingCount: { decrement } },
  });
};

const getShopItem = async (id) => {
  return prismaClient.shop.findFirst({
    where: {
      id,
    },
  });
};

// 상점 카드 상세 정보 조회
const getShopById = async (shopId) => {
  return await prismaClient.shop.findUnique({
    where: { id: shopId },
    include: {
      user: { select: { nickname: true } }, // 판매자의 닉네임 정보 포함
      card: {
        select: {
          name: true, // 카드 이름
          genre: true, // 카드 장르
          grade: true, // 카드 등급
          imageURL: true, // 카드 이미지 URL
          description: true, // 카드 설명
        },
      },
    },
  });
};

// 상점 카드 정보 업데이트
const updateShopCard = async (data) => {
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
const deleteShopCard = async (shopId, userId) => {
  return await prismaClient.$transaction(async (prisma) => {
    const shopCard = await prisma.shop.findUnique({
      where: { id: shopId },
      include: { card: true, user: true },
    });

    // 상점 카드가 없는 경우 에러 발생
    if (!shopCard) throw new Error(`Shop card with ID ${shopId} not found.`);

    // 삭제 요청을 보낸 사용자 ID와 카드의 소유자 ID 일치 여부 확인
    if (shopCard.userId !== userId) {
      throw new Error("Unauthorized access to this card");
    }

    // 카드 남은 수량 업데이트
    const updatedCard = await prisma.card.update({
      where: { id: shopCard.cardId },
      data: { remainingCount: { increment: shopCard.remainingCount } },
    });

    // 상점 카드 삭제
    const deletedShopCard = await prisma.shop.delete({
      where: { id: shopId },
    });

    return { deletedShopCard, updatedCard }; // 삭제된 카드 정보 반환
  });
};

//전체 카운트

/* 모든 상점 카드 조회 */
const getAllShop = async (
  filters = {},
  sortOrder = "createAt_DESC",
  page = 1, // 페이지 번호
  pageSize = 10
) => {
  const { search, grade, genre, isSoldOut } = filters;

  // 기본 where 조건 객체 생성
  const where = {
    ...(search && { card: { name: { contains: search } } }),
    ...(grade && { card: { grade } }),
    ...(genre && { card: { genre } }),
    ...(isSoldOut !== undefined && {
      remainingCount: isSoldOut === "true" ? 0 : { gt: 0 },
    }),
  };

  // 전체 상점 카드 수를 조회
  const totalCardsCount = await prismaClient.shop.count({
    where: Object.keys(where).length > 0 ? where : {},
  });

  // 페이지네이션에 따라 카드 조회
  const shopCards = await prismaClient.shop.findMany({
    where: Object.keys(where).length > 0 ? where : {}, // 필터링 조건에 따라 카드 조회
    orderBy: {
      [sortOrder.split("_")[0]]: sortOrder.endsWith("_DESC") ? "desc" : "asc",
    },
    take: pageSize, // 페이지당 가져올 데이터 수
    skip: (page - 1) * pageSize, // 페이지에 따라 건너뛰기
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

  // 현재 페이지의 카드 개수를 기준으로 반환
  return {
    totalCards: totalCardsCount,
    currentPage: page,
    totalPages: Math.ceil(totalCardsCount / pageSize),
    cards: shopCards.map((shopCard) => ({
      ...shopCard,
      isSoldOut: shopCard.remainingCount === 0,
    })),
  };
};

const getExchangeByShopId = async (shopId) => {
  const shopDetails = await prismaClient.exchange.findMany({
    where: { shopId: shopId },
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
  return shopDetails;
};

export default {
  getCheckCardById,
  createShopCard,
  getShopById,
  getShopItem,
  updateShopCard,
  deleteShopCard,
  updateCardRemainingCount,
  getAllShop,
  getExchangeByShopId,
};
