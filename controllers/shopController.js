import express from "express";
import * as shopService from "../services/shopService.js";
import { asyncHandle } from "../utils/error/asyncHandle.js";
import {
  shopValidation,
  shopEditValidation,
} from "../middlewares/shop/shopValidation.js";

const router = express.Router();

// 카드 판매 등록하기
router.post(
  "/",
  shopValidation, // 요청 본문의 유효성을 검사하는 미들웨어
  asyncHandle(async (req, res) => {
    // 요청 본문에서 카드 ID, 가격, 총 판매 수량, 교환 희망 정보를 추출
    const userId = req.user.id;
    const {
      cardId,
      price,
      totalCount,
      exchangeGrade,
      exchangeGenre,
      exchangeDescription,
    } = req.body;

    // 카드 정보를 상점에 등록
    const newCard = await shopService.createShopCard({
      userId,
      cardId,
      price,
      totalCount,
      exchangeGrade, // 사용자로부터 교환 희망 정보 수신
      exchangeGenre,
      exchangeDescription,
    });
    // 카드 등록 성공 시, 새로 등록된 카드 정보를 클라이언트에 반환
    return res.status(201).json(newCard);
  })
);

// 상점에 등록된 카드 목록 조회 라우트
router.get(
  "/cards/:shopId",
  asyncHandle(async (req, res, next) => {
    const {
      page = 1,
      pageSize = 9,
      orderBy = "recent",
      keyword = "",
      grade = "",
      genre = "",
      isSoldOut = "",
    } = req.query;

    const filters = {
      page: parseInt(page, 10),
      pageSize: parseInt(pageSize, 10),
      orderBy,
      keyword,
      grade,
      genre,
      isSoldOut:
        isSoldOut === "true" ? true : isSoldOut === "false" ? false : undefined,
    };

    const { cards, totalCount } = await shopService.getShopCards(filters);
    return res.status(200).json({ cards, totalCount });
  })
);

// 포토 카드 상세 조회
router.get(
  "/cards/:shopId/:cardId",
  asyncHandle(async (req, res, next) => {
    const { cardId } = req.params;
    const cardDetails = await shopService.getShopCardById(parseInt(cardId, 10));
    return res.status(200).json(cardDetails);
  })
);

// 판매 중인 카드 수정하기
router.patch(
  "/:shopId",
  shopEditValidation,
  asyncHandle(async (req, res, next) => {
    const { shopId } = req.params;
    const { price, totalCount } = req.body;
    const updatedCard = await shopService.updateShopCard({
      shopId: parseInt(shopId, 10),
      price,
      totalCount,
    });
    return res.status(200).json(updatedCard);
  })
);

// 판매 철회
router.delete(
  "/:shopId",
  asyncHandle(async (req, res, next) => {
    const { shopId } = req.params;
    await shopService.deleteShopCard(parseInt(shopId, 10));
    return res.status(200).json({ message: "삭제되었습니다." });
  })
);

// 카드 구매하기
router.post(
  "/:shopId/purchase",
  asyncHandle(async (req, res, next) => {
    const { shopId } = req.params;
    const { count, userId } = req.body; // 판매자 id
    const buyerId = req.user.id; // 구매자 ID

    const result = await shopService.purchaseShopCard({
      shopId: parseInt(shopId, 10),
      count,
      userId,
      buyerId,
    });
    return res.status(200).json(result);
  })
);

export default router;
