# Claro Conecta - Brand Style Guide (AAA KV Reference)

Este documento serve como a fonte absoluta da verdade para toda a renderização da interface, substituindo instruções genéricas de "blocos" por percepção visual orientada a dados fotorealistas do Key Visual (KV). 
O modelo de referência mandatário é o **`Kv_interface_gabriel_jornada_claro_5.jpeg`**.

---

## 1. A Regra da Camada Zero (Backdrop-KV)
O Key Visual **NÃO É** uma imagem de fundo estática; ele é a iluminação global.
- **Renderização de Projeção**: Os painéis de interface atuam como vidros projetados sobre a luz do fundo.
- **Translucidez (Blur)**: O brilho do fundo (vermelho neon Claro) deve atravessar o grid usando rigorosamente `backdrop-filter: blur(10px)` somado a uma base translúcida `rgba(0,0,0,0.4)` (ou `bg-black/40` no Tailwind).

## 2. Hierarquia de Proporção (Pixel-Perfect)
Não há desperdício de espaço, apenas "respiros" controlados pela proporção áurea do grid do KV.
- **Gaps e Margens**: 
  - Gaps entre os painéis: Rigorosamente `24px` (`gap-6` no Tailwind).
  - Os painéis não tocam as bordas do Viewport nem se colidem; a contenção invisível deve ser mantida.
- **Arredondamento de Bordas**: O *border-radius* deve ser constante e consistente, definido em `12px` (no máximo `1rem`/`rounded-2xl` para as áreas principais) para manter a sofisticação da UI.
- **Escala Tipográfica (KV Scale)**:
  - **Títulos**: `1.5rem` (24px) com font-weight `bold` ou `black`, tracking `-tracking-tighter`.
  - **Corpo do texto**: `0.875rem` (14px) com font-weight `medium`. Textos descritivos secundários devem usar cor rebaixada (ex: `text-[#8a8f98]`) com opacidade ao redor de `60%`.

## 3. A Semântica do Neon (Micro-Interações)
O brilho não é apenas estético, é sinalizador de estado.
- **Estado Inativo (Static)**: Bordas de componentes estáticos devem ter a opacidade reduzida para no máximo 10% ou 20% (ex: `border-white/10`).
- **Estado Interativo (Active/Hover)**: Elementos "Ao Vivo", botões em hover, ou focos de interação devem ativar o glow semântico:
  - *Box-shadow mandatário*: `box-shadow: 0 0 15px rgba(238, 29, 35, 0.4)`
  - *Cor base do Neon*: Vermelho Claro `#ee1d23`.

---

## ✅ Checklist de Validação do Agente (QA)
Sempre que o agente Antigravity, Cline ou qualquer IA parceira criar ou refatorar um componente, ela deve internamente checar e garantir as respostas para estas 3 perguntas:

1. **O componente respeita o contraste de luminância do KV original?** (A iluminação do KV não está ofuscada e o fundo está borrado através do elemento?)
2. **As bordas seguem o arredondamento (`border-radius: 12px`/`1rem`) consistente e o gap é de 24px?**
3. **A densidade de informações excede a capacidade de leitura (ruído) comparada ao modelo de referência?** (O texto secundário está ofuscando o título?)
