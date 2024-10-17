import shopRepository from "../repositorys/shopRepository.js";
import prismaClient from "../utils/prismaClient.js";
import createNotificationFromType from "../utils/notification/createByType.js"; // 알림 생성 유틸리티 임포트

const whereConditions = (userId, keyword) => {
  const where = { userId };
  if (keyword) {
    where.OR = [
      {
        card: {
          name: { contains: keyword, mode: "insensitive" },
        },
      },
    ];
  }
  return where;
};

/* 카드 존재 여부 확인 */
const checkCardExists = async (shopId, cardId) => {
  const shopDetails = await shopRepository.getShopById(shopId, cardId);
  if (!shopDetails) {
    const error = new Error("Card not found");
    error.status = 404;
    throw error;
  }
  return shopDetails;
};

/* 상점에 포토카드 판매 등록 */
const createShopCard = async (data) => {
  // 카드 판매 시, 재고 확인
  if (data.totalCount <= 0) {
    const error = new Error("Total count must be greater than zero");
    error.status = 400;
    throw error;
  }
  // 카드 정보를 가져와서 이미지 URL을 저장
  const originalCard = await prismaClient.card.findUnique({
    where: { id: data.cardId },
  });

  if (!originalCard) {
    const error = new Error("Card not found");
    error.status = 404;
    throw error;
  }

  const newCard = await prismaClient.$transaction(async (prisma) => {
    const card = await prisma.shop.findFirst({
      where: { userId: data.userId, cardId: data.cardId },
    });

    // 판매하려는 수량이 원래 카드의 총 개수 보다 큰지 확인
    if (data.totalCount > originalCard.totalCount) {
      const error = new Error(
        `Cannot sell more than the total count of ${originalCard.totalCount}`
      );
      error.status = 400;
      throw error;
    }

    if (card) {
      const error = new Error("Card already registered in shop");
      error.status = 409;
      error.data = { shopId: card.id };
      throw error; // 중복 카드가 있을 경우 에러 던짐
    }

    // 카드 등록 시, 남은 개수를 판매 등록 수량만큼 감소
    await shopRepository.updateCardRemainingCount(data.cardId, data.totalCount);

    // 포토카드 판매 등록
    const newShopCard = await prisma.shop.create({
      data: {
        userId: data.userId,
        cardId: data.cardId,
        price: data.price,
        totalCount: data.totalCount, // 남아있는 카드 개수 초기화
        exchangeGrade: data.exchangeGrade,
        exchangeGenre: data.exchangeGenre,
        exchangeDescription: data.exchangeDescription,
        remainingCount: data.totalCount,
      },
    });

    // 알림 생성 (등록한 사용자에게 알림)
    await createNotificationFromType(4, {
      shop: {
        userId: data.userId,
        card: originalCard, // 카드 정보 포함
      },
    });

    return newShopCard;
  });

  return newCard;
};

/* 상점에 등록한 포토 카드 상세 조회 */
const getShopByShopId = async (shopId, cardId) => {
  const shopDetails = await shopRepository.getShopById(shopId, cardId);

  // 카드 정보를 가져와서 이미지 URL 포함
  const cardInfo = await prismaClient.card.findUnique({
    where: { id: shopDetails.cardId },
  });

  return {
    ...shopDetails,
    sellerNickname: shopDetails.user.nickname,
    imageUrl: cardInfo.imageUrl, // 카드 테이블에서 이미지 URL 가져옴
  };
};

const getByUserId = async (userId, data) => {
  const { limit, cursor, keyword } = data;
  const where = whereConditions(userId, keyword);
  const shops = await shopRepository.getByUserId({
    where,
    limit,
    cursor,
  });

  if (!shops) {
    const error = new Error("Not Found");
    error.status = 404;
    error.message = "판매내역을 찾을 수 없습니다.";
    throw error;
  }
  //추가적인 데이터가 있는지 확인
  const nextShops = shops.length > limit;
  //추가 데이터가 있다면 커서값을 주고 데이터에서 리미트에 맞춰 돌려준다
  const nextCursor = nextShops ? shops[limit - 1].id : "";

  return {
    list: shops.slice(0, limit),
    nextCursor,
  };
};

