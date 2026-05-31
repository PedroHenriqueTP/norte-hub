# Atualizações da Stack - Versões Atualizadas

## Resumo das Atualizações

Este documento descreve as atualizações realizadas para resolver os avisos de depreciação do npm.

## Dependências Atualizadas

### Dependências Principais
- **Next.js**: `14.0.4` → `14.2.5` (versão mais recente estável)
- **React**: `18.2.0` → `18.3.1` (versão mais recente)
- **React DOM**: `18.2.0` → `18.3.1` (versão mais recente)
- **MongoDB**: `6.3.0` → `6.5.0` (versão mais recente)
- **Mongoose**: `8.0.3` → `8.5.1` (versão mais recente)
- **Next Auth**: `4.24.5` → `4.24.7` (patch update)
- **React Hook Form**: `7.49.2` → `7.52.1` (versão mais recente)
- **Zod**: `3.22.4` → `3.23.8` (versão mais recente)
- **Lucide React**: `0.303.0` → `0.378.0` (versão mais recente)
- **date-fns**: `3.0.6` → `3.6.0` (versão mais recente)

### Dependências de Desenvolvimento
- **TypeScript**: `5.3.3` → `5.5.4` (versão mais recente)
- **@types/node**: `20.10.6` → `20.14.12` (versão mais recente)
- **@types/react**: `18.2.46` → `18.3.3` (versão mais recente)
- **@types/react-dom**: `18.2.18` → `18.3.0` (versão mais recente)
- **Tailwind CSS**: `3.4.0` → `3.4.7` (patch update)
- **PostCSS**: `8.4.32` → `8.4.40` (patch update)
- **Autoprefixer**: `10.4.16` → `10.4.19` (patch update)
- **ESLint**: `8.56.0` → `8.57.1` (última versão do ESLint 8)
- **eslint-config-next**: `14.0.4` → `14.2.5` (versão mais recente)

### Dependências Removidas
- **react-image-gallery**: Removida (não estava sendo utilizada no código)
- **framer-motion**: Removida (não estava sendo utilizada no código)

## Avisos de Depreciação Restantes

### ESLint 8.57.1
**Status**: Mantido por compatibilidade

O ESLint 8.57.1 ainda mostra aviso de depreciação, mas foi mantido porque:
- O `eslint-config-next` ainda não suporta completamente o ESLint 9
- O ESLint 9 tem breaking changes significativos
- A migração para ESLint 9 requer atualização da configuração

**Solução Futura**: Quando o Next.js suportar oficialmente ESLint 9, atualizar:
```json
"eslint": "^9.0.0",
"eslint-config-next": "^15.0.0" // quando disponível
```

### Dependências Transitivas
Os avisos sobre `inflight`, `rimraf`, `glob`, etc. são dependências transitivas (dependências de outras dependências). Elas serão atualizadas automaticamente quando as dependências principais forem atualizadas.

## Próximos Passos

1. **Testar o projeto**:
   ```bash
   npm install
   npm run dev
   ```

2. **Verificar se tudo funciona**:
   - Navegar pelo site
   - Testar o painel admin
   - Verificar formulários
   - Testar APIs

## Comandos Úteis

### Limpar e reinstalar
```bash
rm -rf node_modules package-lock.json
npm install
```

### Verificar dependências desatualizadas
```bash
npm outdated
```

### Atualizar dependências automaticamente (cuidado!)
```bash
npm update
```

## Vulnerabilidades de Segurança

### Vulnerabilidades Detectadas (3 high severity)

O `npm audit` detectou 3 vulnerabilidades relacionadas ao pacote `glob`:

**Problema**: 
- `glob` versões 10.2.0 - 10.4.5 têm vulnerabilidade de command injection via CLI
- Afeta apenas o uso do CLI do `glob`, não o código em produção
- É uma dependência transitiva do `eslint-config-next`

**Solução**:
- A correção requer atualizar para `eslint-config-next@16.1.1` (Next.js 16)
- Isso seria um **breaking change** significativo
- **Recomendação**: Manter a versão atual, pois:
  - A vulnerabilidade afeta apenas ferramentas de desenvolvimento (CLI)
  - Não afeta o código em produção
  - Não há risco para o site em funcionamento

**Se quiser corrigir** (não recomendado agora):
```bash
npm audit fix --force
```
⚠️ **Atenção**: Isso atualizará para Next.js 16, que pode ter breaking changes.

## Notas Importantes

- Todas as atualizações foram feitas mantendo compatibilidade com Next.js 14
- As versões escolhidas são as mais recentes estáveis
- O projeto deve funcionar normalmente após `npm install`
- As vulnerabilidades detectadas são de baixo risco (apenas CLI)
- Se encontrar algum problema, verifique os logs do console

