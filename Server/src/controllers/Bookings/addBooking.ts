import { Request, Response } from "express";

async function addBooking(req: Request, res: Response) {
  res.status(200).json({
    data: req.body,
  });
}

export default addBooking;
