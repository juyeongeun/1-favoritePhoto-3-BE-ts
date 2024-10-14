import prismaClient from "../utils/prismaClient.js";

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
      shop: {
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
  return prismaClient.exchange.findFirst({
    where: {
      id,
    },
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
          genre: true,
          description: true,
          imageURL: true,
        },
      },
      shop: {
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
              genre: true,
              description: true,
              imageURL: true,
            },
          },
        },
      },
    },
  });
};

const getByUserId = async (data) => {
  const { where, limit, cursor } = data;
  return prismaClient.exchange.findFirst({
    where,
    take: limit + 1,
    skip: cursor ? { id: cursor } : undefined,
    include: {
      user: {
        select: {
          nickname: true,
        },
      },
      card: true,
      shop: {
        include: {
          card: true,
        },
      },
    },
  });
};

const getByShopId = async (id) => {
  return prismaClient.exchange.findMany({
    where: {
      shopId: id,
    },
    include: {
      user: {
        select: { nickname: true },
      },
      card: true,
      shop: {
        select: {
          user: {
            select: { nickname: true },
          },
          card: {
            select: {
              name: true,
              grade: true,
              genre: true,
            },
          },
        },
      },
    },
  });
};

const acceptExchange = async (exchange) => {
  const { price, card, userId: ownerId } = exchange.shop;
  const { card: exchangeCard } = exchange;
  const [updateShopItem, consumerCard, ownerCard] =
    await prismaClient.$transaction([
      prismaClient.shop.update({
        where: {
          id: exchange.shopId,
        },
        data: {
          remainingCount: {
            decrement: exchange.count,
          },
        },
      }), //샵의 남은 카드수 수정
      prismaClient.card.create({
        data: {
          ...card,
          purchasePrice: price,
          totalCount: exchange.count,
          remainingCount: exchange.count,
          userId: exchange.userId,
        },
      }), //제안한 사람의 userId로 새로운 레코드생성
      prismaClient.card.create({
        data: {
          ...exchangeCard,
          purchasePrice: exchangeCard.purchasePrice,
          totalCount: exchange.count,
          remainingCount: exchange.count,
          userId: ownerId,
        },
      }), //판매한 사람의 userId로 새로운 레코드생성
    ]);

  return { updateShopItem, consumerCard, ownerCard };
};

export default {
  create,
  update,
  deleteExchange,
  getById,
  getByShopId,
  getByUserId,
  acceptExchange,
};
