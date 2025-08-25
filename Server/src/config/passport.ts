import { Response, Request, NextFunction } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import keys from "./keys";
import prisma from "../prisma/prismaClient";

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.google.clientId,
      clientSecret: keys.google.clientSecret,
      callbackURL: keys.google.callbackUrl,
    },
    async function (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) {
      try {
        const user = await profile;
        // console.log(user);

        done(null, user);
      } catch (err: any) {
        console.error(err.message);
      }
    }
  )
);

async function googleAuthInitializer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  return await passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next
  );
}

async function googleRecievedAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  await passport.authenticate(
    "google",
    {
      session: false,
      failureRedirect: "/login",
    },
    (req: Request, res: Response) => {
      //   return res.status(200).json({
      //     message: "googled successfulyy !!!",
      //     data: {
      //       name: req.user.displayname,
      //     },
      //   });
      return res.status(200).send(req.user);
    }
  )(req, res, next);
}

export { googleAuthInitializer, googleRecievedAuth };
