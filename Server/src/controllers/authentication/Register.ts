import { Request, Response } from "express";
import prisma from "../../prisma/prismaClient";
import jwt from "jsonwebtoken";
import { hashing } from "../../utils/hash";

async function register(req: Request, res: Response): Promise<any> {
  try {
    type userInfos = {
      email: string;
      firstName: string;
      lastName: string;
      password: string;
      username: string;
      number: string;
    };

    const {
      email,
      firstName,
      lastName,
      password,
      username,
      number,
    }: userInfos = req.body;

    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !username ||
      !number
    ) {
      throw new Error("Please Enter all your information!");
    }

    const normalized_data = {
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      number,
    };

    const userFound = await prisma.user.findFirst({
      where: {
        OR: [normalized_data],
      },
    });

    if (userFound) throw new Error("you are registered already !");

    const hashedPassword = await hashing(password);

    const user = await prisma.user.create({
      data: {
        FirstName: firstName,
        LastName: lastName,
        email,
        number,
        password: hashedPassword,
        username,
      },
    });

    const tokenGenerated = jwt.sign(
      { clientId: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET_KEY as string
    );

    res.cookie("token", tokenGenerated, {
      httpOnly: true,
    });

    res.status(201).header("location", "/login").json({
      token: tokenGenerated,
      message: "Registration Successful! , redirected to login",
    });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
}

export default register;
