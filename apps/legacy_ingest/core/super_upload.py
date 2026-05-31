import os
import subprocess
import requests

# Configurações do PedroHenriqueTP
GITHUB_USER = "PedroHenriqueTP"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")
PROJECTS = ["agency-os", "crm-med", "st-nelson", "app-marketplace", "whatsapp-bot", "st-studio", "st-prof"]

def create_github_repo(name):
    url = "https://api.github.com/user/repos"
    data = {"name": name, "private": True}
    headers = {"Authorization": f"token {GITHUB_TOKEN}"}
    response = requests.post(url, json=data, headers=headers)
    return response.status_code in [201, 422] # 201 criado, 422 já existe

def run_git(cmd, path):
    return subprocess.run(cmd, cwd=path, shell=True, capture_output=True, text=True)

desktop = os.path.join(os.path.expanduser("~"), "Desktop")

for p in PROJECTS:
    possible_paths = [os.path.join(desktop, p), os.path.join(desktop, "app-promoin", p), os.path.join(desktop, "PROGRAMAÇÃO", p)]
    path = next((path for path in possible_paths if os.path.exists(path)), None)
    
    if path:
        print(f"🛠️ Criando repositório '{p}' no GitHub...")
        if create_github_repo(p):
            print(f"🚀 Iniciando upload de: {p}...")
            run_git("git init", path)
            run_git("git add .", path)
            run_git('git commit -m "Auto-upload: Check-up É a Norte!"', path)
            run_git("git branch -M main", path)
            
            remote = f"https://{GITHUB_USER}:{GITHUB_TOKEN}@github.com/{GITHUB_USER}/{p}.git"
            run_git(f"git remote remove origin", path)
            run_git(f"git remote add origin {remote}", path)
            
            res = run_git("git push -u origin main", path)
            if res.returncode == 0:
                print(f"✅ SUCESSO: {p} está na nuvem!")
            else:
                print(f"❌ Erro no push de {p}: {res.stderr.strip()}")
        else:
            print(f"❌ Erro ao criar repositório {p} na API.")
