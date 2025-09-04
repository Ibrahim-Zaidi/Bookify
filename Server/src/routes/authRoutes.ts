import { Router } from "express";
import addBooking from "../controllers/Bookings/addBooking";
// import authMiddlware from "../Middlewares/authMiddlware";

const auth_Routes = Router();

auth_Routes.post("/addBooking", addBooking);

export default auth_Routes;
