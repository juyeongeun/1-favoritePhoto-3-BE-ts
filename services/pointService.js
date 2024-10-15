import pointRepository from "../repositorys/pointRepository.js";
import { getRandomPoint } from "../utils/random/random.js"; // 랜덤 유틸리티 가져옴
import createNotificationFromType from "../utils/notification/createByType.js";

/* 포인트 뽑기 */
const drawPoints = async (userId) => {
  const user = await pointRepository.getUserById(userId); // 사용자 정보 가져오기
  const currentTime = new Date(); // 현재 시간을 가져옴

  // 마지막 뽑기 시간 1사건 자났는지 확인!!
  if (user.drawtime && currentTime - user.drawtime < 3600000) {
    // 1시간 = 3600000ms
    throw new Error("1시간에 1번만 뽑을 수 있습니다.");
  }

  const drawResult = getRandomPoint(); // 랜덤 포인트 생성
  const updatedUser = await pointRepository.drawPoints(userId, drawResult);

  // 알림 생성
  await createNotificationFromType("포인트획득", {
    userId: user.id, // 사용자 ID
    nickname: user.nickname, // 로그인한 사용자의 닉네임
    point: drawResult, // 획득한 포인트
  });

  return updatedUser;
};

export default {
  drawPoints,
};
