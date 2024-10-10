import userRepository from "../repositorys/userRepository";
import bcrypt from "bcrypt";

const getUserByEmail = async (email) => {
  const user = await userRepository.getByEmail(email);

  if (!user) {
    const error = new Error("Mot found");
    error.status = 404;
    error.data = {
      message: "등록된 사용자가 없습니다.",
      email,
    };
  }

  return filterSensitiveUserData(user);
};

const getUserById = async (userId) => {
  const user = await userRepository.getById(userId);

  if (!user) {
    const error = new Error("Mot found");
    error.status = 404;
    error.data = {
      message: "등록된 사용자가 없습니다.",
      userId,
    };
  }

  return filterSensitiveUserData(user);
};

const create = async (data) => {
  const user = await userRepository.getByEmail(data.email);

  if (user) {
    //이미 사용중인 이메일인 경우 아래의 에러를 반환한다.
    const error = new Error("Unauthorized");
    error.status = 422;
    error.data = { email: user.email };
    throw error;
  }

  const hashedPassword = hashingPassword(data.password);
  const createUser = await userRepository.create({
    ...data,
    password: hashedPassword,
  });

  return filterSensitiveUserData(createUser);
};

const updateUser = async ({ id, data }) => {
  const user = await userRepository.update({ id, data });

  return filterSensitiveUserData(user);
};

const deleteUser = async (id) => {
  const user = await userRepository.deleteUser(id);

  return filterSensitiveUserData(user);
};

const hashingPassword = async (password) => {
  // 함수 추가
  return bcrypt.hash(password, 10);
};

const filterSensitiveUserData = (user) => {
  //리스폰스의 민감한 정보를 빼고 보낸다
  const { password, refreshToken, ...rest } = user;
  return rest;
};

export default {
  getUserByEmail,
  getUserById,
  create,
  updateUser,
  deleteUser,
};
