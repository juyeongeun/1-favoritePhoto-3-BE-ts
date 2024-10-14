//repositorys\notificationRepository.js

import prismaClient from "../utils/prismaClient.js";

const createNotification = (data) => {
  return prismaClient.notification.create({ data });
};

const getNotificationById = (id) => {
  return prismaClient.notification.findUnique({ where: { id } });
};

const getAllNotifications = (userId) => {
  return prismaClient.notification.findMany({
    where: { userId },
    orderBy: { createAt: "desc" }, // 최신 알림 맨 위 상단에 위치
  });
};

const getNotificationsByType = (userId, type) => {
  return prismaClient.notification.findMany({
    where: { userId, type },
    orderBy: { createAt: "desc" },
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
  getNotificationsByType,
  updateNotification,
  deleteNotification,
  getNotificationById,
};
