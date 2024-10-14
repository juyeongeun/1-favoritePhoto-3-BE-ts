import { PORT } from "./env.js";
import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/error/errorHandler.js";
import userRouter from "./controllers/userController.js";
import shopRouter from "./controllers/shopController.js";
import cardRouter from "./controllers/cardController.js";
import purchaseRouter from "./controllers/purchaseController.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/users", userRouter); // 2개여서 1개 삭제함
app.use("/shop", shopRouter);
app.use("/cards", cardRouter);
app.use("/purchase", purchaseRouter);

app.use(errorHandler);

app.listen(PORT || 3000, () => console.log("SERVER START"));
