import prismaClient from "../utils/prismaClient.js";

const getByEmail = (email) => {
  return prismaClient.user.findUniqueOrThrow({
    where: {
      email,
    },
  });
};

const getById = (id) => {
  return prismaClient.user.findUniqueOrThrow({
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

const update = ({ id, data }) => {
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
  getById,
  create,
  update,
  deleteUser,
};
