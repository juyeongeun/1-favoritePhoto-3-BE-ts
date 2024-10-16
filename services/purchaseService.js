import purchaseRepository from "../repositorys/purchaseRepository.js";
import createNotificationFromType from "../utils/notification/createByType.js";
import prismaClient from "../utils/prismaClient.js";

const createPurchase = async (buyerId, count, shopId) => {
  const purchase = await purchaseRepository.createPurchase(
    buyerId,
    count,
    shopId
  );

  if (purchase) {
    const consumer = await prismaClient.user.findUnique({
      where: { id: buyerId },
      select: { nickname: true },
    });
    // 구매 성공 알림 생성

    // 구매자 알림 (구매 성공)
    await createNotificationFromType(7, {
      purchase: {
        userId: buyerId,
        card: purchase.card,
        count: count,
      },
    });

    // 판매자 알림 (판매 성공)
    await createNotificationFromType(8, {
      purchase: {
        consumer: consumer.nickname,
        userId: purchase.userId,
        card: purchase.card,
        count: count,
      },
    });
  }

  if (purchase.remainingCount === 0) {
    // 품절 알림 (구매자에게)
    await createNotificationFromType(9, {
      purchase: {
        userId: purchase.userId,
        card: purchase.card,
      },
    });

    // 교환 알림 (교환 요청자가 있는 경우)
    const exchangeRequests = await prismaClient.exchange.findMany({
      where: {
        shopId: shopId,
        isApprove: false,
      },
      include: {
        Shop: true,
      },
    });

    await Promise.all(
      exchangeRequests.map((exchange) =>
        createNotificationFromType(9, {
          purchase: {
            userId: exchange.userId,
            card: purchase.card,
          },
        })
      )
    );
  }

  return { purchase };
};

export default { createPurchase };
