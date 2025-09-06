import express from "express";
import passport from "passport";
import "./config/passport";

// routes
import public_routes from "./routes/publicRoutes";
import auth_Routes from "./routes/authRoutes";

import keys from "../src/config/keys";
import cors from "cors";
import cookieParser from "cookie-parser";
import authMiddleware from "./Middlewares/authMiddlware";
import "dotenv/config.js";

const port = keys.port;
const app = express();

// middlewares

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// routes

app.use("/", public_routes);
app.use("/api", authMiddleware, auth_Routes);

app.listen(port, () => console.log("server is running in port : " + port));
