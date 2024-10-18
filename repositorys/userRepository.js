import prismaClient from "../utils/prismaClient.js";

const getMySales = (data) => {
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
      shop: {
        select: {
          remainingCount: true,
        },
      },
      exchange: true,
    },
  });
};

const getMyCardCount = async (userId) => {
  //사용자의 id로 등록된 총 카드의 수
  const totalCount = await prismaClient.card.count({
    where: {
      userId,
    },
  });
  //각 등급의 수를 그룹화
  const gradeCounts = await prismaClient.card.groupBy({
    where: {
      userId,
    },
    by: ["grade"],
    _count: {
      id: true,
    },
  });
  // 그룹화한 등금을 원하는 JSON 형태로 변환
  const formattedGradeCounts = gradeCounts.reduce((acc, curr) => {
    acc[curr.grade] = curr._count.id;
    return acc;
  }, {});
  return {
    totalCount,
    formattedGradeCounts,
  };
};

const getByEmail = (email) => {
  return prismaClient.user.findUnique({
    where: {
      email,
    },
  });
};

const getByNickname = (nickname) => {
  return prismaClient.user.findFirst({
    where: {
      nickname,
    },
  });
};

const getById = (id) => {
  return prismaClient.user.findUnique({
    where: {
      id,
    },
  });
};

const create = (data) => {
  return prismaClient.user.create({
    data,
  });
};

const update = (id, data) => {
  return prismaClient.user.update({
    where: {
      id,
    },
    data,
  });
};

const deleteUser = (id) => {
  return prismaClient.user.update({
    where: {
      id,
    },
    data: {
      isdeleted: true,
    },
  });
};

export default {
  getMySales,
  getByEmail,
  getByNickname,
  getMyCardCount,
  getById,
  create,
  update,
  deleteUser,
};
