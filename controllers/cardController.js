import express from "express";
import cardService from "../services/cardService.js";
import asyncHandle from "../utils/error/asyncHandle.js";
import passport from "../config/passportConfig.js";
import cardValidation from "../middlewares/card/cardValidation.js";
import { imageUpload, uploadToS3 } from "../middlewares/card/imageUpload.js";

const router = express.Router();
// 카드 등록(생성)
router.post(
  "/",
  passport.authenticate("access-token", { session: false }),
  imageUpload.single("imageURL"), //multer로 메모리에 이미지 저장
  uploadToS3, // 압축 후 S3 업로드
  cardValidation,
  asyncHandle(async (req, res, next) => {
    try {
      const { name, grade, genre, description, totalCount } = req.body;
      const userId = req.user?.id || "";
      const imageURL = req.file ? req.file.location : "";
      if (!imageURL) {
        return res
          .status(400)
          .send({ message: "이미지 업로드가 실패했습니다." });
      }

      const newCard = await cardService.createCard({
        name,
        grade,
        genre,
        description,
        totalCount: parseInt(totalCount),
        remainingCount: parseInt(totalCount),
        imageURL,
        userId: parseInt(userId),
      });

      res.status(201).send({
        success: true,
        message: "카드가 성공적으로 생성되었습니다.",
        card: newCard,
      });
    } catch (error) {
      next(error);
    }
  })
);

export default router;
