import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request {
  user?: {
    id: string;
  };
}

export interface CustomJwtPayload extends JwtPayload {
  userId: string;
}
