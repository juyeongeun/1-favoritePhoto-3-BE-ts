import * as shopRepository from "../repositorys/shopRepository.js";

/* 상점에 포토카드 판매 등록 */
export const createShopCard = async (data) => {
  // 카드 판매 시, 재고 확인
  if (data.totalCount <= 0) {
    const error = new Error("Total count must be greater than zero");
    error.status = 400;
    throw error;
  }

  // 이미 상점에 등록된 카드인지 확인
  const card = await shopRepository.getCheckCardById(data.userId, data.cardId);
  // 등록되어있는 카드인 경우
  if (card) {
    const error = new Error("Card already registered in shop");
    error.status = 409;
    error.data = { shopId: card.id };
    throw error;
  }

  // 새로운 카드 등록
  const newCard = await shopRepository.createShopCard({
    ...data,
    remainingCount: data.totalCount, // remainingCount 추가 (남아있는 카드 개수 초기화)
  });

  return newCard;
};

/* 상점에 등록한 포토 카드 전체 리스트 조회 */
export const getShopCards = async (filters) => {
  const cards = await shopRepository.getShopCards(filters);
  const totalCount = await shopRepository.getShopCardCount(filters);

  const cardsWithSoldOutFlag = cards.map((card) => ({
    ...card,
    isSoldOut: card.remainingCount === 0,
  }));

  return { cards: cardsWithSoldOutFlag, totalCount };
};

/* 상점에 등록한 포토 카드 상세 조회 */
export const getShopCardByShopId = async (cardId) => {
  const card = await shopRepository.getShopCardById(cardId);

  // 등록된 카드 없는 경우
  if (!card) {
    const error = new Error("Card not found");
    error.status = 404;
    throw error;
  }

  // 판매자 정보 포함하여 반환
  const user = await shopRepository.getUserById(card.userId);
  return {
    ...card,
    sellerNickname: user.nickname, // 판매자 닉네임 추가
    genre: card.card.genre, // 장르 추가
    grade: card.card.grade, // 등급 추가
  };
};

export const updateShopCard = async (data) => {
  return await shopRepository.updateShopCard(data);
};

export const deleteShopCard = async (shopId) => {
  return await shopRepository.deleteShopCard(shopId);
};

export const purchaseShopCard = async (data) => {
  const { shopId, count } = data;

  // 카드 정보 조회
  const shopCard = await shopRepository.getShopCardById(shopId);

  if (!shopCard || shopCard.remainingCount < count) {
    const error = new Error("Not enough stock available");
    error.status = 400;
    throw error;
  }

  // 구매 처리
  const result = await shopRepository.purchaseShopCard(data);

  // 판매 포토카드 수 재고 차감
  await shopRepository.updateRemainingCount(
    shopId,
    shopCard.remainingCount - count
  );

  return result;
};

// 카드 판매 히스토리 조회
export const getPurchaseHistoryByCardId = async (cardId) => {
  return await shopRepository.getPurchaseHistory(cardId);
};
