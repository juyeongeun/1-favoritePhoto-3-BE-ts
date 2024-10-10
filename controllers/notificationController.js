import express from "express";
import * as notificationService from "../services/notificationService";

const router = express.Router();

// 알림 생성
router.post("/", async (req, res, next) => {
  try {
    const notification = await notificationService.createNotification(req.body);
    res.status(201).send({ success: true, notification }); // 생성된 알림 정보를 클라이언트에 응답
  } catch (error) {
    next(error); // 에러를 next로 전달
  }
});

export default router;
