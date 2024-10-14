import * as purchaseRepository from "../repositorys/purchaseRepository.js";
import createNotificationFromType from "../utils/notification/createByType.js";
import prismaClient from "../utils/prismaClient.js";

const createPurchase = async (buyerId, count, shopId) => {
  const shop = await purchaseRepository.createPurchase(buyerId, count, shopId);

  if (shop) {
    // 구매 성공 알림 생성

    // 구매자 알림 (구매 성공)
    await createNotificationFromType(7, {
      userId: buyerId,
      shop,
    });

    // 판매자 알림 (판매 성공)
    await createNotificationFromType(8, {
      userId: shop.userId,
      shop,
    });
  }

  if (shop.remainingCount === 0) {
    // 품절 알림 (구매자에게)
    await createNotificationFromType(9, {
      userId: shop.userId,
      shop,
    });

    // 교환 알림 (교환 요청자가 있는 경우)
    const exchangeRequests = await prismaClient.exchange.findMany({
      where: {
        shopId: shopId,
        isApprove: false,
      },
      include: {
        shop: true,
      },
    });

    await Promise.all(
      exchangeRequests.map((exchange) =>
        createNotificationFromType(9, {
          userId: exchange.userId,
          shop,
        })
      )
    );
  }

  return { shop };
};

export { createPurchase };
