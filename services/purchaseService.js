import * as purchaseRepository from "../repositorys/purchaseRepository.js";

const createPurchase = async (buyerId, count, shopId) => {
  const cards = await purchaseRepository.createPurchase(buyerId, count, shopId);

  // if (cards) {
  //   // 구매 알림
  //   // 판매 알림
  // }
  // if (cards.remainingCount === 0) {
  //   //품절알림 -> 구매자
  //   //교환알림 -> exchange 테이블 직접 접근
  // }

  return { cards };
};

export { createPurchase };
