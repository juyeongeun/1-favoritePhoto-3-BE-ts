import prismaClient from "../utils/prismaClient.js";

// 사용자 구매
const createPurchase = async (buyerId, count, shopId) => {
  // 상점 정보 및 재고 확인
  const shopInfo = await prismaClient.shop.findFirst({
    where: {
      id: shopId,
      remainingCount: { gt: 0 },
    },
    include: { card: true, user: true },
  });

  if (!shopInfo) throw new Error("Shop not found or out of stock.");

  const totalPrice = shopInfo.price * count;

  // 구매자 정보 확인
  const buyer = await prismaClient.user.findUnique({
    where: { id: buyerId },
  });

  if (!buyer) throw new Error("Buyer not found.");
  if (shopInfo.remainingCount < count) throw new Error("Insufficient stock.");
  if (buyer.point < totalPrice) throw new Error("Not enough Points");

  // 트랜잭션으로 묶어서 작업 진행
  const result = await prismaClient.$transaction(async (prisma) => {
    // 구매자 포인트 차감 및 판매자 포인트 증가
    await prisma.user.updateMany([
      {
        where: { id: buyerId },
        data: { point: { decrement: totalPrice } },
      },
      {
        where: { id: shopInfo.user.id },
        data: { point: { increment: totalPrice } },
      },
    ]);

    // 상점 재고 업데이트
    await prisma.shop.update({
      where: { id: shopId },
      data: { remainingCount: { decrement: count } },
    });

    // 판매자 카드 재고 업데이트
    await prisma.card.update({
      where: { id: shopInfo.card.id },
      data: { remainingCount: { decrement: count } },
    });

    // 구매자에게 새로운 카드 생성
    const newCard = await prisma.card.create({
      data: {
        userId: buyerId,
        remainingCount: count,
        totalCount: count,
        purchasePrice: shopInfo.price,
        grade: shopInfo.card.grade,
        genre: shopInfo.card.genre,
        description: shopInfo.card.description,
        imageURL: shopInfo.card.imageURL,
        name: shopInfo.card.name,
      },
    });

    // 구매 기록 생성
    await prisma.purchase.create({
      data: {
        cardId: newCard.id,
        userId: buyerId,
      },
    });

    return newCard;
  });

  return result;
};

export { createPurchase };
