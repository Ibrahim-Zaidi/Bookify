import { Router } from "express";
import registerController from "../controllers/registerController";

const publicRoutes = Router();

publicRoutes.post("/register", registerController);

export default publicRoutes;
