import { Router } from "express";

import addBooking from "../controllers/Bookings/addBooking";
import removeBooking from "../controllers/Bookings/removeBooking";
import getBookings from "../controllers/Bookings/getBookings";
import logout from "../controllers/authentication/Logout";
import addReview from "../controllers/Reviews/addReview";

const auth_Routes = Router();

// logout route
auth_Routes.post("/logout", logout);

auth_Routes.post("/addBooking", addBooking);
auth_Routes.delete("/deleteBooking/:id", removeBooking);
auth_Routes.get("/getBookings", getBookings);

auth_Routes.post("/addReview", addReview);

export default auth_Routes;
