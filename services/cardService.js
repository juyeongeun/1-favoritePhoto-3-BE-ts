import cardRepository from "../repositorys/cardRepository.js";

const whereConditions = (userId, keyword) => {
  const where = { userId };
  if (keyword) {
    where.OR = [
      {
        name: { contains: keyword, mode: "insensitive" },
      },
    ];
  }
  return where;
};

//나의 카드조회
const getByUserId = async (userId, data) => {
  const { limit, cursor, keyword } = data;
  const where = whereConditions(userId, keyword);
  const cards = await cardRepository.getByUserId({
    where,
    limit,
    cursor,
  });

  if (!cards) {
    const error = new Error("Not Found");
    error.status = 404;
    error.message = "카드내역을 찾을 수 없습니다.";
    throw error;
  }
  //추가적인 데이터가 있는지 확인
  const nextCards = cards.length > limit;
  //추가 데이터가 있다면 커서값을 주고 데이터에서 리미트에 맞춰 돌려준다
  const nextCursor = nextCards ? cards[limit - 1].id : "";

  return {
    list: cards.slice(0, limit),
    nextCursor,
  };
};

// 카드 생성
const createCard = async (data) => {
  return await cardRepository.createCard(data);
};

export default { createCard, getByUserId };
