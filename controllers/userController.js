import express from "express";
import userService from "../services/userService";

const router = express.Router();

router.post(
  "/signup",
  asyncHandle(async (res, res, next) => {
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
