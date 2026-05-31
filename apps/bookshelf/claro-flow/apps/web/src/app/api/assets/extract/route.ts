import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const prompt = formData.get('prompt') as string | null
    const name = formData.get('name') as string | 'Ativo'
    const territorio = formData.get('territorio') as string | 'Geral'

    if (!file) {
      return NextResponse.json({ success: false, error: 'Nenhum arquivo enviado.' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // 1. Analyze image using sharp to extract dominant color
    let hexColor = '#ee1d23'
    let rgbColor = { r: 238, g: 29, b: 35 }
    let hslColor = { h: 358, s: 85, l: 53 }
    let dimensions = { width: 0, height: 0 }
    let format = 'png'

    try {
      const sharpModule = await import('sharp')
      const sharp = sharpModule.default

      const metadata = await sharp(buffer).metadata()
      dimensions = { width: metadata.width || 0, height: metadata.height || 0 }
      format = metadata.format || 'png'

      // Resize to 5x5 raw pixels to get an average dominant color
      const { data: rawPixels, info } = await sharp(buffer)
        .resize(5, 5, { fit: 'cover' })
        .raw()
        .toBuffer({ resolveWithObject: true })

      let rSum = 0, gSum = 0, bSum = 0
      const pixelCount = info.width * info.height

      for (let i = 0; i < rawPixels.length; i += info.channels) {
        rSum += rawPixels[i]
        gSum += rawPixels[i + 1]
        bSum += rawPixels[i + 2]
      }

      const r = Math.round(rSum / pixelCount)
      const g = Math.round(gSum / pixelCount)
      const b = Math.round(bSum / pixelCount)

      rgbColor = { r, g, b }
      hexColor = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')

      // Convert RGB to HSL
      const rNorm = r / 255
      const gNorm = g / 255
      const bNorm = b / 255
      const max = Math.max(rNorm, gNorm, bNorm)
      const min = Math.min(rNorm, gNorm, bNorm)
      let h = 0, s = 0, l = (max + min) / 2

      if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
          case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break
          case gNorm: h = (bNorm - rNorm) / d + 2; break
          case bNorm: h = (rNorm - gNorm) / d + 4; break
        }
        h /= 6
      }

      hslColor = {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
      }

    } catch (e) {
      console.warn("Sharp analysis failed, utilizing brand defaults:", e)
    }

    // 2. Parse styling keywords from the prompt text
    const styleTags: string[] = []
    const conformidadeTags: string[] = []
    let promptScore = 0

    if (prompt) {
      const promptLower = prompt.toLowerCase()
      
      const keywords = {
        iluminacao: ['volumetric', 'neon', 'glow', 'warm', 'cold', 'backlight', 'sunset', 'golden hour', 'studio light', 'directional'],
        estilo: ['cinematic', 'photorealistic', '8k', '3d', 'realistic', 'glassmorphism', 'abstract', 'futuristic', 'modern'],
        camera: ['depth of field', 'dof', 'wide angle', 'tilt-shift', 'macro', 'portrait', 'isometric'],
        texturas: ['metallic', 'steel', 'carbon fiber', 'wood', 'fabric', 'glossy', 'matte', 'acrylic']
      }

      Object.entries(keywords).forEach(([cat, list]) => {
        list.forEach(kw => {
          if (promptLower.includes(kw)) {
            styleTags.push(kw)
            promptScore += 2
          }
        })
      })

      // Conformity checks
      const badWords = ['generic', 'low quality', 'blurry', 'cheap', 'poorly drawn', 'ugly']
      badWords.forEach(w => {
        if (promptLower.includes(w)) {
          conformidadeTags.push(`Evitar termo: "${w}"`)
          promptScore -= 5
        }
      })

      if (promptLower.includes('claro') || promptLower.includes('5g')) {
        promptScore += 3
        conformidadeTags.push('DNA Claro Alinhado')
      }
    }

    const processedAt = new Date().toLocaleDateString('pt-BR')

    // 3. Append metadata to CREATIVE_DNA.md
    const dnaPath = path.join(process.cwd(), 'CREATIVE_DNA.md')
    if (fs.existsSync(dnaPath)) {
      try {
        let dnaContent = fs.readFileSync(dnaPath, 'utf8')
        
        // Append section if it doesn't exist
        if (!dnaContent.includes('## 📁 Catálogo de Referências Validadas')) {
          dnaContent += '\n\n---\n\n## 📁 Catálogo de Referências Validadas\n\nEsta seção reúne as assinaturas e prompts de KVs aprovados pelo time de criação.'
        }

        const newEntry = `

### 🏷️ ${name} (${territorio})
* **Processado em:** ${processedAt}
* **Dimensões:** ${dimensions.width}x${dimensions.height} px (${format})
* **Cor Dominante:** HEX \`${hexColor}\` | HSL \`hsl(${hslColor.h}, ${hslColor.s}%, ${hslColor.l}%)\` | RGB \`rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})\`
* **Prompt Original:** \`${prompt || 'Não fornecido'}\`
* **Palavras-chave Identificadas:** ${styleTags.length > 0 ? styleTags.join(', ') : 'Nenhuma'}
* **Score de Conformidade Estética:** ${promptScore > 0 ? `🚀 ${promptScore} PTS` : '⚠️ 0 PTS'} (${conformidadeTags.length > 0 ? conformidadeTags.join('; ') : 'Sem anotações'})`

        dnaContent += newEntry
        fs.writeFileSync(dnaPath, dnaContent, 'utf8')
      } catch (err) {
        console.error("Failed to append to CREATIVE_DNA.md:", err)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Estilo do ativo analisado e registrado com sucesso.',
      data: {
        name,
        territorio,
        color: { hex: hexColor, rgb: rgbColor, hsl: hslColor },
        prompt: {
          original: prompt,
          score: promptScore,
          tags: styleTags,
          conformity: conformidadeTags
        },
        dimensions,
        format,
        processedAt
      }
    })

  } catch (error: any) {
    console.error("Asset extraction API error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
