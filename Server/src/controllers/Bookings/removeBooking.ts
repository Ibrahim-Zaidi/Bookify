import { Response, Request } from "express";
import prisma from "../../prisma/prismaClient";

async function removeBooking(req: Request, res: Response) {
  const { id } = req.params;

  try {
    // We use a transaction to delete the booking and update the room's availability

    const deletedBooking = await prisma.booking.$transaction([
      prisma.booking.delete({
        where: {
          id: parseInt(id),
        },
      }),
      prisma.room.update({
        where: {
          id: parseInt(id),
        },
        data: {
          isAvailable: true,
        },
      }),
    ]);

    res.status(200).json({
      message: "Booking deleted successfully",
      booking: deletedBooking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Booking deletion failed",
      error: error.message,
    });
  }
}

export default removeBooking;
