import express from "express"; // express 모듈 임포트
import * as cardService from "../services/cardService.js"; // 서비스 임포트
import asyncHandle from "../utils/error/asyncHandle.js";
import passport from "../config/passportConfig.js";
import cardValidation from "../middlewares/card/cardValidation.js";
import imageUpload from "../middlewares/card/imageUpload.js";

const router = express.Router(); // express 라우터 생성

// 카드 등록(생성)
router.post(
  "/",
  passport.authenticate("access-token", { session: false }),
  imageUpload.array("imageURL", 1),
  cardValidation,
  asyncHandle(async (req, res, next) => {
    try {
      const { name, grade, genre, description, totalCount } = req.body;
      const userId = req.user?.id || "";
      let imageURL = "";
      if (req.files && req.files.length > 0) {
        // 업로드된 이미지 파일의 S3 URL 추출
        imageURL = req.files[0].location;
      }

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

// 라우터 내보내기
export default router;
