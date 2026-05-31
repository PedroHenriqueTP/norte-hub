#!/bin/bash
echo "--- Iniciando limpeza profunda ---"
find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
find . -name ".next" -type d -prune -exec rm -rf '{}' +
find . -name "__pycache__" -type d -prune -exec rm -rf '{}' +
echo "--- Limpeza concluída com sucesso! ---"
