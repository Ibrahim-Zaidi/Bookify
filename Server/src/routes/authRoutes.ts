import { Router } from "express";

import addBooking from "../controllers/Bookings/addBooking";
import removeBooking from "../controllers/Bookings/removeBooking";
import getBookings from "../controllers/Bookings/getBookings";

const auth_Routes = Router();

auth_Routes.post("/addBooking", addBooking);
auth_Routes.delete("/deleteBooking", removeBooking);
auth_Routes.get("/getBookings", getBookings);

export default auth_Routes;
