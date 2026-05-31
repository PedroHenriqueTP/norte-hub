#!/bin/bash

echo "🛡️ Configurando blindagem do .gitignore..."

FILE=".gitignore"

# Conteúdo padrão para Stack JS/TS (Next, Nest, Node)
CONTENT="
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/

# NestJS & Build
dist/
build/

# Environment Variables (CRÍTICO)
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
*.env

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
logs/
*.log

# OS / Editor
.DS_Store
.vscode/
.idea/
*.swp

# Antigravity/Agent (Opcional: ignorar histórico do agente se quiser)
#.agent/
"

if [ -f "$FILE" ]; then
    echo "⚠️ O arquivo .gitignore já existe. Verificando se contém .env..."
    if grep -q ".env" "$FILE"; then
        echo "✅ .env já está sendo ignorado."
    else
        echo "❌ PERIGO: .env não encontrado no .gitignore atual. Adicionando..."
        echo -e "\n# Security\n.env" >> "$FILE"
    fi
else
    echo "$CONTENT" > "$FILE"
    echo "✅ Arquivo .gitignore criado com sucesso."
fi
