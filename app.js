import { PORT } from "./env.js";
import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.listen(PORT || 3000, () => console.log("SERVER START"));
