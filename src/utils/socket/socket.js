// socket.js
export const userSockets = {};

// setupSocket 함수 정의 및 내보내기
export function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // 클라이언트로부터 유저 ID 등록 받기
    socket.on("register", ({ userId }) => {
      console.log(userId);
      userSockets[userId] = socket.id;
      console.log(`User ${userId} registered with socket ID: ${socket.id}`);
    });

    // 특정 유저에게 메시지 전송 함수
    socket.on("sendToUser", ({ userId, message }) => {
      const socketId = userSockets[userId];
      if (socketId) {
        io.to(socketId).emit("message", { content: message });
      }
    });

    // 소켓 연결 해제 시, 매핑 정보 삭제
    socket.on("disconnect", () => {
      for (const [userId, id] of Object.entries(userSockets)) {
        if (id === socket.id) {
          delete userSockets[userId];
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });
}
