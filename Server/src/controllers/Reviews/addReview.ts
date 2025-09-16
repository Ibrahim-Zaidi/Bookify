// controllers/reviewController.ts
import { Request, Response } from "express";
import prisma from "../../prisma/prismaClient";

// Add a new review
async function addReview(req: Request, res: Response) {
  try {
    const { roomId, rating, description } = req.body;
    const userId = req.user.id; // From auth middleware

    if (!roomId) {
      return res.status(400).json({ message: "Room ID is required" });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const room = await prisma.room.findUnique({
      where: {
        id: parseInt(roomId),
      },
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const newReview = await prisma.review.create({
      data: {
        userId: parseInt(userId),
        roomId: parseInt(roomId),
        rating: rating || null,
        description: description || null,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            FirstName: true,
            LastName: true,
          },
        },
        room: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Review added successfully",
      review: newReview,
    });
  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({
      message: "Failed to add review",
      error: error.message,
    });
  }
}

export default addReview;
