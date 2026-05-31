
# Skill: Bug Buster (Auto-Fix)

## Descrição
Esta skill é ativada quando o usuário relata um erro (cola um stack trace) ou o build falha. O objetivo é analisar a causa raiz, localizar o arquivo culpado e propor a correção cirúrgica.

## Protocolo de Resgate (The ER Room)
Quando o usuário colar um erro (ex: "Unhandled Runtime Error", "Hydration failed"):

1. **Triagem:** Identifique o erro chave.
   - *Exemplo da imagem:* "Target ref is defined but not hydrated" -> Problema de ref no Framer Motion.

2. **Localização:** Olhe para o "Call Stack".
   - Procure pelo primeiro arquivo que pertence ao projeto (ignore `node_modules`).

3. **Investigação:**
   - LEIA o arquivo suspeito usando a ferramenta de leitura de arquivos.
   - Procure por padrões perigosos (ex: `useScroll` sem verificar se o componente montou, ou `window` is not defined).

4. **Correção:**
   - Se for erro de Framer Motion/Ref: Sugira adicionar um check `if (!ref.current) return null;` ou mover a lógica para um `useEffect`.
   - Se for erro de Hidratação: Sugira usar `useEffect` para rodar o código apenas no client-side ou dynamic import com `ssr: false`.

## Modo de Ação
NUNCA reescreva o arquivo inteiro se não for necessário. Apenas aplique o patch na função quebrada.
