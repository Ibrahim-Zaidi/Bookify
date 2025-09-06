import { Response, Request, NextFunction } from "express";
import prisma from "../../prisma/prismaClient";

async function getAllRooms(req: Request, res: Response, next: NextFunction) {
  try {
    const all_rooms = await prisma.room.findMany();
    res.status(200).json({
      text: "rooms are loaded successfully",
      rooms: all_rooms,
    });
  } catch (err) {
    res.status(404).json({
      error: "something went wrong",
    });
  }
}

export default getAllRooms;
