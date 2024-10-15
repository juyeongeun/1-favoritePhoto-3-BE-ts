import notificationRepository from "../../repositorys/notificationRepository.js";

const switchingType = (type, exchange) => {
  const { user: consumer, userId: consumerId, shop } = exchange;

  switch (type) {
    case 1: //교환제안 판매자에게
      return {
        userId: shop.userId,
        type: "교환제안",
        content: `${consumer.nickname}님이 [${shop.card.grade} | ${shop.card.name}]의 포토 카드 교환 제안을 했습니다.`,
      };
    case 2: //교환승인 구매자에게
      return {
        userId: consumerId,
        type: "교환승인",
        content: `${shop.user.nickname}님과의 [${shop.card.grade} | ${shop.card.name}]의 포토 카드 교환이 성사되었습니다.`,
      };
    case 3: //교환거절 구매자에게
      return {
        userId: consumerId,
        type: "교환거절",
        content: `${shop.user.nickname}님과의 [${shop.card.grade} | ${shop.card.name}]의 포토 카드 교환이 거절되었습니다.`,
      };
    case 4: //교환승인후 품절이라면 교환을 제안한 모든 사람에게
      return {
        userId: consumerId,
        type: "품절",
        content: `${shop.user.nickname}님과의 [${shop.card.grade} | ${shop.card.name}]의 포토 카드 교환이 거절되었습니다.(품절)`,
      };
  }
};

/* 상점 관련 알림 */
const switchingTypeForShop = (type, shop) => {
  const { userId, card } = shop; // userId는 판매자 ID, card는 카드 정보

  switch (type) {
    case 4: // 포토카드 판매 등록시, 사용자에게
      return {
        userId,
        type: "등록완료",
        content: `[${card.grade} | ${card.name}]이 성공적으로 등록되었습니다.`,
      };
    case 5: // 포토카드 판매 취소시, 사용자에게
      return {
        userId,
        type: "판매취소",
        content: `[${card.grade} | ${card.name}]의 판매가 취소되었습니다.`,
      };
    case 6: // 판매중인 포토카드 수정, 사용자에게
      return {
        userId,
        type: "카드수정",
        content: `[${card.grade} | ${card.name}]이 수정되었습니다.`,
      };
    case 7: // 포토 카드 품절시, 판매자에게 > 이거 구매쪽에서 가져다 알림 추가하시면 될거같아요!
      return {
        userId,
        type: "품절",
        content: `[${card.grade} | ${card.name}]가 모두 판매되어 품절되었습니다.`,
      };
  }
};

/* 포인트 알림 */
const createPointNotification = (userId, nickname, point) => {
  return {
    userId: userId, // 사용자의 ID
    type: "포인트획득",
    content: `${nickname}님이 ${point} 포인트를 획득하였습니다.`,
  };
};

// 판매성사 시, 구매자에게
//  case 4:
// return {
//   userId: consumerId,
//   type: "구매완료",
//   content: `[${shop.card.grade} | ${shop.card.name}] (구매한 개수)장을 성공적으로 구매했습니다.`,
// };
// // 판매성사 시, 판매자에게
// case 5:
// return {
//   userId: shop.userId,
//   type: "판매완료",
//   content: `(구매자)님이 [${shop.card.grade} | ${shop.card.name}]을 (구매한 개수)장 구매했습니다.`,
// };

const createNotificationFromType = async (type, data) => {
  try {
    var notificationData;
    if (data.exchange) {
      // 교환 관련 알림 처리
      notificationData = switchingType(type, data.exchange);
    } else if (type === "포인트획득") {
      const { userId, nickname, point } = data;
      notificationData = createPointNotification(userId, nickname, point);
    } else {
      notificationData = switchingTypeForShop(type, data.shop);
    }
    const notification = await notificationRepository.createNotification(
      notificationData
    );

    return notification;
  } catch (error) {
    error.status = 500;
    error.data = {
      message: "알림 생성에 실패 했습니다.",
    };
    throw error;
  }
};

export default createNotificationFromType;
