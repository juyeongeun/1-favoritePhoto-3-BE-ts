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
  getById,
  create,
  update,
  deleteUser,
};
