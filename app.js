import { PORT } from "./env.js";
import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/error/errorHandler.js";
import userRouter from "./controllers/userController.js";
import shopRouter from "./controllers/shopController.js";
import cardRouter from "./controllers/cardController.js";
import purchaseRouter from "./controllers/purchaseController.js";
import notificationRouter from "./controllers/notificationController.js";
import exchangeRouter from "./controllers/exchangeController.js";
import pointRouter from "./controllers/pointController.js";
import { Server } from "socket.io";
import http from "http";
import { setupSocket } from "./utils/socket/socket.js";

const app = express();
app.use(express.json());
const allowedOrigins = [
  "http://localhost:3000",
  "https://localhost:3000",
  "https://willowy-gingersnap-13564c.netlify.app",
  "https://favorite-photo-3.netlify.app/",
];

const server = http.createServer(app);

// CORS 설정
const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin); // 허용
    } else {
      callback(new Error("Not allowed by CORS")); // 허용하지 않음
    }
  },
  exposedHeaders: ["set-cookie"],
};

// Express app에 CORS 적용
app.use(cors(corsOptions));

// Socket.IO 초기화 및 CORS 설정 적용
const io = new Server(server, {
  cors: {
    origin: corsOptions.origin,
    credentials: corsOptions.credentials,
  },
});

app.use("/users", userRouter); // 2개여서 1개 삭제함
app.use("/shop", shopRouter);
app.use("/cards", cardRouter);
app.use("/purchases", purchaseRouter);
app.use("/exchange", exchangeRouter);
app.use("/notifications", notificationRouter);
app.use("/point", pointRouter);

// socket.js에 io 객체 전달
setupSocket(io);

app.use(errorHandler);

server.listen(PORT || 3000, () => console.log("SERVER START"));
