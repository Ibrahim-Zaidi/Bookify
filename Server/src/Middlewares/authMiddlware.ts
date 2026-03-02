import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma/prismaClient";
import keys from "../config/keys";
import { CustomRequest, CustomJwtPayload } from "../types/types";

async function authMiddleware(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies.token;

  console.log("Token from cookies : ", token);

  if (!token) {
    return res.status(401).json({
      message: "No token provided, please log in.",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      keys.jwtToken as string,
    ) as CustomJwtPayload;
    const userIdentifier = decoded.userId || decoded.id;

    console.log("decoded : ", decoded);

    const user = await prisma.user.findUnique({
      where: {
        id: userIdentifier,
      },
    });

    console.log("User from DB: ", user);

    if (!user) {
      return res.status(401).json({ message: "User not registered." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Token verification error: ", error);

    return res.status(403).json({ message: "Invalid or expired token." });
  }
}

export default authMiddleware;
