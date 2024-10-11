import * as cardRepository from "../repositorys/cardRepository.js";

// 카드 생성
export const createCard = async (data) => {
  try {
    return await cardRepository.createCard(data);
  } catch (error) {
    throw new Error("카드 생성 중 오류 발생");
  }
};

// 모든 카드 조회
export const getUserCards = async (filters) => {
  try {
    // 카드 목록을 조회하는 리포지토리 호출
    const { cards, nextCursor } = await cardRepository.getUserCards(filters);
    return { cards, nextCursor };
  } catch (error) {
    throw new Error("사용자 카드 목록 조회 중 오류 발생");
  }
};

// 카드 ID로 카드 조회
export const getCardById = async (id) => {
  const card = await cardRepository.getCardById(id);
  if (!card) {
    const error = new Error("카드를 찾을 수 없습니다.");
    error.status = 404;
    error.data = { code: "CARD_NOT_FOUND" };
    throw error;
  }
  return card;
};

// 카드 삭제
export const deleteCard = async (id, userId) => {
  const card = await cardRepository.getCardById(id);
  if (!card) {
    const error = new Error("카드를 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }

  if (card.userId !== userId) {
    const error = new Error("삭제 권한이 없습니다.");
    error.status = 403;
    throw error;
  }

  try {
    return await cardRepository.deleteCard(id);
  } catch (error) {
    throw new Error("카드 삭제 중 오류 발생");
  }
};

export const updateCard = async (data) => {
  try {
    return await cardRepository.updateCard(data);
  } catch (error) {
    throw new Error("카드 수정 중 오류 발생");
  }
};
