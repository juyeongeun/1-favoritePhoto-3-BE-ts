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

const app = express();
app.use(express.json());
const allowedOrigins = ["http://localhost:3000", "https://localhost:3000"];

app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      // origin이 undefined이면 (로컬 개발 환경에서 Postman 사용 시)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin); // 허용
      } else {
        callback(new Error("Not allowed by CORS")); // 허용하지 않음
      }
    },
    exposedHeaders: ["set-cookie"],
  })
);

app.use("/users", userRouter); // 2개여서 1개 삭제함
app.use("/shop", shopRouter);
app.use("/cards", cardRouter);
app.use("/purchases", purchaseRouter);
app.use("/exchange", exchangeRouter);
app.use("/notifications", notificationRouter);
app.use("/point", pointRouter);

app.use(errorHandler);

app.listen(PORT || 3000, () => console.log("SERVER START"));
