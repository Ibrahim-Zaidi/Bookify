import express from "express";
import passport from "passport";
import "./config/passport";

import public_routes from "./routes/publicRoutes";

import keys from "../src/config/keys";
import cors from "cors";
import "dotenv/config.js";

import cookieParser from "cookie-parser";

const port = keys.port;
const app = express();

// middlewares

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// routes

app.use("/", public_routes);

// app.use("/auth", authMiddlware, authRoutes);
// app.use('/auth', authRoutes);

app.listen(port, () => console.log("server is running in port : " + port));
