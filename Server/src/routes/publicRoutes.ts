import { Router } from "express";
import {
  register,
  logIn,
  logout,
  refreshAccessToken,
} from "../controllers/auth";

import { googleAuthInitializer, googleRecievedAuth } from "../config/passport";

const public_routes = Router();

public_routes.post("/register", register);
public_routes.post("/login", logIn);
public_routes.post("/logout", logout);
public_routes.post("/refresh_Token", refreshAccessToken);

public_routes.post("/auth/google", googleAuthInitializer);
public_routes.get("/auth/google/callback", googleRecievedAuth);

export default public_routes;
