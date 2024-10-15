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
app.use(cors());

app.use("/users", userRouter); // 2개여서 1개 삭제함
app.use("/shop", shopRouter);
app.use("/cards", cardRouter);
app.use("/purchases", purchaseRouter);
app.use("/exchange", exchangeRouter);
app.use("/notifications", notificationRouter);
app.use("/point", pointRouter);

app.use(errorHandler);

app.listen(PORT || 3000, () => console.log("SERVER START"));
