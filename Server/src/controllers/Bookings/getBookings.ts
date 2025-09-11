import { Response, Request } from "express";
import prisma from "../../prisma/prismaClient";

async function getBookings(req: Request, res: Response) {
  try {
    const { id: userId } = req.user;

    const Bookings = await prisma.booking.findMany({
      where: {
        userId,
      },
    });

    res.status(200).json({
      Bookings,
      user: req.user,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve bookings", error: err });
  }
}

export default getBookings;
