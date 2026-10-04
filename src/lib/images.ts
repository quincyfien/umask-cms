import sharp from "sharp";

export type ImageVariant = { width: number; buffer: Buffer };

export async function generateWebpVariants(buffer: Buffer): Promise<ImageVariant[]> {
  const meta = await sharp(buffer).metadata();
  const originalWidth = meta.width ?? 1600;
  const widths = [480, 960, 1600].filter((w) => w <= originalWidth);
  if (widths.length === 0) widths.push(originalWidth);

  const variants: ImageVariant[] = [];
  for (const width of widths) {
    variants.push({
      width,
      buffer: await sharp(buffer)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer(),
    });
  }
  return variants;
}

export async function stripExif(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer).rotate().toBuffer();
}
