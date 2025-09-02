import { Router } from "express";
import { register, logIn, logout } from "../controllers/authentication/auth";
import { refreshAccessToken } from "../controllers/authentication/auth";
import { handleGoogleAuth } from "../config/passport";
import addRoom from "../controllers/Rooms/addRoom";
import addCategory from "../controllers/Categories/addCategories";

const public_routes = Router();

// local oauth routes

public_routes.post("/register", register);
public_routes.post("/login", logIn);
public_routes.post("/logout", logout);

//google oauht routes

public_routes.post("/refreshToken", refreshAccessToken);
public_routes.post("/auth/google", handleGoogleAuth);

// this route is for statically adding rooms and categories in the database

public_routes.post("/addRoom", addRoom);
public_routes.post("/addCategory", addCategory);

export default public_routes;
