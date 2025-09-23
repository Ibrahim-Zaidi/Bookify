import { Request, Response } from "express";
import prisma from "../../prisma/prismaClient";

async function addBooking(req: Request, res: Response) {
  const { roomId, totalPrice, startTime, endTime } = req.body;

  // we get the user id from the middlware that adds the user to the request object,
  // unlike the room id which gets sent in the body

  console.log(req.user);

  const userId = req?.user.id;

  try {
    // converting types , because the values in the body are string typed

    const roomIdInt = parseInt(roomId);

    const bookingData = {
      userId: parseInt(userId),
      roomId: roomIdInt,
      totalPrice: parseFloat(totalPrice),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    };

    console.log(bookingData);

    const room = await prisma.room.findUnique({
      where: { id: roomIdInt },
    });

    if (!room) {
      res.status(404).json({
        message: "Room not found",
      });
    }

    if (!room.isAvailable) {
      res.status(400).json({
        message: "Room is not available for booking",
      });
    }

    // -we use transaction so we can make two queries at once

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
      userId: userId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Booking creation failed",
      error: error.message,
    });
  }
}

export default addBooking;
