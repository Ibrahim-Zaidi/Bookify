import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/prismaClient";
import keys from "../../config/keys";

const client = new OAuth2Client(keys.google.clientId);

async function handleGoogleAuth(req: Request, res: Response): Promise<any> {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "the id token is not available" });
    }

    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: keys.google.clientId,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(404).json({ message: "Invalid token payload" });
    }

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
          username: payload.name || "",
          FirstName: payload.given_name || "",
          LastName: payload.family_name || "",
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
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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
    return res.status(401).json({
      message: "Google authentication failed",
      error: error.message,
    });
  }
}

export default handleGoogleAuth;
