import * as cardRepository from "../repositorys/cardRepository.js";

// 카드 생성
const createCard = async (data) => {
  try {
    return await cardRepository.createCard(data);
  } catch (error) {
    throw new Error("카드 생성 중 오류 발생");
  }
};

// 카드 가격 수정
const updateCard = async (data) => {
  try {
    return await cardRepository.updateCard(data);
  } catch (error) {
    console.error("서비스 레벨 카드 수정 중 오류 발생:", error.message);
    throw new Error("카드 수정 중 오류 발생");
  }
};

export { createCard, updateCard };
