/**
 * Build mobile-friendly image variants for hero and flavor cards.
 * Run: node scripts/generate-mobile-images.mjs
 */
import { readdir, stat } from 'node:fs/promises'
import { join, parse } from 'node:path'
import sharp from 'sharp'

const ROOT = join(process.cwd(), 'public')
const WIDTHS = [480, 960]

const TARGET_DIRS = [
  join(ROOT, 'images', 'hero'),
  join(ROOT, 'images', 'products', 'topbar-40000-colors'),
  join(ROOT, 'images', 'products', 'topbar-8000-colors'),
  join(ROOT, 'images', 'products', 'topbar-8000-colors-v1'),
  join(ROOT, 'images', 'products', 'topbar-50000-colors'),
  join(ROOT, 'images', 'products', 'topbar-60000-colors'),
]

const IMAGE_PATTERN = /\.(webp|png|jpe?g)$/i
const VARIANT_PATTERN = /-\d+w\.(webp|png|jpe?g)$/i

async function listImageFiles(dir) {
  let entries = []
  try {
    entries = await readdir(dir)
  } catch {
    return []
  }
  return entries
    .filter((name) => IMAGE_PATTERN.test(name) && !VARIANT_PATTERN.test(name))
    .map((name) => join(dir, name))
}

async function resizeImage(file) {
  const { dir, name, ext } = parse(file)

  for (const width of WIDTHS) {
    const target = join(dir, `${name}-${width}w${ext}`)
    try {
      const existing = await stat(target)
      if (existing.isFile()) continue
    } catch {
      /* create */
    }

    const pipeline = sharp(file).resize({ width, withoutEnlargement: true })
    if (ext.toLowerCase() === '.webp') {
      await pipeline.webp({ quality: 82 }).toFile(target)
    } else if (ext.toLowerCase() === '.png') {
      await pipeline.png({ compressionLevel: 9 }).toFile(target)
    } else {
      await pipeline.jpeg({ quality: 82 }).toFile(target)
    }

    console.log(`created ${target}`)
  }
}

async function main() {
  const files = (await Promise.all(TARGET_DIRS.map(listImageFiles))).flat()
  for (const file of files) {
    await resizeImage(file)
  }
  console.log(`Done. Processed ${files.length} source images.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
