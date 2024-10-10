import * as shopRepository from "../repositorys/shopRepository.js";

export const createShopCard = async (data) => {
  const card = await shopRepository.getCheckCardById(data.userId, data.cardId);
  if (card) {
    const error = new Error("Card already registered in shop");
    error.status = 409;
    error.data = { shopId: card.id };
    throw error;
  }

  const newCard = await shopRepository.createShopCard({
    ...data,
    remainingCount: data.totalCount, // remainingCount 추가
  });

  return newCard;
};

export const getShopCards = async (filters) => {
  const cards = await shopRepository.getShopCards(filters);
  const totalCount = await shopRepository.getShopCardCount(filters);

  const cardsWithSoldOutFlag = cards.map((card) => ({
    ...card,
    isSoldOut: card.remainingCount === 0,
  }));

  return { cards: cardsWithSoldOutFlag, totalCount };
};

export const getShopCardByShopId = async (shopId) => {
  const card = await shopRepository.getShopCardByShopId(shopId);
  if (!card) {
    const error = new Error("Card not found");
    error.status = 404;
    throw error;
  }
  return card;
};

export const updateShopCard = async (data) => {
  return await shopRepository.updateShopCard(data);
};

export const deleteShopCard = async (shopId) => {
  return await shopRepository.deleteShopCard(shopId);
};

export const purchaseShopCard = async (data) => {
  return await shopRepository.purchaseShopCard(data);
};
