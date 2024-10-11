import * as purchaseRepository from "../repositorys/purchaseRepository.js";

const getPurchaseHistory = async (userId, filters) => {
  const cards = await purchaseRepository.getUserPurchase(userId, filters);
  const totalCount = await purchaseRepository.getUserPurchaseCount(
    userId,
    filters
  );
  return { cards, totalCount };
};

export { getPurchaseHistory };
