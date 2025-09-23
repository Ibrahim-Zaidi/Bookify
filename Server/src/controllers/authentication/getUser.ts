import prisma from "../../prisma/prismaClient";

import { Request, Response } from "express";
import { CustomRequest } from "../../types/types";

async function getUser(req: CustomRequest, res: Response): Promise<void> {
  const userId = req.user?.userId || req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
  });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res
    .status(200)
    .json({ id: user.id, username: user.username, email: user.email });
}

export default getUser;
