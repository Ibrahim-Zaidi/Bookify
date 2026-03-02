import { Request, Response } from "express";
import prisma from "../../prisma/prismaClient";
import { CustomRequest } from "../../types/types";

async function removeReview(req: CustomRequest, res: Response) {
  try {
    const { id } = req.params as any;
    const userId = req.user.id as any;

    if (!id) {
      return res.status(400).json({ message: "Review ID is required" });
    }

    const review = await prisma.review.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await prisma.review.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete review",
      error: error.message,
    });
  }
}

export default removeReview;
