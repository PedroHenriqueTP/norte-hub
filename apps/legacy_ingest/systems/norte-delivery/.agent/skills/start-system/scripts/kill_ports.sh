#!/bin/bash
echo "🧹 Faxina nas portas..."

# Mata processos nas portas comuns (ajuste conforme seu projeto)
# Note: lsof/kill might require adjustments on Windows (Git Bash/WSL)
# For standard Windows CMD/PowerShell, a different approach is needed, 
# but providing bash as requested for compatibility with Unix-like envs (or WSL).
pids=$(lsof -ti:3000,3001,8080)

if [ -z "$pids" ]; then
    echo "✅ Nenhuma porta presa encontrada."
else
    echo "🔪 Matando processos: $pids"
    kill -9 $pids
    echo "✅ Portas liberadas."
fi
