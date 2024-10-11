import prismaClient from "../utils/prismaClient";

const create = async (data) => {
  return prismaClient.exchange.create({
    data,
    include: {
      user: {
        select: {
          nickname: true,
        },
      },
      card: true,
      Shop: {
        include: {
          user: {
            select: {
              nickname: true,
            },
          },
          card: {
            select: {
              name: true,
              grade: true,
            },
          },
        },
      },
    },
  });
};

const update = async ({ id, data }) => {
  return prismaClient.exchange.update({
    where: {
      id,
    },
    data,
    include: {
      user: {
        select: {
          nickname: true,
        },
      },
      card: true,
      exchangeCard: true,
    },
  });
};

const deleteExchange = async (id) => {
  return prismaClient.exchange.delete({
    where: {
      id,
    },
  });
};

const getById = async (id) => {
  return prismaClient.exchange.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          nickname: true,
        },
      },
      card: true,
      Shop: {
        include: {
          user: {
            select: {
              nickname: true,
            },
          },
          card: {
            select: {
              name: true,
              grade: true,
            },
          },
        },
      },
    },
  });
};

const getByUserId = async (data) => {
  const { whereConditions, limit, cursor } = data;
  return prismaClient.exchange.findUnique({
    where: whereConditions,
    take: limit + 1,
    skip: cursor ? { id: cursor } : undefined,
    include: {
      user: {
        select: {
          nickname: true,
        },
      },
      card: true,
      Shop: {
        include: {
          card: true,
        },
      },
    },
  });
};

const getByShopId = async (id) => {
  return prismaClient.exchange.findUnique({
    where: {
      shopId: id,
    },
    include: {
      user: {
        select: {
          nickname: true,
        },
      },
      card: true,
    },
  });
};

export default {
  create,
  update,
  deleteExchange,
  getById,
  getByShopId,
  getByUserId,
};
