$ErrorActionPreference = "Stop"

Write-Host "Verificando/Iniciando servidor do Ollama no Docker..." -ForegroundColor Cyan
docker-compose up -d

Write-Host "`n[Atenção] Se for a primeira vez, lembre-se de puxar o modelo LLM desejado no terminal:" -ForegroundColor Yellow
Write-Host "Exemplo: docker exec -it local_llm_brain ollama run llama3`n" -ForegroundColor Yellow

$venvPath = ".\venv\Scripts\Activate.ps1"

if (Test-Path $venvPath) {
    Write-Host "Ativando o ambiente virtual Python..." -ForegroundColor Cyan
    . $venvPath
    
    Write-Host "Iniciando o Cérebro do Agente (main.py)...`n" -ForegroundColor Green
    python main.py
} else {
    Write-Error "Ambiente virtual não foi encontrado! Por favor, execute .\setup.ps1 primeiro para instalar as dependências."
}
