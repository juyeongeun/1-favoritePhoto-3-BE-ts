//services\shopService.js
import * as shopRepository from "../repositorys/shopRepository.js";
import prismaClient from "../utils/prismaClient.js";

/* 상점에 포토카드 판매 등록 */
const createShopCard = async (data) => {
  const start = performance.now();
  console.log("Starting createShopCard");

  // 카드 판매 시, 재고 확인
  if (data.totalCount <= 0) {
    const error = new Error("Total count must be greater than zero");
    error.status = 400;
    throw error;
  }

  const newCard = await prismaClient.$transaction(async (prisma) => {
    // 이미 상점에 등록된 카드인지 확인
    const card = await prisma.shop.findUnique({
      where: { userId_cardId: { userId: data.userId, cardId: data.cardId } },
    });

    if (card) {
      const error = new Error("Card already registered in shop");
      error.status = 409;
      error.data = { shopId: card.id };
      throw error; // 중복 카드가 있을 경우 에러 던짐
    }

    // 새로운 카드 등록
    return await prisma.shop.create({
      data: {
        ...data,
        remainingCount: data.totalCount, // 남아있는 카드 개수 초기화
      },
    });
  });

  const end = performance.now();
  console.log(`createShopCard execution time: ${end - start}ms`);

  return newCard;
};

/* 상점에 등록한 포토 카드 상세 조회 */
const getShopByShopId = async (shopId, cardId) => {
  console.log(`Fetching shop details for shopId: ${shopId}, cardId: ${cardId}`);
  const shopDetails = await shopRepository.getShopById(shopId, cardId);

  // 판매자 정보 포함하여 반환
  return {
    ...shopDetails,
    sellerNickname: shopDetails.user.nickname,
  };
};

/* 판매중인 포토카드 수정 */
const updateShopCard = async (data) => {
  // 판매 중인 상점에 해당 카드가 등록되어 있는지 확인
  const card = await shopRepository.getShopById(data.shopId, data.cardId);

  // 카드가 없는 경우
  if (!card) {
    const error = new Error("Card not found");
    error.status = 404;
    throw error;
  }

  // 수정 요청을 보내는 사용자 ID와 카드의 소유자 ID 일치 여부 확인
  if (card.userId !== data.userId) {
    const error = new Error("Unauthorized access to this card");
    error.status = 403;
    throw error;
  }

  // 업데이트 호출
  return await shopRepository.updateShopCard(data);
};

/* 판매 중인 포토 카드 취소 */
const deleteShopCard = async (shopId, userId) => {
  // 판매 중인 상점에 해당 카드가 등록되어 있는지 확인
  const card = await shopRepository.getShopById(shopId);

  // 카드가 없는 경우
  if (!card) {
    const error = new Error("Card not found");
    error.status = 404;
    throw error;
  }

  // 삭제 요청을 보낸 사용자 ID와 카드의 소유자 ID 일치 여부 확인
  if (card.userId !== userId) {
    const error = new Error("Unauthorized access to this card");
    error.status = 403;
    throw error;
  }

  // 카드 삭제 후, 삭제 결과 반환
  return await shopRepository.deleteShopCard(shopId);
};

export { createShopCard, getShopByShopId, updateShopCard, deleteShopCard };
