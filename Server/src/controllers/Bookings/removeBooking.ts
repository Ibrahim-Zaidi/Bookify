import { Response, Request } from "express";
import prisma from "../../prisma/prismaClient";

async function removeBooking(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const deletedBooking = await prisma.booking.delete({
      where: { id: parseInt(id) },
    });

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
