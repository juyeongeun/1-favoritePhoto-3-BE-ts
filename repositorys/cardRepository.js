import prismaClient from "../utils/prismaClient.js";

export const createCard = async (data) => {
  return await prismaClient.card.create({ data });
};

export const getUserCards = async (filters) => {
  const { userId, keyword, grade, genre, orderBy, cursor, limit, isSoldOut } =
    filters;

  // Prisma `findMany` 메서드의 where 조건 구성
  const where = {
    userId: userId, // 로그인된 사용자 ID로 필터링
    ...(keyword && {
      OR: [
        { name: { contains: keyword, mode: "insensitive" } },
        { description: { contains: keyword, mode: "insensitive" } },
      ],
    }), // 검색어가 카드 이름 또는 설명에 포함된 항목 필터링
    ...(grade && { grade }), // 등급으로 필터링 (단일 선택만 가능)
    ...(genre && { genre }), // 장르로 필터링 (단일 선택만 가능)
    ...(isSoldOut !== undefined && {
      remainingCount: isSoldOut ? 0 : { gt: 0 },
    }), // 매진 여부 필터링 (true/false 단일 값)
  };

  // 정렬 조건 구성
  const order = {
    ...(orderBy === "recent" && { createAt: "desc" }),
    ...(orderBy === "old" && { createAt: "asc" }),
  };

  // 페이지네이션: 커서 위치 설정
  const cursorOption = cursor ? { id: parseInt(cursor) } : undefined;

  // Prisma의 `findMany` 메서드로 데이터 조회
  const cards = await prismaClient.card.findMany({
    where,
    orderBy: order,
    take: limit, // 페이지 사이즈만큼 데이터 조회
    skip: cursor ? 1 : 0, // 커서가 있을 경우 해당 항목을 제외하고 조회
    cursor: cursorOption, // 커서 위치를 기준으로 데이터 조회
  });

  //다음 커서
  const nextCursor = cards.length === limit ? cards[limit - 1].id : null;

  return { cards, nextCursor };
};

export const getCardById = async (id) => {
  return await prismaClient.card.findUnique({ where: { id } });
};

export const deleteCard = async (id) => {
  return await prismaClient.card.delete({ where: { id } });
};

export const updateCard = async (data) => {
  console.log(data.id, data.userId, data.remainingCount);
  return await prismaClient.card.update({
    where: {
      AND: [{ id: data.id }, { userId: data.userId }],
    },
    data: {
      remainingCount: data.remainingCount,
    },
  });
};
