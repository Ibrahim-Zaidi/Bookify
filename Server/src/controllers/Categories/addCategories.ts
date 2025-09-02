// this part is done statically
import { Request, Response } from "express";
import prisma from "../../prisma/prismaClient";

/* 
  name String
  description String? */

async function addCategory(req: Request, res: Response) {
  try {
    const adding = await prisma.roomCategory.create({
      data: {
        name: req.body.name,
        description: req.body.description,
      },
    });

    res.status(200).json({
      data: req.body,
      message: "this works perfectly",
      added: adding,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export default addCategory;
