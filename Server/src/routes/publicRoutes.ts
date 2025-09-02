import { Router } from "express";
import { register, logIn, logout } from "../controllers/auth";

import { handleGoogleAuth } from "../config/passport";

const public_routes = Router();

public_routes.post("/register", register);
public_routes.post("/login", logIn);
public_routes.post("/logout", logout);

public_routes.post("/refresh_Token", refreshAccessToken);

public_routes.post("/auth/google", handleGoogleAuth);

// public_routes.get("/auth/google/callback", googleRecievedAuth);

export default public_routes;
