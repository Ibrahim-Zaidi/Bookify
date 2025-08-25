import {compare, hash as hashPassword} from "bcrypt";
import "dotenv/config";

const SALT = 10;

async function hashing(password: string): Promise<string> {
  return await hashPassword(password, SALT);
}

async function comparePasswords(
  password: string,
  hashedPassword: string

): Promise<boolean> {

  return await compare(password, hashedPassword);
}

export { hashing, comparePasswords };
