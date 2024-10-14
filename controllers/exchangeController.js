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

      res.status(201).send(exchange);
    } catch (error) {
      next(error);
    }
  })
);

router.post(
  "/:id/accept",
  passport.authenticate("access-token", { session: false }),
  asyncHandle(async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const { id } = req.params;

      const response = await exchangeService.acceptExchange(id, userId);
      if (response) {
        res.status(200).send({ message: "교환제안 승인" });
      }
    } catch (error) {
      next(error);
    }
  })
);

router.post(
  "/:id/refuse",
  passport.authenticate("access-token", { session: false }),
  asyncHandle(async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const { id } = req.params;

      const response = await exchangeService.refuseExchange(id, userId);
      if (response) {
        res.status(200).send({ message: "교환제안 거절" });
      }
    } catch (error) {
      next(error);
    }
  })
);

router.delete(
  "/:id",
  passport.authenticate("access-token", { session: false }),
  asyncHandle(async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const { id } = req.params;

      const response = await exchangeService.refuseExchange(id, userId);
      res.status(204).send(response);
    } catch (error) {
      next(error);
    }
  })
);
