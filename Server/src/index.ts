import express from "express";
import passport from "passport";
import path from "path";

// routes
import public_routes from "./routes/publicRoutes";
import auth_Routes from "./routes/authRoutes";

import keys from "../src/config/keys";
import cors from "cors";
import cookieParser from "cookie-parser";
import authMiddleware from "./Middlewares/authMiddlware";
import "dotenv/config.js";
import bodyParser from "body-parser";

const port = keys.port;
const app = express();

// middlewares

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      process.env.CLIENT_URL || "",
    ],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "public")));

  // Define API routes first
  app.use("/", public_routes);
  app.use("/api", authMiddleware, auth_Routes);

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });
}

// routes
app.use("/", public_routes);
app.use("/api", authMiddleware, auth_Routes);

app.listen(port, () => console.log("server is running in port : " + port));
