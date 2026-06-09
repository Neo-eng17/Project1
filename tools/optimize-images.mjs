import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outputDir = path.join(root, "assets", "images", "optimized");
const supported = new Set([".png", ".jpg", ".jpeg"]);
const skipDirs = new Set([".git", "node_modules", "assets"]);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!skipDirs.has(entry.name)) files.push(...await walk(path.join(dir, entry.name)));
      continue;
    }
    if (supported.has(path.extname(entry.name).toLowerCase())) files.push(path.join(dir, entry.name));
  }

  return files;
}

await mkdir(outputDir, { recursive: true });

const files = await walk(root);

await Promise.all(files.map(async (file) => {
  const name = path.basename(file, path.extname(file)).replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const image = sharp(file).rotate();

  await Promise.all([
    image.clone().resize({ width: 1440, withoutEnlargement: true }).webp({ quality: 78 }).toFile(path.join(outputDir, `${name}.webp`)),
    image.clone().resize({ width: 1440, withoutEnlargement: true }).avif({ quality: 52 }).toFile(path.join(outputDir, `${name}.avif`)),
    image.clone().resize({ width: 32, withoutEnlargement: true }).blur(8).webp({ quality: 35 }).toFile(path.join(outputDir, `${name}-placeholder.webp`))
  ]);
}));

console.log(`Optimized ${files.length} images into ${path.relative(root, outputDir)}`);
