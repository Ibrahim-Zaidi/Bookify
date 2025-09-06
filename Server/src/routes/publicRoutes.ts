import { Router } from "express";

// authentication controllers
import refreshAccessToken from "../controllers/authentication/auth";
import register from "../controllers/authentication/Register";
import logIn from "../controllers/authentication/Login";
import logout from "../controllers/authentication/Logout";
import handleGoogleAuth from "../controllers/authentication/googleOAuth";
// import logIn from "../";

import addRoom from "../controllers/Rooms/addRoom";
import getAllRooms from "../controllers/Rooms/getAllRooms";

const public_routes = Router();

// local oauth routes

public_routes.post("/register", register);
public_routes.post("/login", logIn);
public_routes.post("/logout", logout);

//google authentication routes

public_routes.post("/refreshToken", refreshAccessToken);
public_routes.post("/auth/google", handleGoogleAuth);

// this route is for statically adding rooms and categories in the database

public_routes.post("/addRoom", addRoom);
public_routes.get("/getAllRooms", getAllRooms);

export default public_routes;
