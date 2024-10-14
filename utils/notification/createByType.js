const switchingType = (type, exchange) => {
  const { user: consumer, shop } = exchange;
  switch (type) {
    case 1: //교환제안 판매자에게
      return {
        type: "교환제안",
        content: `${consumer.nickname}님이 [${shop.card.grade} | ${shop.card.name}]의 포토 카드 교환 제안을 했습니다.`,
      };
    case 2: //교환승인 구매자에게
      return {
        type: "교환승인",
        content: `${shop.user.nickname}님과의 [${shop.card.grade} | ${shop.card.name}]의 포토 카드 교환이 성사되었습니다.`,
      };
    case 3: //교환거절 구매자에게
      return {
        type: "교환거절",
        content: `${shop.user.nickname}님과의 [${shop.card.grade} | ${shop.card.name}]의 포토 카드 교환이 거절되었습니다.`,
      };
    case 4: // 판매성사 시, 구매자에게
      return {
        type: "구매완료",
        content: `[${shop.card.grade} | ${shop.card.name}] (구매한 개수)장을 성공적으로 구매했습니다.`,
      };
    case 5: // 판매성사 시, 판매자에게
      return {
        type: "판매완료",
        content: `(구매자)님이 [${shop.card.grade} | ${shop.card.name}]을 (구매한 개수)장 구매했습니다.`,
      };
    case 6: // 포토 카드 품절
      return {
        type: "품절",
        content: `[${shop.card.grade} | ${shop.card.name}]이 품절되었습니다.`,
      };
    case 7: // 포토카드 판매 등록시, 사용자에게
      return {
        type: "등록완료",
        content: `[${card.grade} | ${card.name}]가 성공적으로 등록되었습니다.`,
      };
    case 7: // 포토카드 판매 취소시, 사용자에게
      return {
        type: "등록완료",
        content: `[${shop.card.grade} | ${shop.card.name}]의 판매가 성공적으로 취소되었습니다.`,
      };
  }
};

const createNotificationFromType = async (userId, type, exchange) => {
  try {
    const { content } = switchingType(type, exchange);
    const notification = await notificationRepository.createNotification({
      userId,
      content,
    });
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
