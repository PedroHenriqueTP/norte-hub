---
name: supabase-admin-setup
description: Automatiza a configuração de administradores no Supabase executando scripts SQL locais.
---

# Supabase Admin Setup Protocol

## Descrição
Esta skill automatiza o processo de promoção de usuários a administradores no Supabase, executando scripts SQL locais diretamente no projeto vinculado via MCP ou instruindo a execução manual.

## Instruções

1.  **Localizar Script SQL**
    - Identifique e leia o arquivo `supabase/create_admin.sql` no diretório raiz do projeto.

2.  **Execução via Supabase MCP (Prioritário)**
    - Se o Supabase MCP estiver disponível e conectado:
        - Utilize a ferramenta apropriada (ex: `supabase_run_sql` ou similar disponível no contexto) para enviar o conteúdo de `create_admin.sql`.
        - Capture a saída da execução.
        - Verifique se houve sucesso (ex: "UPDATE 1" ou "INSERT 0 1") ou erros de permissão.

3.  **Fallback para Execução Manual**
    - Se o Supabase MCP **não** estiver disponível ou falhar:
        - Leia o conteúdo de `supabase/create_admin.sql`.
        - Instrua o usuário a:
            1. Copiar o código SQL exibido.
            2. Acessar o SQL Editor no Dashboard do Supabase.
            3. Colar e executar o script.
        - Forneça, se possível, o link direto para o dashboard (ex: `https://supabase.com/dashboard/project/_/sql`).

4.  **Verificação**
    - Confirme com o usuário se a execução foi realizada (seja automática ou manual) antes de prosseguir.
