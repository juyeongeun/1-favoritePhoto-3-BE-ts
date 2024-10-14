//controllers\notificationController.js

import express from "express";
import notificationService from "../services/notificationService.js";
import passport from "passport"; // passport 가져오기

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
router.get(
  "/",
  passport.authenticate("access-token", { session: false }),
  async (req, res, next) => {
    try {
      const notifications = await notificationService.getAllNotifications(
        req.user.id // 로그인된 현재 사용자 ID
      );
      res.status(200).send({ success: true, notifications });
    } catch (error) {
      next(error);
    }
  }
);

// 특정 알림 조회(교환 관련 or 구매 관련 등)
router.get(
  "/type/:type",
  passport.authenticate("access-token", { session: false }),
  async (req, res, next) => {
    try {
      const notifications = await notificationService.getNotificationsByType(
        req.user.id, // 로그인 된 사용자 ID
        req.params.type // 조회할 알림의 타입
      );
      res.status(200).send({ success: true, notifications });
    } catch (error) {
      next(error);
    }
  }
);

// 알림 업데이트 (읽음 상태 변경 등)
router.put(
  "/:id",
  passport.authenticate("access-token", { session: false }),
  async (req, res, next) => {
    try {
      const updatedNotification = await notificationService.updateNotification(
        req.params.id,
        req.body
      );
      res.status(200).send({ success: true, updatedNotification });
    } catch (error) {
      next(error);
    }
  }
);

// 알림 삭제
router.delete(
  "/:id",
  passport.authenticate("access-token", { session: false }),
  async (req, res, next) => {
    try {
      await notificationService.deleteNotification(req.params.id);
      res
        .status(200)
        .send({ success: true, message: "알림이 성공적으로 삭제되었습니다." });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
