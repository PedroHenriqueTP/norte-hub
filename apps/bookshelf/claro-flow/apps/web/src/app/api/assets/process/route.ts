import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const name = formData.get('name') as string | null
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'Nenhum arquivo enviado.' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Output directory in public folder
    const outputDir = path.join(process.cwd(), 'public', 'kv-processed')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    const baseName = (name || file.name).replace(/\.[^/.]+$/, "").toLowerCase().trim()
    const ext = '.png' // Convert everything to png for consistent visual rendering

    const desktopPath = path.join(outputDir, `${baseName}-desktop${ext}`)
    const mobilePath = path.join(outputDir, `${baseName}-mobile${ext}`)
    const thumbnailPath = path.join(outputDir, `${baseName}-thumb${ext}`)
    const originalPath = path.join(outputDir, `${baseName}-original${ext}`)

    // Write original file
    await fs.promises.writeFile(originalPath, buffer)

    let compressed = false
    let compressionError: string | null = null

    try {
      // Dynamic import of sharp to avoid node compilation locks during build runtime
      const sharpModule = await import('sharp')
      const sharp = sharpModule.default

      // Resize and optimize variants
      await sharp(buffer)
        .resize(1200, null, { withoutEnlargement: true })
        .png({ quality: 85, compressionLevel: 8 })
        .toFile(desktopPath)

      await sharp(buffer)
        .resize(640, null, { withoutEnlargement: true })
        .png({ quality: 80, compressionLevel: 8 })
        .toFile(mobilePath)

      await sharp(buffer)
        .resize(150, 150, { fit: 'cover' })
        .png({ quality: 75, compressionLevel: 7 })
        .toFile(thumbnailPath)

      compressed = true
    } catch (e: any) {
      console.warn("Sharp dynamic processing failed, falling back to writing original buffers:", e)
      compressionError = e.message
      
      // Fallback: write original buffer to all variant paths
      await fs.promises.writeFile(desktopPath, buffer)
      await fs.promises.writeFile(mobilePath, buffer)
      await fs.promises.writeFile(thumbnailPath, buffer)
    }

    // Read variant sizes
    const getFileSize = (filePath: string) => {
      try {
        return fs.statSync(filePath).size
      } catch {
        return 0
      }
    }

    const originalSize = getFileSize(originalPath)
    const desktopSize = getFileSize(desktopPath)
    const mobileSize = getFileSize(mobilePath)
    const thumbSize = getFileSize(thumbnailPath)

    // Update local JSON registry
    const registryPath = path.join(outputDir, 'registry.json')
    let registry: Record<string, any> = {}

    if (fs.existsSync(registryPath)) {
      try {
        registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'))
      } catch (err) {
        console.error("Failed to read existing registry, recreating:", err)
      }
    }

    const assetMeta = {
      name: baseName,
      ext,
      originalSize,
      processedAt: new Date().toISOString(),
      compressed,
      compressionError,
      variants: {
        desktop: { url: `/kv-processed/${baseName}-desktop${ext}`, size: desktopSize },
        mobile: { url: `/kv-processed/${baseName}-mobile${ext}`, size: mobileSize },
        thumbnail: { url: `/kv-processed/${baseName}-thumb${ext}`, size: thumbSize },
        original: { url: `/kv-processed/${baseName}-original${ext}`, size: originalSize }
      }
    }

    registry[baseName] = assetMeta
    fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2))

    return NextResponse.json({
      success: true,
      message: compressed ? 'Ativo otimizado com sucesso.' : 'Ativo processado em modo fallback.',
      data: assetMeta
    })

  } catch (error: any) {
    console.error("Asset processing API error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
