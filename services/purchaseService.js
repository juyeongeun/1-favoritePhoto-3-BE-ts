import * as purchaseRepository from "../repositorys/purchaseRepository.js";

const createPurchase = async (buyerId, count, shopId) => {
  const cards = await purchaseRepository.createPurchase(buyerId, count, shopId);

  // if (cards) {
  //   // 구매 알림
  //   // 판매 알림
  // }
  // if (cards.remainingCount === 0) {
  //   //품절알림
  //   //교환알림
  // }

  return { cards };
};

export { createPurchase };
