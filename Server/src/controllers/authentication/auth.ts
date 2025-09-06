import { Response, Request } from "express";
import jwt from "jsonwebtoken";
import keys from "../../config/keys";

async function refreshAccessToken(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ message: "refresh token is abscent" });
    }

    jwt.verify(refreshToken, keys, (err: any, user: any) => {
      if (err) {
        res.status(403).json({ message: "invalid refresh token" });
      }

      const newAccessToken = jwt.sign(
        {
          clientId: user.clientId,
          email: user.email,
          username: user.username,
        },
        keys.jwtToken,
        { expiresIn: "15m" }
      );

      res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export default refreshAccessToken;
