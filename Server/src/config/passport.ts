// Server/src/controllers/googleAuth.ts
import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import prisma from "../prisma/prismaClient";
import keys from "../config/keys";

const client = new OAuth2Client(keys.google.clientId);

export async function handleGoogleAuth(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "ID token is required" });
    }

    // Verify the ID token
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: keys.google.clientId,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).json({ message: "Invalid token payload" });
    }

    // const googleId = payload.sub;
    // const email = payload.email;
    // const firstName = payload.given_name || "";
    // const lastName = payload.family_name || "";
    // const username = payload.name || email?.split("@")[0] || "";

    // Check if user exists
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ googliId: payload.sub }, { email: payload.email }],
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          googliId: payload.sub,
          email: payload.email || "",
          username: payload.name  || "",
          FirstName: payload. || "",
          LastName: payload.family_name|| "",
          password: "", 
          number: "", 
        },
      });
    } else if (!user.googliId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googliId: payload.sub },
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      message: "Successfully logged in with Google",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.FirstName,
        lastName: user.LastName,
      },
    });
  } catch (error: any) {
    console.error("Google Auth Error:", error);
    return res.status(401).json({
      message: "Google authentication failed",
      error: error.message,
    });
  }
}

// import { Response, Request, NextFunction } from "express";
// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import { OAuth2Client } from "google-auth-library";
// import keys from "./keys";
// import jwt from "jsonwebtoken";
// import prisma from "../prisma/prismaClient";

// const client = new OAuth2Client(keys.google.clientId);

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: keys.google.clientId,
//       clientSecret: keys.google.clientSecret,
//       callbackURL: keys.google.callbackUrl,
//     },
//     async function (
//       accessToken: string,
//       refreshToken: string,
//       profile: any,
//       done: any
//     ) {
//       try {
//         const ticket = await client.verifyIdToken({
//           idToken: accessToken,
//           audience: keys.google.clientId,
//         });

//         const payload = ticket.getPayload();
//         const ID = payload?.sub;

//         const existingUser = await prisma.user.findUnique({
//           where: { googliId: ID },
//         });

//         if (existingUser) return done(null, existingUser);

//         const user = await prisma.user.create({
//           data: {
//             googliId: profile.id,
//             username: profile.displayName,
//             email: profile.emails[0]?.value,
//             FirstName: profile.givenName,
//             LastName: profile.familyName,
//           },
//         });

//         const token = jwt.sign(
//           { userId: user.id, email: user.email, username: user.username },
//           process.env.JWT_SECRET_KEY as string,
//           { expiresIn: "1w" }
//         );

//         return done(null, user);
//       } catch (err: any) {
//         console.error(err.message);
//       }
//     }
//   )
// );

// async function googleAuthInitializer(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   return await passport.authenticate("google", { scope: ["profile", "email"] })(
//     req,
//     res,
//     next
//   );
// }

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
//       const user = req.user;

//       if (user) {
//         const token = jwt.sign(
//           { userId: user.id, email: user.email, username: user.username },
//           process.env.JWT_SECRET_KEY as string,
//           { expiresIn: "1w" }
//         );

//         // Send the token to the frontend
//         return res.status(201).json({
//           message: "Logged in with Google successfully!",
//           token,
//           user,
//         });
//       } else {
//         return res.status(400).json({
//           message: "Google authentication failed",
//         });
//       }
//     }
//   )(req, res, next);
// }

// export { googleAuthInitializer, googleRecievedAuth };

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
