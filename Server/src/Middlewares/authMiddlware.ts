import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma/prismaClient";
import keys from "../config/keys";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  console.log("cookies : " + req.cookies.token);

  if (!token) {
    return res.status(401).json({
      message: "No token provided, please log in.",
      token: req.cookies,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

    console.log("decoded : " + decoded);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    console.log("user : " + user);

    if (!user) {
      return res.status(401).json({ message: "User not registered." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

export default authMiddleware;
