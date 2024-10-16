import cardRepository from "../repositorys/cardRepository.js";

// 카드 생성
const createCard = async (data) => {
  try {
    return await cardRepository.createCard(data);
  } catch (error) {
    throw new Error("카드 생성 중 오류 발생");
  }
};

export default { createCard };