/* 판매중인 포토카드 수정 */
const updateShopCard = async (data) => {
  const card = await checkCardExists(data.shopId, data.cardId);

  // 수정 요청을 보낸 사용자 ID와 카드의 소유자 ID 일치 여부 확인
  if (card.userId !== data.userId) {
    const error = new Error("Unauthorized access to this card");
    error.status = 403;
    throw error;
  }

  // 카드 정보를 가져와서 남은 수량 확인
  const cardInfo = await prismaClient.card.findUnique({
    where: { id: card.cardId },
  });

  // 카드 정보가 없는 경우 예외 처리
  if (!cardInfo) {
    throw new Error("Card not found");
  }

  // 새로 추가할 판매 수량
  const newTotalCount = data.totalCount; // 요청한 총 수량

  // 현재 상점 카드의 남은 수량
  const currentRemainingCount = card.remainingCount;

  // 카드테이블에서 잔여수량 감소시
  const decreaseCount = newTotalCount - card.totalCount;

  // 카드테이블에서 잔여수량 추가시
  const additionalCount = card.totalCount - newTotalCount;

  // * 상점의 잔여수량 0인 품절일 때, 수량 추가해서 추가 판매
  if (currentRemainingCount === 0 && cardInfo.remainingCount > 0) {
    // 추가 판매 수량이 카드의 남은 수량을 초과하지 않도록 체크
    if (newTotalCount > cardInfo.remainingCount) {
      throw new Error("최대 기존 카드의 잔여수량만큼만 추가로 팔 수 있습니다.");
    }

    // 카드 테이블의 남은 수량 업데이트
    await prismaClient.card.update({
      where: { id: card.cardId },
      data: { remainingCount: cardInfo.remainingCount - newTotalCount },
    });

    // 상점 카드 정보 업데이트
    await shopRepository.updateShopCard({
      shopId: data.shopId,
      price: data.price,
      totalCount: newTotalCount,
      remainingCount: newTotalCount, // 남은 수량을 총 수량과 동일하게 설정
      exchangeGrade: data.exchangeGrade,
      exchangeGenre: data.exchangeGenre,
      exchangeDescription: data.exchangeDescription,
    });
  } else if (currentRemainingCount !== 0 && newTotalCount > card.totalCount) {
    // * 기존 판매수량에서 추가로 판매하고 싶은 경우

    // 카드 테이블의 잔여수량이 0인 경우
    if (cardInfo.remainingCount === 0) {
      throw new Error("No additional stock is available for sale.");
    }

    // 판매하려는 수량이 기존의 카드 총 수량보다 큰 경우
    if (newTotalCount > cardInfo.totalCount) {
      throw new Error(
        "The maximum quantity that can be registered for sale is the total quantity of the existing card."
      );
    }

    // 카드 테이블의 남은 수량 감소
    await prismaClient.card.update({
      where: { id: card.cardId },
      data: { remainingCount: cardInfo.remainingCount - decreaseCount },
    });

    // 상점 카드 정보 업데이트
    await shopRepository.updateShopCard({
      shopId: data.shopId,
      price: data.price,
      totalCount: newTotalCount,
      remainingCount: card.remainingCount + decreaseCount, // 기존 남은 수량에 추가판매할 수량만큼 더함
      exchangeGrade: data.exchangeGrade,
      exchangeGenre: data.exchangeGenre,
      exchangeDescription: data.exchangeDescription,
    });
  } else if (currentRemainingCount !== 0 && newTotalCount < card.totalCount) {
    // * 판매등록한 카드에서 몇개 안 팔고 싶은 경우

    // 판매수량을 1로 설정한 경우
    if (newTotalCount === 1) {
      // 카드 테이블의 남은 수량 증가(창고로 돌아옴)
      await prismaClient.card.update({
        where: { id: card.cardId },
        data: { remainingCount: cardInfo.remainingCount + additionalCount },
      });
      // 상점 카드 정보 업데이트
      await shopRepository.updateShopCard({
        shopId: data.shopId,
        price: data.price,
        totalCount: newTotalCount,
        remainingCount: newTotalCount, // 기존 남은 수량 1로 수정
        exchangeGrade: data.exchangeGrade,
        exchangeGenre: data.exchangeGenre,
        exchangeDescription: data.exchangeDescription,
      });
    } else {
      // 카드 테이블의 남은 수량 증가(창고로 돌아옴)
      await prismaClient.card.update({
        where: { id: card.cardId },
        data: { remainingCount: cardInfo.remainingCount + additionalCount },
      });

      // 상점 카드 정보 업데이트
      await shopRepository.updateShopCard({
        shopId: data.shopId,
        price: data.price,
        totalCount: newTotalCount,
        remainingCount: card.remainingCount, // 기존 남은 수량 변화 없음
        exchangeGrade: data.exchangeGrade,
        exchangeGenre: data.exchangeGenre,
        exchangeDescription: data.exchangeDescription,
      });
    }
  }

  // 알림 생성
  await createNotificationFromType(6, {
    shop: {
      userId: card.userId,
      card: cardInfo,
    },
  });

  return await shopRepository.updateShopCard(data);
};

/* 판매 중인 포토 카드 취소 */
const deleteShopCard = async (shopId, userId, cardId) => {
  const card = await checkCardExists(shopId, cardId);

  // 삭제 요청을 보낸 사용자 ID와 카드의 소유자 ID 일치 여부 확인
  if (card.userId !== userId) {
    const error = new Error("Unauthorized access to this card");
    error.status = 403;
    throw error;
  }

  // 카드 정보를 가져와 알림 생성
  const cardInfo = await prismaClient.card.findUnique({
    where: { id: card.cardId },
  });

  // 알림 생성
  await createNotificationFromType(5, {
    shop: {
      userId: card.userId,
      card: cardInfo,
    },
  });

  return await shopRepository.deleteShopCard(shopId, userId, cardId);
};

/* 모든 판매중인 포토카드 조회 */
const getAllShop = async () => {
  const shopCards = await prismaClient.shop.findMany({
    include: {
      card: true, // 카드 정보도 포함
      user: { select: { nickname: true } }, // 판매자의 닉네임 정보 포함
    },
  });

  return shopCards.map((shopCard) => ({
    id: shopCard.id,
    userId: shopCard.userId,
    cardId: shopCard.cardId,
    price: shopCard.price,
    totalCount: shopCard.totalCount,
    remainingCount: shopCard.remainingCount,
    exchangeDescription: shopCard.exchangeDescription,
    exchangeGrade: shopCard.exchangeGrade,
    exchangeGenre: shopCard.exchangeGenre,
    user: {
      nickname: shopCard.user.nickname,
    },
    imageUrl: shopCard.card.imageURL, // 카드 테이블에서 이미지 URL 가져옴
    isSoldOut: shopCard.remainingCount === 0 ? "true" : "false", // 품절 상태 추가
  }));
};

export default {
  createShopCard,
  getShopByShopId,
  getByUserId,
  updateShopCard,
  deleteShopCard,
  getAllShop,
};
