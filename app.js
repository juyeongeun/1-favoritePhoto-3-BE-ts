import { PORT } from "./env.js";
import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/error/errorHandler.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use(errorHandler);

app.listen(PORT || 3000, () => console.log("SERVER START"));
