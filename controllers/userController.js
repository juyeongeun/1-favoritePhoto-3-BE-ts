import express from "express";
import userService from "../services/userService.js";
import userValidation from "../middlewares/users/userValidation.js";
import { asyncHandle } from "../utils/error/asyncHandle.js";

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

export default router;
