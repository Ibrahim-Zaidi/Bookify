import { Router } from "express";

import addBooking from "../controllers/Bookings/addBooking";
import removeBooking from "../controllers/Bookings/removeBooking";
import getBookings from "../controllers/Bookings/getBookings";
import logout from "../controllers/authentication/Logout";

const auth_Routes = Router();

// logout route
auth_Routes.post("/logout", logout);

auth_Routes.post("/addBooking", addBooking);
auth_Routes.delete("/deleteBooking", removeBooking);
auth_Routes.get("/getBookings", getBookings);

export default auth_Routes;
