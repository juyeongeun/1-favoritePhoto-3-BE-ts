import express from "express"; // express 모듈 임포트
import * as cardService from "../services/cardService.js"; // 서비스 임포트

const router = express.Router(); // express 라우터 생성

// 카드 등록(생성)
router.post("/", async (req, res, next) => {
  try {
    const { name, grade, genre, description, totalCount, imageURL, userId } =
      req.body;
    console.log(req.body);

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
});

// 카드 전체 조회(검색 기능 포함)
router.get(
  "/",
  (req, res, next) => {
    req.user = { id: 1 }; // 사용자 ID를 임시로 1로 설정 (추후 실제 사용자 인증 방식으로 대체)
    next();
  },
  async (req, res, next) => {
    try {
      const {
        keyword = "", // 기본값은 빈 문자열
        grade = "", // 단일 선택 필터 - 빈 문자열을 기본값으로 설정
        genre = "", // 단일 선택 필터 - 빈 문자열을 기본값으로 설정
        orderBy = "recent", // 정렬 기준 (recent, old)
        cursor = null, // 커서 위치
        limit = 12, // 페이지당 데이터 개수
        isSoldOut = "", // 매진 여부 (빈 문자열을 기본값으로 설정)
      } = req.query;

      const userId = req.user.id; // 로그인된 사용자 ID

      // 매진 여부 필터를 boolean 값으로 변환 (문자열로 넘어오는 경우)
      const isSoldOutBool =
        isSoldOut.toLowerCase() === "true"
          ? true
          : isSoldOut.toLowerCase() === "false"
          ? false
          : undefined;

      // 서비스 레이어에서 카드 목록 조회 (검색, 단일 필터, 정렬 및 페이지네이션 적용)
      const result = await cardService.getUserCards({
        userId,
        keyword,
        grade, // 단일 선택 필터 적용
        genre, // 단일 선택 필터 적용
        orderBy,
        cursor,
        limit: parseInt(limit),
        isSoldOut: isSoldOutBool, // boolean 값 사용
      });

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
);

// 카드 상세 조회
router.get(
  "/:id",
  (req, res, next) => {
    req.user = { id: 1 }; // 사용자 ID를 임시로 1로 설정
    next();
  },
  async (req, res, next) => {
    const { id } = req.params; // URL 파라미터에서 카드 ID 추출

    try {
      const card = await cardService.getCardById(Number(id)); // 카드 ID로 카드 조회

      if (!card) {
        return res
          .status(404)
          .send({ success: false, message: "카드를 찾을 수 없습니다." });
      }

      res.status(200).send({ success: true, data: card });
    } catch (error) {
      next(error); // 에러를 next로 전달
    }
  }
);

// 카드 삭제
router.delete(
  "/:id",
  (req, res, next) => {
    req.user = { id: 1 }; // 사용자 ID를 임시로 1로 설정
    next();
  },
  async (req, res, next) => {
    const { id } = req.params; // URL 파라미터에서 카드 ID 추출
    const userId = req.user.id; // 로그인된 사용자 ID

    try {
      await cardService.deleteCard(Number(id), userId);
      res
        .status(200)
        .send({ success: true, message: "카드가 성공적으로 삭제되었습니다." });
    } catch (error) {
      next(error); // 에러를 next로 전달
    }
  }
);

// 라우터 내보내기
export default router;
