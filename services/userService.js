import userRepository from "../repositorys/userRepository.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const createToken = (user, type) => {
  const payload = { userId: user.id, email: user.email }; //jwt 토근 정도에 사용자의 id, email 정보를 담는다.
  const options = { expiresIn: type ? "1w" : "1h" }; //refresh 토큰의 경우 1주일, access 토근은 1시간의 유효성을 둔다
  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

const getUser = async ({ email, password }) => {
  const user = await userRepository.getByEmail(email);
  if (!user) {
    const error = new Error("Mot found");
    error.status = 404;
    error.data = {
      message: "등록된 사용자가 없습니다.",
      email,
    };
    throw error;
  }

  await verifyPassword(password, user.password);
  return filterSensitiveUserData(user);
};

const getUserByEmail = async (email) => {
  const user = await userRepository.getByEmail(email);
  if (!user) {
    return null;
  }
  return filterSensitiveUserData(user);
};

const getUserByNickname = async (nickname) => {
  const user = await userRepository.getByNickname(nickname);
  if (!user) {
    return null;
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
    throw error;
  }

  return filterSensitiveUserData(user);
};

const refreshToken = async (userId, refreshToken) => {
  const user = await userRepository.getById(userId);

  if (!user) {
    const error = new Error("Mot found");
    error.status = 404;
    error.data = {
      message: "등록된 사용자가 없습니다.",
    };
    throw error;
  }

  if (refreshToken !== user.refreshToken) {
    const error = new Error("Unauthorized");
    error.status = 401;
    error.data = {
      message: "리프레쉬 토큰이 유효하지 않습니다.",
    };
    throw error;
  }
  return true;
};

const create = async (data) => {
  const userByEmail = await userRepository.getByEmail(data.email);
  if (userByEmail) {
    //이미 사용중인 이메일인 경우 아래의 에러를 반환한다.
    const error = new Error("Unprocessable Entity");
    error.status = 422;
    error.data = {
      message: "사용중인 이메일입니다.",
      email: userByEmail.email,
    };
    throw error;
  }
  const userByNickname = await userRepository.getByNickname(data.nickname);
  if (userByNickname) {
    //이미 사용중인 이메일인 경우 아래의 에러를 반환한다.
    const error = new Error("Unprocessable Entity");
    error.status = 422;
    error.data = {
      message: "사용중인 닉네임입니다.",
      nickname: userByNickname.nickname,
    };
    throw error;
  }

  const hashedPassword = await hashingPassword(data.password);
  const createUser = await userRepository.create({
    ...data,
    password: hashedPassword,
  });

  return filterSensitiveUserData(createUser);
};

const updateUser = async (id, data) => {
  const user = await userRepository.update(id, data);

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

const verifyPassword = async (inputPassword, savedPassword) => {
  const isValid = await bcrypt.compare(inputPassword, savedPassword); // 변경
  if (!isValid) {
    const error = new Error("Unauthorized");
    error.status = 401;
    error.data = {
      message: "비밀번호가 일치 하지 않습니다.",
    };
    throw error;
  }
};

export default {
  createToken,
  getUser,
  getUserByEmail,
  getUserById,
  getUserByNickname,
  refreshToken,
  create,
  updateUser,
  deleteUser,
};
