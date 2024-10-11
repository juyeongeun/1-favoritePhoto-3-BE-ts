import express from "express";
import { asyncHandle } from "../utils/error/asyncHandle";
import passport from "../config/passportConfig";
import exchangeService from "../services/exchangeService";

const router = express.Router();

router.post(
  "/:id/request",
  passport.authenticate("access-token", { session: false }),
  asyncHandle(async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const { id } = req.params;
      const { myCardId, description } = req.body;

      const exchange = await exchangeService.createExchange({
        shopId: id,
        cardId: myCardId,
        description,
        userId,
      });

      res.status(201).sned(exchange);
    } catch (error) {
      next(error);
    }
  })
);
