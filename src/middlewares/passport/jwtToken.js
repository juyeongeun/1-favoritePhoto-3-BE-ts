import { Strategy as JwtStrategy } from "passport-jwt";
import userService from "../../services/userService.js";
import { JWT_SECRET } from "../../env.js";

const accessExtractor = function (req) {
  const cookieString = req.headers.cookie;
  let accessToken = "";
  if (cookieString) {
    if (cookieString.startsWith("access-token=")) {
      accessToken = cookieString
        .split("; ")
        .find((cookie) => cookie.startsWith("access-token="))
        .split("=")[1];
    }
  }

  if (!cookieString || !accessToken) {
    const error = new Error("Unauthorized");
    error.status = 401;
    error.data = {
      message: "유효하지 않은 액세스 토큰입니다.",
      // requestURL: req.originalUrl,
      "access-token": accessToken,
    };
    throw error;
  }

  // console.log("엑세스" + token);
  return accessToken;
};

const refreshExtractor = function (req) {
  const cookieString = req.headers.cookie;
  let refreshToken = "";
  if (cookieString) {
    refreshToken = cookieString
      .split("; ")
      .find((cookie) => cookie.startsWith("refresh-token="))
      .split("=")[1];
  }
  if (!cookieString || !refreshToken) {
    const error = new Error("Forbidden");
    error.status = 403;
    error.data = {
      message: "유효하지 않은 리플레쉬 토큰입니다.",
      // requestURL: req.originalUrl,
      "refresh-token": refreshToken,
    };
    throw error;
  }
  // console.log("리프레쉬" + token);
  return refreshToken;
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
