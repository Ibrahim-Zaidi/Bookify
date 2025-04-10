import bcrypt from "bcrypt";
import "dotenv/config";

const SALT = 10;

async function hashing(password: string): Promise<string> {
  const hashed_password: string = await bcrypt.hash(password, SALT);

  return hashed_password;
}

async function compartPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const compared = await bcrypt.compare(password, hashedPassword);
  return compared;
}

export { hashing, compartPassword };
