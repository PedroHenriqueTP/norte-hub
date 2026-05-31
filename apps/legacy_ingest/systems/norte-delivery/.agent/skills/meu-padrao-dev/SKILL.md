# Skill: Padrão de Desenvolvimento (Pedrão Style)

## Descrição
Esta skill deve ser ativada sempre que o usuário solicitar geração de código, refatoração ou criação de novas features. Ela garante que o código siga a stack moderna do projeto e as preferências do desenvolvedor.

## Stack Obrigatória
- **Framework:** Next.js (App Router). NUNCA usar Pages Router.
- **Linguagem:** TypeScript (Strict mode). Sempre tipar props e retornos.
- **Estilização:** Tailwind CSS. Evitar CSS modules ou Styled Components.
- **Backend/DB:** Prisma ORM.
- **Validação:** Zod (para forms e API inputs).
- **Icons:** Lucide React.

## Regras de Ouro
1. **Server Actions:** Dê preferência a Server Actions em vez de criar rotas de API manuais para mutações simples.
2. **Componentização:** Se um componente tiver mais de 150 linhas, sugira quebrá-lo.
3. **Clean Code:**
   - Use `const` para tudo, evite `let`.
   - Use *Early Returns* para evitar "if hell".
   - Nomes de variáveis em Inglês, comentários explicativos em Português.
4. **Mobile First:** Comece o Tailwind pelo mobile e use `md:` ou `lg:` para telas maiores.

## Ferramentas
- Execute `scripts/get_tree.py` para entender a estrutura de pastas antes de criar novos arquivos.
