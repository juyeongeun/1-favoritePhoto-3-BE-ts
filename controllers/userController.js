import express from "express";
import userService from "../services/userService.js";
import userValidation from "../middlewares/users/userValidation.js";
import asyncHandle from "../utils/error/asyncHandle.js";
import cookiesConfig from "../config/cookiesConfig.js";
import passport from "../config/passportConfig.js";
import exchangeService from "../services/exchangeService.js";
import cardService from "../services/cardService.js";
import shopService from "../services/shopService.js";

const router = express.Router();

router.post(
  "/signup",
  userValidation,
  asyncHandle(async (req, res, next) => {
    try {
      const { email, password, nickname } = req.body;

      const user = await userService.create({
        email,
        password,
        nickname,
      });

      return res.status(201).send(user);
    } catch (error) {
      next(error);
    }
  })
);

router.post(
  "/login",
  asyncHandle(async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await userService.getUser({ email, password });

      const accessToken = userService.createToken(user);
      const refreshToken = userService.createToken(user, "refresh");
      const nextUser = await userService.updateUser(user.id, { refreshToken });

      res.cookie("access-token", accessToken, cookiesConfig.accessTokenOption);
      res.cookie(
        "refresh-token",
        refreshToken,
        cookiesConfig.refreshTokenOption
      );

      res.status(200).send(nextUser);
    } catch (error) {
      next(error);
    }
  })
);

router.delete(
  "/logout",
  asyncHandle(async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      await userService.updateUser(userId, {
        refreshToken: "",
      });
      res.cookie("access-token", null, cookiesConfig.accessTokenOption);
      res.cookie("refresh-token", null, cookiesConfig.accessTokenOption);
      res.status(200).send({ message: "로그아웃 되었습니다" });
    } catch (error) {
      next(error);
    }
  })
);

router.get(
  "/me",
  passport.authenticate("access-token", { session: false }),
  asyncHandle(async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const user = await userService.getUserById(userId);

      res.status(200).send(user);
    } catch (error) {
      next(error);
    }
  })
);

router.post(
  "/check-email",
  asyncHandle(async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await userService.getUserByEmail(email);
      if (user) {
        res.status(400).send({
          isApprove: false,
          data: {
            message: "사용중인 이메일입니다.",
            email,
          },
        });
      } else {
        res.status(200).send({
          isApprove: true,
          data: {
            message: "사용가능한 이메일입니다.",
            email,
          },
        });
      }
    } catch (error) {
      next(error);
    }
  })
);

router.post(
  "/check-nickname",
  asyncHandle(async (req, res, next) => {
    try {
      const { nickname } = req.body;
      const user = await userService.getUserByNickname(nickname);
      if (user) {
        res.status(400).send({
          isApprove: false,
          data: {
            message: "사용중인 닉네임입니다.",
            nickname,
          },
        });
      } else {
        res.status(200).send({
          isApprove: true,
          data: {
            message: "사용가능한 닉네임입니다.",
            nickname,
          },
        });
      }
    } catch (error) {
      next(error);
    }
  })
);

router.get(
  "/refresh-token",
  (req, res, next) => {
    passport.authenticate("refresh-token", { session: false }, (err, user) => {
      if (err || !user) {
        return res.status(403).send({ message: "토근만료" });
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  asyncHandle(async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      let refreshToken = null;
      if (req.cookies) {
        refreshToken = req.cookies["refresh-token"];
      } else {
        refreshToken = req.headers.refreshtoken;
      }
      const validationToken = await userService.refreshToken(
        userId,
        refreshToken
      );
      if (validationToken) {
        const accessToken = userService.createToken(req.user);
        const newRefreshToken = userService.createToken(req.user, "refresh");
        const nextUser = await userService.updateUser(req.user.id, {
          refreshToken: newRefreshToken,
        });

        res.cookie(
          "access-token",
          accessToken,
          cookiesConfig.accessTokenOption
        );
        res.cookie(
          "refresh-token",
          refreshToken,
          cookiesConfig.refreshTokenOption
        );

        res.status(200).send(nextUser);
      }
    } catch (error) {
      next(error);
    }
  })
);

router.get(
  "/my-cards",
  passport.authenticate("access-token", { session: false }),
  asyncHandle(async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const { keyword = "", limit = 10, cursor = "" } = req.query;

      const cards = await cardService.getByUserId(userId, {
        keyword,
        limit: parseInt(limit),
        cursor: parseInt(cursor),
      });

      res.status(200).send(cards);
    } catch (error) {
      next(error);
    }
  })
);

router.get(
  "/my-exchange",
  passport.authenticate("access-token", { session: false }),
  asyncHandle(async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const { keyword = "", limit = 10, cursor = "" } = req.query;

      const exchanges = await exchangeService.getByUserId(userId, {
        keyword,
        limit: parseInt(limit),
        cursor: parseInt(cursor),
      });

      res.status(200).send(exchanges);
      //교환 서비스함수 호출 필요
    } catch (error) {
      next(error);
    }
  })
);

router.get(
  "/my-sales",
  passport.authenticate("access-token", { session: false }),
  asyncHandle(async (req, res, next) => {
    try {
      const { id: userId } = req.user;

      const { limit = 10, cursor = "" } = req.query;
      const {
        grade = "",
        genre = "",
        salesType = "",
        isSoldOut = "false",
      } = req.query;

      const sales = await userService.getMySales(userId, {
        limit: parseInt(limit),
        cursor: parseInt(cursor),
        grade,
        genre,
        salesType,
        isSoldOut,
      });

      res.status(200).send(sales);
    } catch (error) {
      next(error);
    }
  })
);

export default router;
