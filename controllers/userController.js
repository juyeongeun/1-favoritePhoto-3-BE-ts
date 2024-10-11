import express from "express";
import userService from "../services/userService.js";
import userValidation from "../middlewares/users/userValidation.js";
import { asyncHandle } from "../utils/error/asyncHandle.js";
import cookiesConfig from "../config/cookiesConfig.js";
import passport from "../config/passportConfig.js";

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
  passport.authenticate("access-token", { session: false }),
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
      const refreshToken = req.cookies["refresh-token"];
      const validationToken = await userService.refreshToken(
        userId,
        refreshToken
      );
      if (validationToken) {
        const accessToken = userService.createToken(user);
        const newRefreshToken = userService.createToken(user, "refresh");
        const nextUser = await userService.updateUser(user.id, {
          newRefreshToken,
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

export default router;
