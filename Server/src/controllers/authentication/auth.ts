import { Response, Request } from "express";
import jwt from "jsonwebtoken";

async function refreshAccessToken(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ message: "refresh token is abscent" });
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_SECRET_KEY as string,
      (err: any, user: any) => {
        if (err) {
          res.status(403).json({ message: "invalid refresh token" });
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

        res.status(200).json({ accessToken: newAccessToken });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

// export { refreshAccessToken };
export default refreshAccessToken;

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
