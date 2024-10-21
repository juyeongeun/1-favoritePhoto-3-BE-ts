import { Strategy as JwtStrategy } from "passport-jwt";
import userService from "../../services/userService.js";
import { JWT_SECRET } from "../../env.js";

const accessExtractor = function (req) {
  var token = null;
  const cookieString = req.headers.cookie;
  if (!cookieString || !cookieString.startsWith("access-token=")) {
    const error = new Error("Unauthorized");
    error.status = 401;
    error.data = {
      message: "유효하지 않은 액세스 토큰입니다.",
      // requestURL: req.originalUrl,
      "access-token": cookieString.startsWith("access-token="),
    };
    throw error;
  }
  const accessToken = cookieString
    .split("; ")
    .find((cookie) => cookie.startsWith("access-token="))
    .split("=")[1];

  if (req && accessToken) {
    token = accessToken;
  } else {
    token = req.headers.authorization;
  }
  // console.log("엑세스" + token);
  return token;
};

const refreshExtractor = function (req) {
  var token = null;
  const cookieString = req.headers.cookie;
  if (!cookieString || !cookieString.startsWith("refresh-token=")) {
    const error = new Error("Forbidden");
    error.status = 403;
    error.data = {
      message: "유효하지 않은 리플레쉬 토큰입니다.",
      // requestURL: req.originalUrl,
      "refresh-token": cookieString.startsWith("refresh-token="),
    };
    throw error;
  }
  const refreshToken = cookieString
    .split("; ")
    .find((cookie) => cookie.startsWith("refresh-token="))
    .split("=")[1];
  if (req && refreshToken) {
    token = refreshToken;
  } else {
    token = req.headers.refreshtoken;
  }
  // console.log("리프레쉬" + token);
  return token;
};

const accessTokenOptions = {
  jwtFromRequest: accessExtractor,
  secretOrKey: JWT_SECRET,
};

const refreshTokenOptions = {
  jwtFromRequest: refreshExtractor,
  secretOrKey: JWT_SECRET,
};

async function jwtVerify(payload, done) {
  const { userId } = payload;
  try {
    const user = await userService.getUserById(userId);
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}

//리퀘스트의 사용자 정보를 담아줌  -> req.user
export const accessTokenStrategy = new JwtStrategy(
  accessTokenOptions,
  jwtVerify
);
export const refreshTokenStrategy = new JwtStrategy(
  refreshTokenOptions,
  jwtVerify
);
