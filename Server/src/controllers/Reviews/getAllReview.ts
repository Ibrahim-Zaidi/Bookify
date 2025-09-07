import prisma from "../../prisma/prismaClient";

async function getRoomReviews(req: Request, res: Response) {
  try {
    const { roomId } = req.params;

    if (!roomId) {
      return res.status(400).json({ message: "Room ID is required" });
    }

    const reviews = await prisma.review.findMany({
      where: { roomId: parseInt(roomId) },
    });

    const ratingsOnly = reviews.filter((review) => review.rating !== null);
    const averageRating =
      ratingsOnly.length > 0
        ? ratingsOnly.reduce((sum, review) => sum + review.rating!, 0) /
          ratingsOnly.length
        : 0;

    res.status(200).json({
      reviews,
      totalReviews: reviews.length,
      averageRating: Math.round(averageRating * 10) / 10,
    });
  } catch (error) {
    console.error("Get room reviews error:", error);
    res.status(500).json({
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
}

export default getRoomReviews;
