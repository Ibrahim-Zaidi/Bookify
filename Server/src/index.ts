import express from "express";
import passport from "passport";
import path from "path";
import public_routes from "./routes/publicRoutes";
import auth_Routes from "./routes/authRoutes";
import keys from "./config/keys";
import cors from "cors";
import cookieParser from "cookie-parser";
import authMiddleware from "./Middlewares/authMiddlware";
import "dotenv/config.js";
import bodyParser from "body-parser";

const port = keys.port;
const app = express();
const __dirname = path.resolve();

// middlewares
app.use(
  cors({
    origin: [
      process.env.BASE_API_URL,
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// Routes
app.use("/api/public", public_routes);
app.use("/api/auth", authMiddleware, auth_Routes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "Server", "public")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "Server", "public", "index.html"));
  });
}

app.listen(port, () => console.log("server is running in port : " + port));
