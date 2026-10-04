import { Socket } from "node:net";

export type ScanResult = {
  status: "CLEAN" | "INFECTED" | "ERROR";
  engine?: string;
  threatName?: string;
};

function clamdScan(buffer: Buffer, host: string, port: number): Promise<ScanResult> {
  return new Promise((resolve) => {
    const socket = new Socket();
    let response = "";
    const timeout = setTimeout(() => {
      socket.destroy();
      resolve({ status: "ERROR", engine: "clamav" });
    }, 10000);

    socket.on("error", () => {
      clearTimeout(timeout);
      resolve({ status: "ERROR", engine: "clamav" });
    });
    socket.on("data", (chunk) => {
      response += chunk.toString();
    });
    socket.on("end", () => {
      clearTimeout(timeout);
      const trimmed = response.trim();
      if (trimmed.endsWith("OK")) {
        resolve({ status: "CLEAN", engine: "clamav" });
      } else {
        const threat = trimmed.split(" ").slice(1).join(" ").replace(/ FOUND$/, "");
        resolve({ status: "INFECTED", engine: "clamav", threatName: threat || "Unknown" });
      }
    });
    socket.connect(port, host, () => {
      socket.write("zINSTREAM\0");
      const chunkSize = 4096;
      for (let i = 0; i < buffer.length; i += chunkSize) {
        const chunk = buffer.subarray(i, i + chunkSize);
        const header = Buffer.alloc(4);
        header.writeUInt32BE(chunk.length, 0);
        socket.write(Buffer.concat([header, chunk]));
      }
      socket.write(Buffer.alloc(4));
    });
  });
}

export async function scanFile(buffer: Buffer): Promise<ScanResult> {
  const driver = process.env.SCAN_DRIVER ?? "none";
  if (driver === "clamav") {
    const host = process.env.CLAMD_HOST ?? "localhost";
    const port = Number(process.env.CLAMD_PORT ?? 3310);
    return clamdScan(buffer, host, port);
  }
  return { status: "CLEAN", engine: "none" };
}
