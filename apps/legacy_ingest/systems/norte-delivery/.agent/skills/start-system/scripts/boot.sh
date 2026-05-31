#!/bin/bash

MODE=$1

function check_docker {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ ERRO: O Docker não está rodando. Inicie o Docker Desktop primeiro."
        exit 1
    fi
}

function start_infra {
    echo "🐳 Subindo containers (Postgres)..."
    docker compose up -d
    echo "⏳ Aguardando Banco de Dados..."
    sleep 5 # Dá um tempo pro banco acordar
}

function start_backend {
    echo "🔙 Iniciando Backend (NestJS)..."
    # Ajuste o comando conforme seu package.json
    npm run start:dev --prefix apps/api &
}

function start_frontend {
    echo "🎨 Iniciando Frontend (Next.js)..."
    # Ajuste o comando conforme seu package.json
    npm run dev --prefix apps/web &
}

# Lógica principal
check_docker

if [ "$MODE" == "--infra" ]; then
    start_infra
    echo "✅ Infraestrutura pronta."
elif [ "$MODE" == "--all" ]; then
    start_infra
    start_backend
    start_frontend
    echo "🚀 Sistema completo iniciando... Acompanhe os logs."
    wait # Mantém o script rodando para segurar os processos
else
    echo "Uso: ./boot.sh [--all | --infra]"
fi
