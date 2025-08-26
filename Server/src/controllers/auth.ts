import { Response, Request } from "express";
import prismaClient from "../prisma/prismaClient";
import { comparePasswords, hashing } from "../utils/hash";
import jwt from "jsonwebtoken";

async function logIn(req: Request, res: Response) {
  try {
    const body = req.body;

    const { email, username, number, password } = body;

    const firstInputField = email || username || number;

    if (firstInputField && password) {
      const foundUser = await prismaClient.user.findFirst({
        where: {
          OR: [{ email, username, number }],
        },
      });

      if (!foundUser)
        throw new Error("user not found, you need to register first");

      const passwordMatch = await comparePasswords(
        password,
        foundUser.password
      );

      if (!passwordMatch) throw new Error("wrong password!");

      const tokenPayload = {
        clientId: foundUser.id,
        email: foundUser.email,
        username: foundUser.username,
      };

      const token: string = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET_KEY as string
      );

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 36000 * 24 * 7,
      });

      res
        .status(200)
        .json({ data: req.body, message: "logged in successfully" });
    }
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
}

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

    const userFound = await prismaClient.user.findFirst({
      where: {
        OR: [normalized_data],
      },
    });

    if (userFound) throw new Error("you are registered already !");

    const hashedPassword = await hashing(password);

    const user = await prismaClient.user.create({
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

export { logIn, register };
