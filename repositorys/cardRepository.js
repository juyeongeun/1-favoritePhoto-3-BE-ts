import prismaClient from "../utils/prismaClient";

export const createCard = async (data) => {
  return await prismaClient.card.create({ data });
};

export const getAllCards = async () => {
  return await prismaClient.card.findMany();
};

export const getCardById = async (id) => {
  return await prismaClient.card.findUnique({ where: { id } });
};

export const updateCard = async (id, data) => {
  return await prismaClient.card.update({ where: { id }, data });
};

export const deleteCard = async (id) => {
  return await prismaClient.card.delete({ where: { id } });
};
