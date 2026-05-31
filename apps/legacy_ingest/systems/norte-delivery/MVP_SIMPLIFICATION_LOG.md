# MVP Simplification Log - Norte Global Hub

Este arquivo documenta as ações tomadas para simplificar a arquitetura e garantir a estabilidade do MVP.

## Ações Executadas

### 1. Poda Visual
- **Removido `AtmosphereOverlay`**: Partículas flutuantes removidas para economizar CPU.
- **Removido `LiveTelemetry`**: Logs simulados removidos do grid.
- **Removido `MiniVisualizer`**: Gráficos neon removidos dos cards.
- **Simplificado `BentoGrid`**: Agora usa um grid padrão de 4 colunas com tamanho igual e sem efeitos de hover complexos.
- **Simplificado `globals.css`**: Removidos filtros pesados de blur e opacidade do `.glass-card`.

### 2. Estabilização de Dependências
- **Removido `Puppeteer`**: Removido do `package.json` raiz para evitar travamentos no download do Chromium durante o `npm install`.

### 3. Bypass de Banco de Dados
- A interface do Hub (`apps/web`) foi configurada para operar com dados estáticos (mock), permitindo a visualização e teste de navegação mesmo com o banco de dados (Docker) desligado.

## Próximos Passos Recomendados
- Iniciar o Docker Desktop para habilitar as funcionalidades que dependem de banco.
- Rodar as migrações do Prisma assim que o banco estiver ativo.
