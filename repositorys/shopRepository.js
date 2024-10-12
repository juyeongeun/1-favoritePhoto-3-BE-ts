//repositorys\shopRepository.js
import prismaClient from "../utils/prismaClient.js";

// 사용자가 포토카드를 이미 상점에 등록했는지 확인
const getCheckCardById = async (userId, cardId) => {
  return await prismaClient.shopCard.findUnique({
    where: {
      userId_cardId: { userId, cardId }, // 복합 고유 키 사용
    },
  });
};

// 상점 카드 생성
const createShopCard = async (data) => {
  return await prismaClient.shop.create({
    data: {
      ...data,
      exchangeGrade: data.exchangeGrade, // 교환 희망 등급
      exchangeGenre: data.exchangeGenre, // 교환 희망 장르
      exchangeDescription: data.exchangeDescription, // 교환 희망 설명
    },
  });
};

// 상점 카드 상세 정보 조회
const getShopById = async (shopId, cardId) => {
  const shopDetails = await prismaClient.shop.findUnique({
    where: { id: shopId }, // 상점 카드 ID로 검색
    include: {
      user: { select: { nickname: true } }, // 판매자 정보에서 닉네임만 포함
    },
  });

  // 상점이 존재하지 않는 경우
  if (!shopDetails) {
    throw new Error(`Shop with ID ${shopId} not found.`);
  }

  // shopDetails의 구조를 로그로 출력
  console.log(shopDetails);

  // 카드가 존재하는지 확인
  const card = await prismaClient.card.findUnique({
    where: { id: cardId },
  });

  if (!card) {
    throw new Error(`Card with ID ${cardId} not found.`);
  }

  // 필요한 정보만 포함하여 응답
  return {
    id: shopDetails.id,
    createAt: shopDetails.createAt,
    updateAt: shopDetails.updateAt,
    userId: shopDetails.userId,
    cardId: shopDetails.cardId,
    price: shopDetails.price,
    totalCount: shopDetails.totalCount,
    remainingCount: shopDetails.remainingCount,
    exchangeDescription: shopDetails.exchangeDescription,
    exchangeGrade: shopDetails.exchangeGrade,
    exchangeGenre: shopDetails.exchangeGenre,
    user: {
      nickname: shopDetails.user.nickname,
    },
  };
};

// 상점 카드 정보 업데이트
const updateShopCard = async (data) => {
  return await prismaClient.shop.update({
    where: { id: data.shopId },
    data: {
      price: data.price,
      totalCount: data.totalCount,
      exchangeGrade: data.exchangeGrade,
      exchangeGenre: data.exchangeGenre,
      exchangeDescription: data.exchangeDescription,
    },
  });
};

// 상점 카드 삭제 및 관련 정보 업데이트 (트랜잭션 사용)
const deleteShopCard = async (shopId, userId) => {
  return await prismaClient.$transaction(async (prisma) => {
    // 상점 카드 정보 조회
    const shopCard = await prisma.shop.findUnique({
      where: { id: shopId },
      include: { card: true, user: true },
    });

    // 카드가 존재하지 않으면
    if (!shopCard) throw new Error(`Shop card with ID ${shopId} not found.`);

    // 카드를 삭제하는 사용자가 해당 카드의 소유자인지 확인
    if (shopCard.userId !== userId) {
      throw new Error("Unauthorized access to this card");
    }

    // 카드의 남은 개수를 업데이트
    const updatedCard = await prisma.card.update({
      where: { id: shopCard.cardId },
      data: { remainingCount: { increment: shopCard.remainingCount } },
    });

    // 카드 정보를 데이터베이스에서 삭제
    const deletedShopCard = await prisma.shop.delete({
      where: { id: shopId }, // 삭제할 카드 ID
    });

    // 삭제된 카드에 대한 알림 생성(추후 수정예정)
    await prisma.notification.create({
      data: {
        content: `당신의 [${shopCard.card.grade} | ${shopCard.card.name}이 판매 취소되었습니다.`,
        userId: shopCard.userId, // 삭제된 카드의 소유자 ID
      },
    });

    return { deletedShopCard, updatedCard };
  });
};

export {
  getCheckCardById,
  createShopCard,
  getShopById,
  updateShopCard,
  deleteShopCard,
};
