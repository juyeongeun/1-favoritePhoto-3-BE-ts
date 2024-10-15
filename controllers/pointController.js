import express from "express";
import pointService from "../services/pointService.js";
import passport from "../config/passportConfig.js";
import asyncHandle from "../utils/error/asyncHandle.js";

const router = express.Router();

/* 포인트 뽑기 */
router.post(
  "/draw",
  passport.authenticate("access-token", { session: false }),
  asyncHandle(async (req, res) => {
    try {
      const userId = req.user.id;
      const updatedUser = await pointService.drawPoints(userId);
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  })
);

export default router;
