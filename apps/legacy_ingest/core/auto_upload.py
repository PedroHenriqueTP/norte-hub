import os
import subprocess

# Configurações do PedroHenriqueTP
GITHUB_USER = "PedroHenriqueTP"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")
# Lista baseada no seu inventário de projetos SaaS e Acadêmicos
PROJECTS = ["agency-os", "crm-med", "delivery-platform", "st-nelson", "app-marketplace", "whatsapp-bot"]

def run_git(cmd, path):
    return subprocess.run(cmd, cwd=path, shell=True, capture_output=True, text=True)

desktop = os.path.join(os.path.expanduser("~"), "Desktop")

for p in PROJECTS:
    # Busca o projeto na raiz do Desktop ou dentro de subpastas conhecidas
    possible_paths = [
        os.path.join(desktop, p),
        os.path.join(desktop, "app-promoin", p),
        os.path.join(desktop, "PROGRAMAÇÃO", p)
    ]
    
    path = next((path for path in possible_paths if os.path.exists(path)), None)
    
    if path:
        print(f"🚀 [É a Norte!] Iniciando upload de: {p}...")
        run_git("git init", path)
        run_git("git add .", path)
        run_git('git commit -m "Check-up É a Norte! - Sincronização Nuvem"', path)
        run_git("git branch -M main", path)
        
        # URL de autenticação forçada com seu Token
        remote = f"https://{GITHUB_USER}:{GITHUB_TOKEN}@github.com/{GITHUB_USER}/{p}.git"
        run_git(f"git remote remove origin", path)
        run_git(f"git remote add origin {remote}", path)
        
        res = run_git("git push -u origin main", path)
        if res.returncode == 0:
            print(f"✅ Sucesso: {p} está online no seu GitHub.")
        else:
            # Se o erro for 'Repository not found', avisa que precisa criar no site
            if "not found" in res.stderr.lower():
                print(f"⚠️ Atenção: Crie o repositório '{p}' manualmente em github.com/new primeiro.")
            else:
                print(f"❌ Erro em {p}: {res.stderr.strip()}")
    else:
        print(f"ℹ️ Pasta não encontrada no Desktop: {p}")
