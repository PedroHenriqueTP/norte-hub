#!/bin/zsh

# 1. VARIÁVEIS DE AMBIENTE (O Pulo do Gato)
# Substitua pelo seu token real da Anthropic ou OpenAI
export ANTHROPIC_API_KEY="sk-ant-..." 

# 2. DEFINIÇÃO DE CAMINHOS
PROJECT_DIR="/Users/$(whoami)/Desktop/NORTE_ECOSYSTEM"
HUB_DIR="$PROJECT_DIR/systems/norte-hub"

echo ">>> INICIANDO SISTEMA NORTE NO MAC MINI..."

# 3. ABRIR VS CODE NO PROJETO
if command -v code >/dev/null; then
    code $PROJECT_DIR
    echo ">>> VS Code: Ativo."
else
    echo "!!! Erro: Comando 'code' não encontrado. Instale o VS Code CLI."
fi

# 4. LANÇAR TERMINAIS DE APOIO (Split Panes)
# Abre o servidor de desenvolvimento do Next.js
osascript -e 'tell application "Terminal" to do script "cd '$HUB_DIR' && npm run dev"'

# 5. LANÇAR O AGENTE AUTÔNOMO (Aider)
# O Aider já vai ler a API Key que exportamos no passo 1
echo ">>> Despertando Agente de Terminal (Aider)..."
osascript -e 'tell application "Terminal" to do script "cd '$HUB_DIR' && aider"'

echo ">>> SISTEMA EM ÓRBITA. BOM JOGO, CAPITÃO."
