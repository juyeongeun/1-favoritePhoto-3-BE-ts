import { PORT } from "./env.js";
import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/error/errorHandler.js";
import userRouter from "./controllers/userController.js";
import shopRouter from "./controllers/shopController.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/users", userRouter);
app.use("/users", userRouter);
app.use("/api/shop", shopRouter);

app.use(errorHandler);

app.listen(PORT || 3000, () => console.log("SERVER START"));
