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

// 전체 알림 조회
router.get("/:userId", async (req, res, next) => {
  try {
    const notifications = await notificationService.getAllNotifications(
      req.params.userId
    );
    res.status(200).send({ success: true, notifications });
  } catch (error) {
    next(error);
  }
});

// 특정 알림 조회(교환 관련 or 구매 관련 등)
router.get("/type/:userId/:type", async (req, res, next) => {
  try {
    const notifications = await notificationService.getNotificationsByType(
      req.params.userId,
      req.params.type // 조회할 알림의 타입
    );
    res.status(200).send({ success: true, notifications });
  } catch (error) {
    next(error);
  }
});

export default router;
