import { Response, Request } from "express";
import prisma from "../../prisma/prismaClient";
import { CustomRequest } from "../../types/types";

async function getBookings(req: CustomRequest, res: Response) {
  try {
    const { id: userId } = req.user as any;

    const Bookings = await prisma.booking.findMany({
      where: {
        userId,
      },
      include: {
        room: {
          select: {
            id: true,
            name: true,
            Category: true,
            imageUrl: true,
            price: true,
          },
        },
      },
      orderBy: {
        startTime: "desc",
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
