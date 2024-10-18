import express from "express";
import notificationService from "../services/notificationService.js";
import passport from "passport"; // passport 가져오기

const router = express.Router();

// 알림 생성
router.post("/", async (req, res, next) => {
  try {
    const notification = await notificationService.createNotification(req.body);
    res.status(201).send({ notification }); // 생성된 알림 정보를 클라이언트에 응답
  } catch (error) {
    next(error); // 에러를 next로 전달
  }
});

// 현재까지 온 알림 조회(전체)
router.get(
  "/",
  passport.authenticate("access-token", { session: false }),
  async (req, res, next) => {
    try {
      const notifications = await notificationService.getAllNotifications(
        req.user.id // 로그인된 현재 사용자 ID
      );
      res.status(200).send({ notifications });
    } catch (error) {
      next(error);
    }
  }
);

// 특정 알림 조회
router.get(
  "/:id",
  passport.authenticate("access-token", { session: false }),
  async (req, res, next) => {
    try {
      const notification = await notificationService.getNotificationById(
        req.params.id
      );
      res.status(200).send({ notification });
    } catch (error) {
      next(error);
    }
  }
);

// 알림 업데이트 (읽음 상태 변경)
router.patch(
  "/:id",
  passport.authenticate("access-token", { session: false }),
  async (req, res, next) => {
    try {
      const updatedNotification = await notificationService.updateNotification(
        req.params.id,
        req.body
      );
      res.status(200).send({ updatedNotification });
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
      res.status(200).send({ message: "알림이 성공적으로 삭제되었습니다." });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
