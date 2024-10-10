import express from "express"; // express 모듈 임포트
import * as cardService from "../services/cardService"; // 서비스 임포트

const router = express.Router(); // express 라우터 생성

// 카드 등록(생성)
router.post("/", async (req, res, next) => {
  try {
    const {
      name,
      price,
      grade,
      genre,
      description,
      totalCount,
      imageURL,
      userId,
    } = req.body;

    const newCard = await cardService.createCard({
      name,
      price,
      grade,
      genre,
      description,
      totalCount,
      remainingCount: totalCount, // 초기 남은 카드 수는 totalCount 수와 같게 설정
      imageURL,
      userId,
    });

    res.status(201).send({
      success: true,
      message: "카드가 성공적으로 생성되었습니다.",
      card: newCard,
    });
  } catch (error) {
    next(error); // 에러를 next로 전달
  }
});

// 라우터 내보내기
export default router;
