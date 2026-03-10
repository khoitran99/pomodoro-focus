import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure these paths match your actual static asset setup before S3 upload
const INPUT_DIR = path.join(__dirname, "..", "public", "background");
const OUTPUT_DIR = path.join(__dirname, "..", "public", "thumbnails");

async function generateThumbnails() {
  if (!fs.existsSync(INPUT_DIR)) {
    console.error(`Input directory not found: ${INPUT_DIR}`);
    console.log(
      "Please ensure you have your large background images in the public/background folder.",
    );
    process.exit(1);
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const files = fs.readdirSync(INPUT_DIR).filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return [".jpg", ".jpeg", ".png", ".webp"].includes(ext);
  });

  console.log(`Found ${files.length} images to process.`);

  for (const file of files) {
    const inputPath = path.join(INPUT_DIR, file);
    // Keep the same filename so S3 mapping works easily based on our previous themes.ts logic
    const outputPath = path.join(OUTPUT_DIR, file);

    try {
      console.log(`Processing: ${file}`);
      await sharp(inputPath)
        .resize({ width: 600 }) // 600px width is perfect for the Modal grid
        .jpeg({ quality: 60 }) // High compression for thumbnails
        .toFile(outputPath);
      console.log(`  -> Saved thumbnail to ${outputPath}`);
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }

  console.log("Thumbnail generation complete!");
}

generateThumbnails();
