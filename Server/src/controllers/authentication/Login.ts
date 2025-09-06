import prisma from "../../prisma/prismaClient";
import { Strategy as LocalStrategy } from "passport-local";
import passport from "passport";
import { comparePasswords } from "../../utils/hash";
import Jwt from "jsonwebtoken";
import keys from "../../config/keys";

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

        const token = Jwt.sign(
          { email: user.email, username: user.username, id: user.id },
          keys.jwtToken,
          { expiresIn: "15m" }
        );

        res.cookie("token", token, {
          httpOnly: true,
          maxAge: 36000 * 24 * 7,
        });

        return res
          .status(200)
          .json({ message: "logged in successfully", user });
      }
    )(req, res);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
}

export default logIn;
