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
  return prismaClient.exchange.findMany({
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
      card: {
        select: {
          name: true,
          purchasePrice: true,
          grade: true,
          genre: true,
          description: true,
          imageURL: true,
        },
      },
      shop: {
        select: {
          price: true,
          remainingCount: true,
          exchangeDescription: true,
          exchangeGenre: true,
          exchangeGenre: true,
          card: {
            select: {
              id: true,
              name: true,
              purchasePrice: true,
              grade: true,
              genre: true,
              description: true,
              imageURL: true,
            },
          },
          user: {
            select: {
              id: true,
              nickname: true,
            },
          },
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
      //판매의 남은 수량 변경
      prismaClient.shop.update({
        where: {
          id: exchange.shopId,
        },
        data: {
          remainingCount: {
            decrement: exchange.count,
          },
        },
      }),
      //제안한 사람의 userId로 새로운 레코드생성
      prismaClient.card.create({
        data: {
          ...card,
          purchasePrice: price,
          totalCount: exchange.count,
          remainingCount: exchange.count,
          userId: exchange.userId,
        },
      }),
      //판매한 사람의 userId로 새로운 레코드생성
      prismaClient.card.create({
        data: {
          ...exchangeCard,
          purchasePrice: exchangeCard.purchasePrice,
          totalCount: exchange.count,
          remainingCount: exchange.count,
          userId: ownerId,
        },
      }),
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
