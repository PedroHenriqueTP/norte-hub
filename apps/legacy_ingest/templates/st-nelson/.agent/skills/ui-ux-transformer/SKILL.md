---
name: ui-ux-transformer
description: Especialista em transformar interfaces escuras em experiências claras, luminosas e altamente interativas, usando princípios de design emocional e hierarquia visual para vendas.
---

# Objetivos Principais
1.  **Migração de Tema (Dark to Light):** Eliminar os fundos pretos pesados. A nova base deve ser branca, off-white e cinza muito claro.
2.  **Uso Estratégico de Cor:** O Vermelho (brand color) e o Preto devem ser rebaixados de cores primárias de fundo para cores de **Acento e Detalhe** (botões, ícones, títulos fortes).
3.  **Interatividade Cativante:** Implementar micro-interações e animações de scroll que tornem a navegação uma experiência fluida e impressionante.

# Diretrizes de Design (Obrigatórias)

## 1. Nova Paleta de Cores & Atmosfera
- **Fundo Principal:** Branco Puro (#FFFFFF) ou Off-White muito sutil (#F8F9FA).
- **Fundos Secundários (Seções alternadas):** Cinza claro (#F3F4F6) para criar profundidade sem pesar.
- **Texto Principal:** Cinza escuro (#1F2937 ou #374151) para leitura confortável (nunca preto puro no branco).
- **Acentos (Onde usar o Vermelho/Preto atual):**
    - Botões de CTA (Call to Action) primários.
    - Ícones de destaque.
    - Bordas sutis ou sombras suaves.

## 2. Tipografia e Hierarquia
- Como o fundo será claro, a tipografia precisa assumir o protagonismo. Use pesos de fonte contrastantes (Bold para títulos, Regular/Light para corpo).
- Aumente o espaço em branco (white space) entre elementos para dar "respiro" ao design.

## 3. Interatividade e "Wow Factor"
- **Scroll Animations:** Os elementos (como os cards de benefícios) não devem estar estáticos; eles devem deslizar suavemente para dentro da tela conforme o usuário rola (fade-in-up).
- **Hover States:** Botões e cards devem ter reações claras ao passar o mouse (sutis elevações de sombra, mudança ligeira de cor).
- **Parallax Suave:** Se houver imagens de fundo, use um parallax muito sutil para dar profundidade.

# Instruções de Execução (Passo a Passo para o Agente)

Quando ativado para redesenhar uma seção:

1.  **Análise Estrutural:** Identifique os componentes da seção atual (ex: Hero Section com Título, Subtítulo, 2 Botões e Imagem de Preview).
2.  **Aplicação do "Light Theme":** Mude o `background-color` para branco/cinza claro. Mude a cor do texto para cinza escuro.
3.  **Refinamento de Acentos:** Verifique os botões. O botão principal deve ser vermelho vibrante? O secundário deve ser apenas um contorno cinza (outline)?
4.  **Injeção de Interatividade:** Adicione as classes ou bibliotecas necessárias (ex: Framer Motion ou CSS transitions) para animar a entrada dos elementos.

# Gatilhos
Use esta skill quando o usuário pedir: "Redesenhe esta página para o tema claro", "Torne o design mais profissional e limpo", "Melhore a UI/UX para vendas", "Adicione animações de entrada".

# Exemplo de Transformação
**Input (Estado Atual):** Seção Hero com fundo preto, texto branco e botão vermelho.
**Output (Ação da Skill):**
- Fundo muda para degradê sutil de branco para cinza claro.
- Título muda para cinza chumbo (#111827).
- Subtítulo muda para cinza médio (#6B7280).
- Botão "Criar Minha Loja" permanece vermelho vibrante com sombra suave.
- Botão "Ver Demonstração" vira um botão de contorno cinza escuro.
- Adicionada animação: O título e os botões deslizam de baixo para cima suavemente ao carregar.
