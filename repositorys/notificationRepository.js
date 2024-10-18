import prismaClient from "../utils/prismaClient.js";

/* 알림 생성 */
const createNotification = (data) => {
  return prismaClient.notification.create({ data });
};

/* 주어진 ID로 알림을 조회 */
const getNotificationById = (id) => {
  return prismaClient.notification.findUnique({ where: { id } });
};

/* (현재) 알림 조회 */
const getAllNotifications = (userId) => {
  return prismaClient.notification.findMany({
    where: { userId },
    orderBy: { createAt: "desc" }, // 최신 알림 맨 위 상단에 위치
  });
};

/* 알림 상태 업데이트(읽음 여부) */
const updateNotification = ({ id, data }) => {
  return prismaClient.notification.update({
    where: { id },
    data: {
      ...data,
    },
  });
};

/* 알림 삭제 */
const deleteNotification = (id) => {
  return prismaClient.notification.delete({ where: { id: parseInt(id, 10) } });
};

export default {
  createNotification,
  getAllNotifications,
  updateNotification,
  deleteNotification,
  getNotificationById,
};
