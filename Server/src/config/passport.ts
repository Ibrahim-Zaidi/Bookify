import { Response, Request, NextFunction } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { OAuth2Client } from "google-auth-library";
import keys from "./keys";
import jwt from "jsonwebtoken";
import prisma from "../prisma/prismaClient";

const client = new OAuth2Client(keys.google.clientId);

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
        const ticket = await client.verifyIdToken({
          idToken: accessToken,
          audience: keys.google.clientId,
        });

        const payload = ticket.getPayload();

        // verifing the payload
        console.log(payload);

        const ID = payload?.sub;

        const existingUser = await prisma.user.findUnique({
          where: { googliId: ID },
        });

        if (existingUser) return done(null, existingUser);

        const user = await prisma.user.create({
          data: {
            googliId: profile.id,
            username: profile.displayName,
            email: profile.emails[0]?.value,
            FirstName: profile.givenName,
            LastName: profile.familyName,
          },
        });

        const token = jwt.sign(
          { userId: user.id, email: user.email, username: user.username },
          process.env.JWT_SECRET_KEY as string,
          { expiresIn: "1w" }
        );

        return done(null, user);
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
      const user = req.user;

      if (user) {
        const token = jwt.sign(
          { userId: user.id, email: user.email, username: user.username },
          process.env.JWT_SECRET_KEY as string,
          { expiresIn: "1w" }
        );

        // Send the token to the frontend
        return res.status(200).json({
          message: "Logged in with Google successfully!",
          token,
          user,
        });
      } else {
        return res.status(400).json({
          message: "Google authentication failed",
        });
      }
    }
  )(req, res, next);
}

export { googleAuthInitializer, googleRecievedAuth };

// async function googleRecievedAuth(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   await passport.authenticate(
//     "google",
//     {
//       session: false,
//       failureRedirect: "/login",
//     },
//     (req: Request, res: Response) => {
//   return res.status(200).json({
//     message: "googled successfulyy !!!",
//     data: {
//       name: req.user.displayname,
//     },
//   });
//       return res.status(200).send(req.user);
//     }
//   )(req, res, next);

// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: "identifier",
//       passwordField: "password",
//     },
//     async (identifier: string, password: string, done: any) => {
//       try {
//         const user = await prisma.user.findFirst({
//           where: {
//             OR: [
//               { email: identifier },
//               { username: identifier },
//               { number: identifier },
//             ],
//           },
//         });

//         if (!user) return done(null, false, { message: "User not found" });

//         const isMatch = await comparePasswords(password, user.password);
//         if (!isMatch)
//           return done(null, false, { message: "Invalid credentials" });

//         return done(null, user);
//       } catch (err) {
//         return done(err);
//       }
//     }
//   )
// );

// export { googleAuthInitializer, googleRecievedAuth };
