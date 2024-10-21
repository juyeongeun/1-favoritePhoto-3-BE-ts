import userRepository from "../repositorys/userRepository.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const whereConditions = ({
  keyword,
  userId,
  grade,
  genre,
  salesType,
  isSoldOut,
}) => {
  const where = {
    userId,
    name: { contains: keyword, mode: "insensitive" },
  };
  if (genre) {
    where.genre = genre;
  }

  if (grade) {
    where.grade = grade;
  }
  let salesTypeWhere = { ...where };
  if (isSoldOut === "true") {
    salesTypeWhere.shop = {
      some: {
        userId,
        remainingCount: {
          lte: 0, // remainingCount가 0 이하인 경우
        },
      },
    };
  } else {
    switch (salesType) {
      case "sales":
        salesTypeWhere.shop = {
          some: {}, // Shop과 관계가 있는 카드
        };
        break;
      case "exchange":
        salesTypeWhere.exchange = {
          some: {}, // Exchange와 관계가 있는 카드
        };
        break;
      default:
        salesTypeWhere.OR = [
          { shop: { some: {} } },
          { exchange: { some: {} } },
        ];
    }
  }
  return salesTypeWhere;
};

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

const getMySales = async (userId, data) => {
  const { limit, cursor, grade, genre, salesType, isSoldOut, keyword } = data;
  const where = whereConditions({
    keyword,
    userId,
    grade,
    genre,
    salesType,
    isSoldOut,
  });
  const sales = await userRepository.getMySales({ where, limit, cursor });
  if (!sales) {
    const error = new Error("Mot found");
    error.status = 404;
    error.data = {
      message: "나의 판매목록을 찾을 수 없습니다.",
    };
    throw error;
  }
  //추가적인 데이터가 있는지 확인
  const nextSales = sales.length > limit;
  //추가 데이터가 있다면 커서값을 주고 데이터에서 리미트에 맞춰 돌려준다
  const nextCursor = nextSales ? sales[limit - 1].id : "";

  const returnSales = sales.map((item) => {
    let salesType = null;
    let isSoldOut = false;

    if (item.shop.length > 0) {
      salesType = "sales";
      isSoldOut = item.shop.some((shop) => shop.remainingCount <= 0);
    } else if (item.exchange.length > 0) {
      salesType = "exchange";
    }

    return {
      ...item,
      salesType,
      isSoldOut,
    };
  });

  return {
    list: returnSales.slice(0, limit),
    nextCursor,
  };
};

const getByUserCardsCount = async (userId) => {
  const userCardCount = await userRepository.getMyCardCount(userId);
  if (!userCardCount) {
    const error = new Error("Not Found");
    error.status = 404;
    error.data = {
      message: "카드정보를 찾을수 없습니다.",
    };
    throw error;
  }
  return userCardCount;
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
  getMySales,
  refreshToken,
  getByUserCardsCount,
  create,
  updateUser,
  deleteUser,
};
