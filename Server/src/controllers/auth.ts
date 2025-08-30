import { Response, Request } from "express";
import prisma from "../prisma/prismaClient";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import jwt from "jsonwebtoken";
import { comparePasswords, hashing } from "../utils/hash";

passport.use(
  new LocalStrategy(
    {
      usernameField: "identifier",
      passwordField: "password",
    },
    async (identifier: string, password: string, done: any) => {
      try {
        console.log(identifier);
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: identifier },
              { username: identifier },
              { number: identifier },
            ],
          },
        });

        console.log(user);

        if (!user) return done(null, false, { message: "User not found" });

        const isMatch = await comparePasswords(password, user.password);
        if (!isMatch)
          return done(null, false, { message: "Invalid credentials" });

        return done(null, user);
      } catch (err) {
        return done(err);
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

async function refreshAccessToken(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is abscent" });
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_SECRET_KEY as string,
      (err: any, user: any) => {
        if (err) {
          return res.status(403).json({ message: "Invalid refresh token" });
        }

        const newAccessToken = jwt.sign(
          {
            clientId: user.clientId,
            email: user.email,
            username: user.username,
          },
          process.env.JWT_SECRET_KEY as string,
          { expiresIn: "15m" }
        );

        return res.status(200).json({ accessToken: newAccessToken });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

async function logout(req: Request, res: Response) {
  try {
    res.clearCookie("token", { httpOnly: true });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
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

    const userFound = await prisma.user.findFirst({
      where: {
        OR: [normalized_data],
      },
    });

    if (userFound) throw new Error("you are registered already !");

    const hashedPassword = await hashing(password);

    const user = await prisma.user.create({
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

export { logIn, register, logout, refreshAccessToken };

// async function logIn(req: Request, res: Response) {
//   try {
//     const body = req.body;

//     const { email, username, number, password } = body;

//     const firstInputField = email || username || number;

//     if (firstInputField && password) {
//       const foundUser = await prismaClient.user.findFirst({
//         where: {
//           OR: [{ email, username, number }],
//         },
//       });

//       if (!foundUser)
//         throw new Error("user not found, you need to register first");

//       const passwordMatch = await comparePasswords(
//         password,
//         foundUser.password
//       );

//       if (!passwordMatch) throw new Error("wrong password!");

//       const tokenPayload = {
//         clientId: foundUser.id,
//         email: foundUser.email,
//         username: foundUser.username,
//       };

//       const token: string = jwt.sign(
//         tokenPayload,
//         process.env.JWT_SECRET_KEY as string
//       );

//       res.cookie("token", token, {
//         httpOnly: true,
//         maxAge: 36000 * 24 * 7,
//       });

//       res
//         .status(200)
//         .json({ data: req.body, message: "logged in successfully" });
//     }
//   } catch (err: any) {
//     res.status(404).json({ message: err.message });
//   }
// }
