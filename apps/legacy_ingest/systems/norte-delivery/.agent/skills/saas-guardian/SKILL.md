# Skill: SaaS Guardian (Security & Tenancy)

## Descrição
Esta skill protege o núcleo do negócio. Ela gerencia a criação de Tenants (Inquilinos/Clientes), auditoria de isolamento de dados e rotinas de autenticação (Login/Reset de Senha).

## 1. Protocolo Multi-Tenant (A Regra de Ouro)
Ao escrever ou revisar código de Backend (NestJS/Prisma), você DEVE garantir:
- **Isolamento Lógico:** Toda query no banco DEVE ter `where: { tenantId: user.tenantId }`.
- **Middleware de Contexto:** O `tenantId` deve vir do Token JWT, nunca do corpo da requisição (para evitar spoofing).

## 2. Comandos Operacionais

### 🏢 "Criar novo Tenant" / "Onboarding"
- **Ação:** Execute `scripts/create_tenant.ts`
- **O que faz:** Cria uma organização no banco, cria o usuário Admin inicial e configura as permissões básicas.

### 🔑 "Resetar senha" / "Trocar credenciais"
- **Ação:** Execute `scripts/reset_credentials.ts`
- **Uso:** `scripts/reset_credentials.ts --email admin@cliente.com --newpass 123456`
- **Atenção:** Apenas para ambiente de desenvolvimento. Em produção, use o fluxo de recuperação por email.

### 🕵️‍♂️ "Testar Isolamento" / "Security Check"
- **Ação:** Simule um ataque onde o Tenant A tenta ler dados do Tenant B.
- **Verificação:** Se a API retornar 200 com dados de outro cliente, ALERTE IMEDIATAMENTE como falha crítica.

## 3. Checklist de Autenticação (Setup)
Para implementar Auth (NestJS + Passport + JWT):
1. [ ] Guard de Autenticação Global (`JwtAuthGuard`).
2. [ ] Strategy JWT validando expiração e assinatura.
3. [ ] Decorator `@CurrentUser()` para extrair dados do request.
4. [ ] Hashing de senha com `bcrypt` ou `argon2` (Nunca salve texto puro).
