import { Request, Response } from "express";
import prisma from "../../prisma/prismaClient";

async function addRoom(req: Request, res: Response) {
  try {
    res.status(200).json({
      message: "this works perfectly",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export default addRoom;
