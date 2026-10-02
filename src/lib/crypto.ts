import { createHash, createHmac, randomBytes } from "node:crypto";
import { env } from "./env";

export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function hmacSign(value: string): string {
  return createHmac("sha256", env.sessionSecret).update(value).digest("base64url");
}

export function hmacVerify(value: string, signature: string): boolean {
  const expected = hmacSign(value);
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return createHmac("sha256", env.sessionSecret).update(value).digest().equals(
    Buffer.from(signature),
  );
}
