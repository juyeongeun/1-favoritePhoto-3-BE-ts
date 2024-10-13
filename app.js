import { PORT } from "./env.js";
import express from "express";
import cors from "cors";
import passport from "passport"; // passport 추가
import errorHandler from "./middlewares/error/errorHandler.js";
import userRouter from "./controllers/userController.js";
import shopRouter from "./controllers/shopController.js";
import cardRouter from "./controllers/cardController.js";
import {
  accessTokenStrategy,
  refreshTokenStrategy,
} from "./middlewares/passport/jwtToken.js"; // jwt 미들웨어 추가

const app = express();
app.use(express.json());
app.use(cors());

// Passport 초기화
app.use(passport.initialize());

// JWT 전략 등록
passport.use(accessTokenStrategy);
passport.use(refreshTokenStrategy);

app.use("/users", userRouter); // 2개여서 1개 삭제함
app.use("/shop", shopRouter);
app.use("/cards", cardRouter);

app.use(errorHandler);

app.listen(PORT || 3000, () => console.log("SERVER START"));
