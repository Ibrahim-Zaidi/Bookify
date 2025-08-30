// import { Response, Request, NextFunction } from "express";
// import passport from "passport";
// // import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import { Strategy as LocalStrategy } from "passport-local";
// import { comparePasswords } from "../utils/hash";
// import keys from "./keys";
// import prisma from "../prisma/prismaClient";

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
//         const user = await profile;
//         // console.log(user);

//         done(null, user);
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
