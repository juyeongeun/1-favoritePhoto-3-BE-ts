import prismaClient from "../utils/prismaClient.js";

const createCard = async (data) => {
  return await prismaClient.card.create({
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

export { createCard };
