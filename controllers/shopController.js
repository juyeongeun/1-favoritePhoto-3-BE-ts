//controllers\shopController.js

import express from "express";
import * as shopService from "../services/shopService.js";
import asyncHandle from "../utils/error/asyncHandle.js";
import { shopValidation } from "../middlewares/shop/shopValidation.js";

const router = express.Router();

// 판매할 포토카드 등록하기
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

// 판매중인 포토 카드 상세 조회
router.get(
  "/cards/:shopId/:cardId",
  asyncHandle(async (req, res, next) => {
    const { shopId, cardId } = req.params;
    const cardDetails = await shopService.getShopByShopId(
      parseInt(shopId, 10), // shopId로 상점 확인
      parseInt(cardId, 10) // cardId로 카드 확인
    );
    return res.status(200).json(cardDetails);
  })
);

// 판매 중인 카드 수정하기
router.patch(
  "/cards/:shopId/:cardId",
  shopValidation, // 등록할때와 같은 shop 유효성검사 미들웨어 사용
  asyncHandle(async (req, res, next) => {
    const { shopId } = req.params;
    const {
      price,
      totalCount,
      exchangeGrade,
      exchangeGenre,
      exchangeDescription,
    } = req.body;

    const updatedCard = await shopService.updateShopCard({
      shopId: parseInt(shopId, 10),
      price,
      totalCount,
      exchangeGrade,
      exchangeGenre,
      exchangeDescription,
      userId: req.user.id, // 수정 요청 하는 사용자의 ID 추가
    });

    return res.status(200).json(updatedCard);
  })
);

// 판매중인 카드 판매 취소(판매 내리기)
router.delete(
  "/cards/:shopId/:cardId",
  asyncHandle(async (req, res, next) => {
    const { shopId } = req.params;
    const userId = req.user.id; // JWT로부터 사용자 ID 가져오기
    await shopService.deleteShopCard(parseInt(shopId, 10), userId);
    return res.status(200).json({ message: "삭제되었습니다." });
  })
);

export default router;
