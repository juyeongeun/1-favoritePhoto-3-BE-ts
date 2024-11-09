import purchaseRepository from "../repositorys/purchaseRepository.js";
import createNotificationFromType from "../utils/notification/createByType.js";
import prismaClient from "../utils/prismaClient.js";

const createPurchase = async (buyerId, count, shopId) => {
  // 구매 및 상점 업데이트 처리
  const purchase = await purchaseRepository.createPurchase(
    buyerId,
    count,
    shopId
  );

  if (!purchase) {
    throw new Error("Purchase creation failed.");
  }

  // 구매 성공 알림을 생성하는 함수
  const sendNotification = async (type, payload) => {
    await createNotificationFromType(type, { purchase: payload });
  };

  const notificationPromises = [];

  // 구매자 알림 (구매 성공)
  notificationPromises.push(
    sendNotification(7, {
      userId: buyerId,
      card: purchase.card,
      count: count,
    })
  );

  // 판매자 알림 (판매 성공)
  const consumer = await prismaClient.user.findUnique({
    where: { id: buyerId },
    select: { nickname: true },
  });

  if (!consumer) {
    throw new Error("Buyer information retrieval failed.");
  }

  notificationPromises.push(
    sendNotification(8, {
      consumer: consumer.nickname,
      userId: purchase.userId,
      card: purchase.card,
      count: count,
    })
  );

  // 품절 알림 (구매자에게) 및 교환 알림 처리
  if (purchase.remainingCount === 0) {
    // 판매자 품절 알림 추가
    notificationPromises.push(
      sendNotification(9, {
        userId: purchase.userId,
        card: purchase.card,
      })
    );

    // 교환 요청자에게 교환 알림 추가
    const exchangeRequests = await prismaClient.exchange.findMany({
      where: {
        shopId: shopId,
        isApprove: true,
      },
      select: {
        userId: true,
      },
    });

    exchangeRequests.map((exchange) => {
      notificationPromises.push(
        sendNotification(9, {
          userId: exchange.userId,
          card: purchase.card,
        })
      );
    });
  }

  // 알림을 병렬로 처리
  await Promise.all(notificationPromises);

  return { purchase };
};

export default { createPurchase };
