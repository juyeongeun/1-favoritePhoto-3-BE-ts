import express from "express";
import purchaseService from "../services/purchaseService.js";
import asyncHandle from "../utils/error/asyncHandle.js";
import passport from "../config/passportConfig.js";

const router = express.Router();

router.post(
  "/:shopId",
  passport.authenticate("access-token", { session: false }),
  asyncHandle(async (req, res, next) => {
    try {
      const buyerId = req.user?.id || "";
      const { count } = req.body;
      const shopId = parseInt(req.params.shopId);

      const purchase = await purchaseService.createPurchase(
        buyerId,
        count,
        shopId
      );
      res.status(201).send({ success: true, purchase });
    } catch (error) {
      next(error);
    }
  })
);
export default router;
