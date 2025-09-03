import { Request, Response } from "express";

async function logout(req: Request, res: Response) {
  try {
    res.clearCookie("token", { httpOnly: true });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
}
export default logout;
