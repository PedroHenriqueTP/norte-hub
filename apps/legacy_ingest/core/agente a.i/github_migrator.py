import os
import subprocess
import sys

def run_command(command, check=True):
    """Executa um comando no shell e retorna o output."""
    try:
        result = subprocess.run(command, shell=True, check=check, text=True, capture_output=True)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Erro ao executar '{command}':\n{e.stderr}")
        if check:
            sys.exit(1)
        return None

def main():
    current_dir = os.getcwd()
    print(f"\n=======================================================")
    print(f" Iniciando migração para: {current_dir}")
    print(f"=======================================================\n")

    # 1. Análise de Lixo e .gitignore
    print("[1/5] Verificando arquivos inúteis e .gitignore...")
    gitignore_path = os.path.join(current_dir, ".gitignore")
    lixo_comum = [
        "node_modules/", "dist/", "build/", ".next/", "out/",
        "venv/", ".venv/", "env/", "__pycache__/", "*.pyc",
        ".cache/", ".DS_Store", "coverage/"
    ]
    
    if not os.path.exists(gitignore_path):
        print("      Criando .gitignore robusto...")
        with open(gitignore_path, "w", encoding='utf-8') as f:
            f.write("# Pastas pesadas ignoradas pelo automatizador\n")
            for item in lixo_comum:
                f.write(f"{item}\n")
    else:
        print("      .gitignore encontrado. Garantindo regras padrão...")
        with open(gitignore_path, "r", encoding='utf-8') as f:
            content = f.read()
        
        missing = [item for item in lixo_comum if item.strip('/') not in content and item not in content]
        if missing:
            with open(gitignore_path, "a", encoding='utf-8') as f:
                f.write("\n\n# Adicionadas pelo automatizador\n")
                for item in missing:
                    f.write(f"{item}\n")

    # 2. Verificação de Repositório Git
    print("\n[2/5] Configurando Repositório Git...")
    if not os.path.exists(os.path.join(current_dir, ".git")):
        print("      Inicializando repositório Git local...")
        run_command("git init")
    else:
        print("      Repositório Git já existente.")

    # 3. Conexão Remota
    print("\n[3/5] Verificando conexão Remota (GitHub)...")
    remote_url = run_command("git remote get-url origin", check=False)
    if not remote_url:
        print("      Nenhum repositório remoto encontrado.")
        target_url = input("      >> Digite a URL do repositório remoto (ex: https://github.com/user/repo.git) ou enter para pular: ").strip()
        if target_url:
            run_command(f"git remote add origin {target_url}")
            print(f"      Remote 'origin' configurado para: {target_url}")
        else:
            print("      URL não fornecida. Abortando as próximas etapas na nuvem.")
            return
    else:
        print(f"      Remote detectado: {remote_url}")

    # 4. Upload Estruturado (add, commit, push na develop)
    print("\n[4/5] Realizando commit e push estruturado...")
    # Tenta usar a branch develop. Se já existir, muda pra ela; se não, cria.
    run_command("git checkout -b develop", check=False)
    run_command("git checkout develop", check=False)

    print("      Adicionando arquivos na stage...")
    run_command("git add .")
    
    status = run_command("git status --porcelain")
    if status:
        print("      Realizando commit...")
        run_command('git commit -m "chore: initial migration to GitHub"')
    else:
        print("      Sem mudanças para commitar.")

    print("      Fazendo push da branch 'develop' para origim...")
    push_result = run_command("git push -u origin develop", check=False)
    if push_result is None:
        print("      Falha ao fazer o push (Pode ser erro de credencial ou repo não existe no github).")
        return

    # 5. Simulação de Pull Request
    print("\n[5/5] Lidando com Pull Request via GitHub CLI (gh)...")
    print("      Tentando criar PR de 'develop' para 'main'...")
    # Tenta criar a branch main local/remoto e dar push, apenas para o PR não falhar caso main não exista no github
    run_command("git checkout -b main", check=False)
    run_command("git push -u origin main", check=False)
    run_command("git checkout develop", check=False)

    pr_result = run_command('gh pr create --base main --head develop --title "Initial Migration" --body "Migration to structure branch pattern"', check=False)
    
    if pr_result:
        print(f"      ✅ PR criado com sucesso! URL: {pr_result}")
    else:
        print("      ⚠️ Não foi possível criar o PR pela CLI (gh pode não estar instalado ou não logado).")
        print("         Comando manual manual sugerido: abra o GitHub na web e clique em 'Compare & pull request'.")

    # Limpeza Local Post-Migration
    print("\n=======================================================")
    print(" MIGRAÇÃO CONCLUÍDA COM SUCESSO!")
    print("=======================================================\n")
    print("O código (sem lixo) está seguro no GitHub na branch 'develop'.\n")
    print("💡 COMANDOS SUGERIDOS PARA LIMPEZA LOCAL (Escolha uma opção):")
    
    folder_name = os.path.basename(current_dir)
    print("\nOpção A: Apagar apenas pastas pesadas localmente e manter o código:")
    print("  (PowerShell) Remove-Item -Recurse -Force node_modules, dist, .next, venv -ErrorAction SilentlyContinue")
    print("  (Bash)       rm -rf node_modules dist build .next venv")
    
    print(f"\nOpção B: Apagar e deletar o projeto INTREIRO da sua máquina (já que está no github):")
    print(f"  (PowerShell) cd .. ; Remove-Item -Recurse -Force \"{folder_name}\"")
    print(f"  (Bash)       cd .. && rm -rf \"{folder_name}\"\n")

if __name__ == "__main__":
    main()
