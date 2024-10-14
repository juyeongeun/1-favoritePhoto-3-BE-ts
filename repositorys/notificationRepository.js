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

const updateNotification = ({ id, data }) => {
  return prismaClient.notification.update({
    where: { id },
    data,
  });
};

const deleteNotification = (id) => {
  return prismaClient.notification.delete({ where: { id } });
};

export default {
  createNotification,
  getAllNotifications,
  getNotificationsByType,
  updateNotification,
  deleteNotification,
  getNotificationById,
};
