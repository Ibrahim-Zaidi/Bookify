import { Request, Response } from "express";
import prisma from "../prisma/prismaClient";
// import { PrismaClient } from "@prisma/client";

export default async function registerController(req: Request, res: Response) {
  // res.json(req.body);

  type userInfos = {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  };

  const { email, firstName, lastName, password }: userInfos = req.body;

  try {
    if (!email || !password || !firstName || lastName) {
      throw new Error("Please Enter all your information");
    }

    const user = await prisma.user.create({
      data: {
        FirstName: firstName,
        LastName: lastName,
        email: email,
        password: password,
      },
    });

    res.status(200).send(user);
  } catch (error: any) {
    res.status(404).json({ message: error });
  }
}
