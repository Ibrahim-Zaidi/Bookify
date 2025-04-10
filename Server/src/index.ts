import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import publicRoutes from "./routes/publicRoutes";
import "dotenv/config.js";

const port = process.env.PORT || 3000;
const app = express();

// middlewares

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/", publicRoutes);

app.listen(port, () => console.log("server is running in port : " + port));
