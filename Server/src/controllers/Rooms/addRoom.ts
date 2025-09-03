// this file is used to add a new room to the database statically

import { Request, Response } from "express";
import prisma from "../../prisma/prismaClient";

async function addRoom(req: Request, res: Response) {
  try {
    const { name, description, price, isAvailable, Category } = req.body;

    if (!name || !price || !Category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newRoom = await prisma.room.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        isAvailable: Boolean(isAvailable) ?? true,
        Category,
      },
    });

    res.status(200).json({
      message: "this works perfectly",
      newRoom,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export default addRoom;
