import prisma from "../../prisma/prismaClient";
import { Strategy as LocalStrategy } from "passport-local";
import passport from "passport";
import { comparePasswords } from "../../utils/hash";
import Jwt from "jsonwebtoken";
import keys from "../../config/keys";
import { Request, Response } from "express";

passport.use(
  new LocalStrategy(
    {
      usernameField: "identifier",
      passwordField: "password",
    },
    async (identifier: string, password: string, done: any) => {
      try {
        const user_ = await prisma.user.findFirst({
          where: {
            OR: [
              { email: identifier },
              { username: identifier },
              { number: identifier },
            ],
          },
        });

        if (!user_) return done(null, false, { message: "User not found" });

        const isMatch = await comparePasswords(password, user_.password);
        if (!isMatch)
          return done(null, false, { message: "Invalid credentials" });

        return done(null, user_);
      } catch (err) {
        return done(err);
      }
    }
  )
);

async function logIn(req: Request, res: Response): Promise<void> {
  try {
    passport.authenticate(
      "local",
      { session: false },
      (err: any, user: any, info: any) => {
        if (err) {
          res.status(400).json({ message: err.message });
        }
        if (!user) {
          res.status(404).json({ message: "User not found. Please register" });
        }

        const token = Jwt.sign(
          { email: user.email, username: user.username, id: user.id },
          keys.jwtToken,
          { expiresIn: "7d" }
        );

        res.cookie("token", token, {
          httpOnly: true,
          maxAge: 36000 * 24 * 7, // 7 days
        });

        res.status(200).json({ message: "logged in successfully", user });
      }
    )(req, res);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

export default logIn;
