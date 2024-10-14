import prismaClient from "../utils/prismaClient.js";

const createCard = async (data) => {
  return await prismaClient.card.create({ data });
};

export { createCard, updateCard };
