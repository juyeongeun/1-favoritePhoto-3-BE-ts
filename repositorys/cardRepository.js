import prismaClient from "../utils/prismaClient.js";

const createCard = (data) => {
  return prismaClient.card.create({
    data,
    include: {
      user: {
        select: {
          nickname: true,
          point: true,
          email: true,
          id: true,
        },
      },
    },
  });
};

const getByUserId = (data) => {
  const { where, limit, cursor } = data;
  return prismaClient.card.findMany({
    where,
    take: limit + 1, //추가적인 데이터가 있는지 확인을 위함
    skip: cursor ? 1 : undefined,
    cursor: cursor ? { id: cursor } : undefined,
    include: {
      user: {
        select: {
          nickname: true,
        },
      },
    },
  });
};

export default { createCard, getByUserId };
