import notificationRepository from "../repositorys/notificationRepository.js";

/* 알림 경과시간 계산 */
const calculateTime = (createAt) => {
  const now = new Date();
  const createdTime = new Date(createAt);
  const timeDiff = now - createdTime; // 밀리초 단위 차이

  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years}년 전`;
  if (months > 0) return `${months}개월 전`;
  if (weeks > 0) return `${weeks}주일 전`;
  if (days > 0) return `${days}일 전`;
  if (hours > 0) return `${hours}시간 전`;
  if (minutes > 0) return `${minutes}분 전`;
  return `${seconds}초 전`;
};

/* 알림 생성 */
const createNotification = async (data) => {
  return await notificationRepository.createNotification(data);
};

/* 현재까지 온 (전체) 알림 조회 */
const getAllNotifications = async (userId) => {
  const notifications = await notificationRepository.getAllNotifications(
    userId
  );

  return notifications.map((notification) => ({
    ...notification,
    timeAgo: calculateTime(notification.createAt), // 알림 경과 시간 추가
  }));
};

/* 특정 알림 조회 */
const getNotificationById = async (id) => {
  const notification = await notificationRepository.getNotificationById(
    parseInt(id, 10)
  );
  if (!notification) {
    const error = new Error("알림을 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }

  // 경과 시간 추가
  return {
    ...notification,
    timeAgo: calculateTime(notification.createAt),
  };
};

/* 알림 업데이트 */
const updateNotification = async (id, data) => {
  const notification = await notificationRepository.getNotificationById(
    parseInt(id, 10)
  );

  if (!notification) {
    const error = new Error("알림을 찾을 수 없습니다.");
    error.status = 404; // 404 상태 코드 설정
    error.data = {
      notificationId: id, // 알림 ID 포함
    };
    throw error;
  }

  // 'read' 필드만 업데이트하도록 필터링
  const updateData = {};
  if (data.read !== undefined) {
    updateData.read = data.read;
  }

  return await notificationRepository.updateNotification({
    id: parseInt(id, 10), // id 객체로 전달
    data: updateData,
  });
};

/* 알림 삭제 */
const deleteNotification = async (id) => {
  const notification = await notificationRepository.getNotificationById(
    parseInt(id, 10)
  );

  if (!notification) {
    const error = new Error("알림을 찾을 수 없습니다.");
    error.status = 404; // 404 상태 코드 설정
    error.data = {
      notificationId: id, // 알림 ID 포함
    };
    throw error;
  }

  return await notificationRepository.deleteNotification(id);
};

export default {
  createNotification,
  deleteNotification,
  getAllNotifications,
  updateNotification,
  getNotificationById,
};
