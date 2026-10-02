import { access, mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { env } from "./env";

function localPath(key: string): string {
  return join(env.uploadDir, key);
}

export async function storagePut(key: string, body: Buffer): Promise<void> {
  const path = localPath(key);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, body);
}

export async function storageGet(key: string): Promise<Buffer | null> {
  try {
    return await readFile(localPath(key));
  } catch {
    return null;
  }
}

export async function storageDelete(key: string): Promise<void> {
  try {
    await unlink(localPath(key));
  } catch {
    // already gone
  }
}

export async function storageExists(key: string): Promise<boolean> {
  try {
    await access(localPath(key));
    return true;
  } catch {
    return false;
  }
}
