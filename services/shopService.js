import * as shopRepository from "../repositorys/shopRepository.js";
import prismaClient from "../utils/prismaClient.js";

/* 카드 존재 여부 확인 */
const checkCardExists = async (shopId, cardId) => {
  const shopDetails = await shopRepository.getShopById(shopId, cardId);
  if (!shopDetails) {
    const error = new Error("Card not found");
    error.status = 404;
    throw error;
  }
  return shopDetails;
};

/* 상점에 포토카드 판매 등록 */
const createShopCard = async (data) => {
  // 카드 판매 시, 재고 확인
  if (data.totalCount <= 0) {
    const error = new Error("Total count must be greater than zero");
    error.status = 400;
    throw error;
  }

  const newCard = await prismaClient.$transaction(async (prisma) => {
    const card = await prisma.shop.findUnique({
      where: { userId_cardId: { userId: data.userId, cardId: data.cardId } },
    });

    // 판매하려는 수량이 원래 카드의 총 개수 보다 큰지 확인
    const originalCard = await prisma.card.findUnique({
      where: { id: data.cardId },
    });

    if (data.totalCount > originalCard.totalCount) {
      const error = new Error(
        `Cannot sell more than the total count of ${originalCard.totalCount}`
      );
      error.status = 400;
      throw error;
    }

    if (card) {
      const error = new Error("Card already registered in shop");
      error.status = 409;
      error.data = { shopId: card.id };
      throw error; // 중복 카드가 있을 경우 에러 던짐
    }

    return await prisma.shop.create({
      data: {
        ...data,
        remainingCount: data.totalCount, // 남아있는 카드 개수 초기화
      },
    });
  });

  return newCard;
};

/* 상점에 등록한 포토 카드 상세 조회 */
const getShopByShopId = async (shopId, cardId) => {
  const shopDetails = await shopRepository.getShopById(shopId, cardId);
  return {
    ...shopDetails,
    sellerNickname: shopDetails.user.nickname,
  };
};

/* 판매중인 포토카드 수정 */
const updateShopCard = async (data) => {
  const card = await checkCardExists(data.shopId, data.cardId);

  // 수정 요청을 보내는 사용자 ID와 카드의 소유자 ID 일치 여부 확인
  if (card.userId !== data.userId) {
    const error = new Error("Unauthorized access to this card");
    error.status = 403;
    throw error;
  }

  return await shopRepository.updateShopCard(data);
};

/* 판매 중인 포토 카드 취소 */
const deleteShopCard = async (shopId, userId, cardId) => {
  const card = await checkCardExists(shopId, cardId);

  // 삭제 요청을 보낸 사용자 ID와 카드의 소유자 ID 일치 여부 확인
  if (card.userId !== userId) {
    const error = new Error("Unauthorized access to this card");
    error.status = 403;
    throw error;
  }

  return await shopRepository.deleteShopCard(shopId, userId, cardId);
};

export { createShopCard, getShopByShopId, updateShopCard, deleteShopCard };
