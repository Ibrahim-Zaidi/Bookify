import { Response, Request } from "express";
import prisma from "../../prisma/prismaClient";

async function removeBooking(req: Request, res: Response) {
  const { id } = req.params as any;

  try {
    const findBooking = await prisma.booking.findUnique({
      where: {
        id: parseInt(id),
      },
      select: { roomId: true },
    });

    if (!findBooking) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    // We use a transaction to delete the booking and update the room's availability

    const deletedBooking = await prisma.$transaction([
      prisma.booking.delete({
        where: {
          id: parseInt(id),
        },
      }),
      prisma.room.update({
        where: {
          id: findBooking.roomId,
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
  } catch (error: any) {
    res.status(500).json({
      message: "Booking deletion failed",
      error: error.message,
    });
  }
}

export default removeBooking;
