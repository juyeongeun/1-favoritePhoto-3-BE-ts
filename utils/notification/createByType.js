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
    case 3: //교환거절
      return "등록하신 상품의 교환 신청이 있습니다.";
    case 4:
      return "등록하신 상품의 교환 신청이 있습니다.";
    case 5:
      return "등록하신 상품의 교환 신청이 있습니다.";
  }
};

const createNotificationFromType = async (userId, type, exchange) => {
  try {
    const notification = await notificationRepository.createNotification({
      userId,
      content: "등록하신 상품의 교환 신청이 있습니다",
    });
  } catch (error) {
    error.status = 500;
    error.data = {
      message: "알림 생성에 실패 했습니다.",
    };
    throw error;
  }
};

export default createNotificationFromType;
