$ErrorActionPreference = "Stop"

Write-Host "Creating Python Virtual Environment..."
python -m venv venv

Write-Host "Activating Virtual Environment..."
.\venv\Scripts\Activate.ps1

Write-Host "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

Write-Host "Setting up necessary directories..."
New-Item -ItemType Directory -Force -Path ".\skills"
New-Item -ItemType Directory -Force -Path ".\assets"

Write-Host "Setup Completed! To start the agent, run:"
Write-Host ".\venv\Scripts\Activate.ps1"
Write-Host "python main.py"
