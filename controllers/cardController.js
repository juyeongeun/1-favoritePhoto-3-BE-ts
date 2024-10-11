import express from "express"; // express 모듈 임포트
import * as cardService from "../services/cardService.js"; // 서비스 임포트
import asyncHandle from "../utils/error/asyncHandle.js";

const router = express.Router(); // express 라우터 생성

// 카드 등록(생성)
router.post(
  "/",
  asyncHandle(async (req, res, next) => {
    try {
      const { name, grade, genre, description, totalCount, imageURL, userId } =
        req.body;

      const newCard = await cardService.createCard({
        name,
        grade,
        genre,
        description,
        totalCount: parseInt(totalCount),
        remainingCount: parseInt(totalCount), // 초기 남은 카드 수는 totalCount 수와 같게 설정
        imageURL,
        userId: parseInt(userId),
      });

      res.status(201).send({
        success: true,
        message: "카드가 성공적으로 생성되었습니다.",
        card: newCard,
      });
    } catch (error) {
      next(error); // 에러를 next로 전달
    }
  })
);

// 카드 수정
router.patch(
  "/:id",
  (req, res, next) => {
    req.user = { id: 1 }; // 사용자 ID를 임시로 1로 설정
    next();
  },
  asyncHandle(async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id; // 로그인된 사용자 ID
      const { remainingCount } = req.body;
      if (!id || !userId || remainingCount === undefined) {
        return res.status(400).json({
          success: false,
          message:
            "유효한 카드 ID, 사용자 ID, 또는 remainingCount 값이 필요합니다.",
        });
      }
      const updatedCard = await cardService.updateCard({
        id: parseInt(id),
        userId: parseInt(userId),
        remainingCount: parseInt(remainingCount),
      });
      res.status(200).send({
        success: true,
        message: "카드가 성공적으로 수정되었습니다.",
        card: updatedCard,
      });
    } catch (error) {
      next(error); // 에러를 next로 전송
    }
  })
);

// 라우터 내보내기
export default router;
