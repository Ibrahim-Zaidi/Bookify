import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request {
  user?: {
    id: string | number | any;
  };
}

export interface CustomJwtPayload extends JwtPayload {
  userId: string | number | any;
}
