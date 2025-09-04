import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import prisma from "../../prisma/prismaClient";
import { comparePasswords } from "../../utils/hash";
import Jwt from "jsonwebtoken";

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

        if (!user_) done(null, false, { message: "User not found" });

        const isMatch = await comparePasswords(password, user_.password);
        if (!isMatch) done(null, false, { message: "Invalid credentials" });

        done(null, user_);
      } catch (err) {
        done(err);
      }
    }
  )
);

export async function logIn(req: Request, res: Response): Promise<any> {
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

        const token = Jwt.sign(
          { email: user.email, username: user.username, id: user.id },
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

// default export logIn;
