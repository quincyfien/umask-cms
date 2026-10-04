import { access, mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { env } from "./env";

const driver = process.env.STORAGE_DRIVER ?? "local";
const bucket = process.env.S3_BUCKET ?? "";

let s3: S3Client | null = null;
function getS3(): S3Client {
  if (!s3) {
    s3 = new S3Client({ region: process.env.AWS_REGION ?? "af-south-1" });
  }
  return s3;
}

function localPath(key: string): string {
  return join(env.uploadDir, key);
}

export async function storagePut(key: string, body: Buffer): Promise<void> {
  if (driver === "s3") {
    await getS3().send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body }));
    return;
  }
  const path = localPath(key);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, body);
}

export async function storageGet(key: string): Promise<Buffer | null> {
  if (driver === "s3") {
    try {
      const res = await getS3().send(new GetObjectCommand({ Bucket: bucket, Key: key }));
      const bytes = await res.Body?.transformToByteArray();
      return bytes ? Buffer.from(bytes) : null;
    } catch {
      return null;
    }
  }
  try {
    return await readFile(localPath(key));
  } catch {
    return null;
  }
}

export async function storageDelete(key: string): Promise<void> {
  if (driver === "s3") {
    try {
      await getS3().send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
    } catch {
      // ignore
    }
    return;
  }
  try {
    await unlink(localPath(key));
  } catch {
    // already gone
  }
}

export async function storageExists(key: string): Promise<boolean> {
  if (driver === "s3") {
    try {
      await getS3().send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
      return true;
    } catch {
      return false;
    }
  }
  try {
    await access(localPath(key));
    return true;
  } catch {
    return false;
  }
}
