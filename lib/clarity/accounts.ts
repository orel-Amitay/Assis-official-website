import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { ensureClaritySchema, sql } from "./db";

const scryptAsync = promisify(scrypt);

export type ClarityAccount = {
  id: string;
  username: string | null;
  email: string | null;
  name: string | null;
  image: string | null;
  password_hash: string | null;
};

export function normalizeUsername(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

export function validateUsername(username: string) {
  return /^[a-z0-9._-]{3,40}$/.test(username);
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${buf.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  const expected = Buffer.from(hash, "hex");
  if (expected.length !== buf.length) return false;
  return timingSafeEqual(expected, buf);
}

export async function findUserByUsername(username: string): Promise<ClarityAccount | null> {
  await ensureClaritySchema();
  const db = sql();
  const rows = (await db`
    SELECT id, username, email, name, image, password_hash
    FROM clarity_users
    WHERE username = ${username}
    LIMIT 1
  `) as ClarityAccount[];
  return rows[0] || null;
}

export async function createPasswordUser(input: {
  username: string;
  password: string;
  name?: string;
}): Promise<ClarityAccount> {
  await ensureClaritySchema();
  const username = normalizeUsername(input.username);
  if (!validateUsername(username)) {
    throw new Error("invalid-username");
  }
  if (input.password.length < 6) throw new Error("weak-password");
  const existing = await findUserByUsername(username);
  if (existing) throw new Error("taken");
  const id = `pass:${username}`;
  const passwordHash = await hashPassword(input.password);
  const name = input.name?.trim() || username;
  const db = sql();
  await db`
    INSERT INTO clarity_users (id, username, password_hash, name, email, updated_at)
    VALUES (${id}, ${username}, ${passwordHash}, ${name}, ${null}, now())
  `;
  return {
    id,
    username,
    email: null,
    name,
    image: null,
    password_hash: passwordHash,
  };
}
