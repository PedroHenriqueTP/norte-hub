# Claro Conecta - CREATIVE DNA & STYLEBOOK (v1)

Este documento atua como a **Biblioteca de Contexto Compartilhado** e Fonte da Verdade Estética para os criadores de conteúdo e agentes de IA do projeto Claro Conecta. Seu objetivo é unificar o DNA visual da marca, evitando a deriva criativa entre diferentes sessões e garantindo o padrão de hospitalidade premium.

---

## 🎨 Pilares Visuais da Marca

1. **Vidro Translúcido (Glassmorphism):**
   * Todo contêiner de interface deve herdar a classe `.glass-premium` ou equivalente: fundo levemente translúcido (`bg-opacity-40` ou `bg-slate-900/60`), alto desfoque de fundo (`backdrop-blur-xl`) e bordas suaves quase imperceptíveis (`border-white/5`).
   
2. **Brilho Neon (Active Glow):**
   * As cores de acento de bordas e sombras neon refletem o território sintonizado no estande físico:
     * **GP F1 Interlagos:** Vermelho Claro (`#ee1d23` / HSL).
     * **SP Open Tênis:** Verde Esmeralda (`#10b981`).
     * **Bienal do Livro:** Roxo Orquídea (`#7a1b8c`).

3. **Navegação de Fluxo 5G:**
   * Vetores de conexão SVG animados cruzando a interface com fluxos pulsantes (`stroke-dashoffset`), simbolizando a malha de alta velocidade 5G que unifica o estande.

4. **Composição Multidimensional (2.5D):**
   * O Hero Section funciona como um portal dinâmico com parallax ativo controlado por mouse, separando o fundo de arena, portais temáticos em destaque (midground) e controles textuais (foreground).

---

## 📸 Parâmetros de prompts e geração de KVs (Midjourney / DALL-E)

### 🏎️ GP F1 Interlagos (Velocidade e Alta Performance)
* **Prompt Base:** `A cinematic ultra-modern F1 racing cockpit simulator at a high-tech corporate booth, dark steel textures, vibrant neon red glowing lines, dynamic speed trail light, 5G signal sphere accents, volumetric lighting, photorealistic, 8k resolution, aspect ratio 21:9 --no generic interface, bright solid colors`
* **Cores Chave:** Vermelho Claro Claro (`#ee1d23`), Carbono Metálico, Âmbar Pulsante.

### 🎾 SP Open Tênis (Energia e Movimento)
* **Prompt Base:** `A premium virtual reality tennis experience inside an open-air modern court arena, emerald green glass panels, glowing tennis ball flight trail, clean metallic design, low latency active energy lines, photorealistic, depth of field, 8k resolution, aspect ratio 21:9 --no low quality graphics`
* **Cores Chave:** Verde Esmeralda (`#10b981`), Teal, Branco Puro.

### 📚 Bienal do Livro (Catálogo e Cultura)
* **Prompt Base:** `A cozy high-definition acoustic audiobook listening cabin, floating digital books turning into purple glowing light particles, soft warm ambient light mixed with neon violet accents, premium wood and fabric materials, photorealistic, 8k resolution, aspect ratio 21:9 --no harsh contrast borders`
* **Cores Chave:** Roxo/Violeta Orquídea (`#7a1b8c`), Indigo, Soft Gold.

---

## 🚫 Negative Prompts (O que EVITAR)

* **Bordas Sólidas e Rígidas:** Evitar contraste extremo de bordas brancas ou coloridas de alta opacidade. A interface deve respirar.
* **Cores Primárias Genéricas:** Proibido usar azul puro, verde puro ou vermelho básico sem tons ajustados e gradientes harmoniosos.
* **Componentes Estáticos:** Nada deve parecer totalmente inativo. Use micro-animações, pulses em CTAs e transições de hover com delay suave.

---

## ⚙️ Diretrizes de Ingestão de Ativos (Pipeline I.A.)

Toda imagem de Key Visual (KV) ou render bruto gerado pelo time de criação deve passar obrigatoriamente pela **Pipeline de Otimização** antes de ir ao ar:
1. **Upload:** Enviar o arquivo bruto para `POST /api/assets/process`.
2. **Variantes:** A API gerará variantes específicas para Desktop, Mobile e Thumbnail.
3. **Consumo:** Utilizar o componente `<VisualAsset assetName="nome-do-kv" alt="descrição" />` para assegurar carregamento responsivo dinâmico.
