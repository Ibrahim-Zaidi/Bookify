import { Request, Response } from "express";
import prisma from "../../prisma/prismaClient";

async function addBooking(req: Request, res: Response) {
  const { roomId, totalPrice, startTime, endTime } = req.body;
  const userId = req.user.id;

  try {
    // Convert types
    const roomIdInt = parseInt(roomId);
    const bookingData = {
      userId: parseInt(userId),
      roomId: roomIdInt,
      totalPrice: parseFloat(totalPrice),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    };

    // Check if room exists and is available
    const room = await prisma.room.findUnique({
      where: { id: roomIdInt },
    });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    if (!room.isAvailable) {
      return res.status(400).json({
        message: "Room is not available for booking",
      });
    }

    // Create booking and update room availability in a transaction
    const result = await prisma.$transaction([
      prisma.booking.create({
        data: bookingData,
      }),
      prisma.room.update({
        where: { id: roomIdInt },
        data: { isAvailable: false },
      }),
    ]);

    const [newBooking, updatedRoom] = result;

    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
      room: updatedRoom,
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({
      message: "Booking creation failed",
      error: error.message,
    });
  }
}

export default addBooking;
