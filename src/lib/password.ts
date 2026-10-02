import { hash, verify } from "@node-rs/argon2";

export function hashPassword(password: string): Promise<string> {
  return hash(password, { memoryCost: 19456, timeCost: 2, parallelism: 1 });
}

export function verifyPassword(hashed: string, password: string): Promise<boolean> {
  return verify(hashed, password);
}

export function passwordIssues(password: string): string[] {
  const issues: string[] = [];
  if (password.length < 8 || password.length > 128) {
    issues.push("Password must be between 8 and 128 characters.");
  }
  if (!/[A-Z]/.test(password)) {
    issues.push("Password must include at least one uppercase letter.");
  }
  if (!/[0-9]/.test(password)) {
    issues.push("Password must include at least one number.");
  }
  const specials = password.replace(/[A-Za-z0-9]/g, "");
  if (specials.length < 2) {
    issues.push("Password must include at least two special characters.");
  }
  return issues;
}
