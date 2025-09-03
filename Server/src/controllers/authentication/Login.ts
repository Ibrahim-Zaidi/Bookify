import { Request, Response } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/prismaClient";
import { comparePasswords } from "../../utils/hash";

async function logIn(req: Request, res: Response): Promise<any> {
  try {
    passport.authenticate(
      "local",
      { session: false },
      (err: any, user: any, info: any) => {
        if (err) {
          return res.status(400).json({ message: err.message });
        }
        if (!user) {
          return res
            .status(404)
            .json({ message: "User not found. plase register" });
        }

        const token = jwt.sign(
          { email: user.email, username: user.username },
          process.env.JWT_SECRET_KEY as string,
          { expiresIn: "15m" }
        );

        res.cookie("token", token, {
          httpOnly: true,
          maxAge: 36000 * 24 * 7,
        });

        return res
          .status(200)
          .json({ message: "logged in successfully", token, user });
      }
    )(req, res);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
}

export default logIn;
