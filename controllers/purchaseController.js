import express from "express";
import * as purchaseService from "../services/purchaseService.js";
import asyncHandle from "../utils/error/asyncHandle.js";

const router = express.Router();

// 구매 내역 조회 라우트
router.get(
  "/",
  asyncHandle(async (req, res, next) => {
    try {
      // 요청 쿼리에서 필터 값 가져오기
      const {
        page = 1,
        pageSize = 9,
        orderBy = "recent",
        keyword = "",
        grade = "",
        genre = "",
      } = req.query;

      const pageNumber = parseInt(page, 10);
      const pageSizeNumber = parseInt(pageSize, 10);

      const filters = {
        page: pageNumber,
        pageSize: pageSizeNumber,
        orderBy,
        keyword,
        grade,
        genre,
      };

      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const { cards, totalCount } = await purchaseService.getPurchaseHistory(
        userId,
        filters
      );

      return res.status(200).json({ cards, totalCount });
    } catch (error) {
      next(error);
    }
  })
);

export default router;
