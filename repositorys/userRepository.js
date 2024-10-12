import prismaClient from "../utils/prismaClient.js";

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
  getByEmail,
  getByNickname,
  getById,
  create,
  update,
  deleteUser,
};
