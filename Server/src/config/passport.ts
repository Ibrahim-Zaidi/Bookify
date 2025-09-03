import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import prisma from "../prisma/prismaClient";
import { comparePasswords } from "../utils/hash";

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
