import prismaClient from "../utils/prismaClient.js";

const createCard = async (data) => {
  return await prismaClient.card.create({ data });
};

const updateCard = async (data) => {
  const card = await prismaClient.card.findUnique({
    where: { id: data.id },
  });

  if (!card) {
    throw new Error("카드를 찾을 수 없습니다.");
  }

  // 요청한 `userId`가 카드의 `userId`와 일치하는지 검증
  if (card.userId !== data.userId) {
    throw new Error(
      "권한이 없습니다. 다른 사용자의 카드를 수정할 수 없습니다."
    );
  }

  // `id` 필드를 기준으로 업데이트 수행
  return await prismaClient.card.update({
    where: { id: data.id }, // `id` 필드만 사용하여 업데이트
    data: { remainingCount: data.remainingCount }, // 업데이트할 필드만 지정
  });
};

export { createCard, updateCard };
