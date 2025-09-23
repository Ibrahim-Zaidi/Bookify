"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
// routes
const publicRoutes_1 = __importDefault(require("./routes/publicRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const keys_1 = __importDefault(require("../src/config/keys"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authMiddlware_1 = __importDefault(require("./Middlewares/authMiddlware"));
require("dotenv/config.js");
const port = keys_1.default.port;
const app = (0, express_1.default)();
// middlewares
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        process.env.CLIENT_URL || "",
    ],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(passport_1.default.initialize());
// routes
app.use("/", publicRoutes_1.default);
app.use("/api", authMiddlware_1.default, authRoutes_1.default);
app.listen(port, () => console.log("server is running in port : " + port));
