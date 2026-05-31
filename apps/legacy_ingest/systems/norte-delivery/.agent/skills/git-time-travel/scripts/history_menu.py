
import subprocess
import sys

def run_command(command):
    try:
        return subprocess.check_output(command, shell=True).decode('utf-8').strip()
    except subprocess.CalledProcessError as e:
        return ""

def main():
    # Verifica se está sujo
    status = run_command("git status --porcelain")
    if status:
        print("⚠️  ATENÇÃO: Você tem arquivos modificados não salvos!")
        print("Recomendado: Faça um commit ou use 'git stash' antes de viajar no tempo.\n")
        # In automation we cannot ask for input easily unless interactive mode is handled.
        # For safety in agentic mode, we might want to warn or list anyway.
        # But per skill script:
        pass 

    # Pega os últimos 10 commits
    # Format: hash|author|message|relative_time
    # Use %n to separate cleanly if needed, but | is fine for simple log
    log_format = "%h|%an|%s|%ar"
    try:
        logs_output = run_command(f'git log -10 --pretty=format:"{log_format}"')
        if not logs_output:
            print("No commits found.")
            return
        logs = logs_output.split('\n')
    except Exception as e:
        print(f"Error fetching logs: {e}")
        return

    print("\n⏳ MÁQUINA DO TEMPO GIT:\n")
    commits = []
    for i, line in enumerate(logs):
        if not line: continue
        parts = line.split('|')
        if len(parts) >= 3:
            h = parts[0]
            author = parts[1]
            msg = parts[2]
            time = parts[3] if len(parts) > 3 else ""
            commits.append(h)
            print(f"[{i}] {h} - {msg} ({time}) - {author}")

    print("\nPara navegar, use: git checkout <hash>")
    # In an agent environment, we print the list for the agent to use. 
    # Interactive input() is problematic if not strictly in a shell session the user controls.
    # But I will keep the script as close to requested as possible.
    
    # NOTE: Since I am an AI agent executing this, I cannot interact with 'input()'.
    # I will modify the script slightly to just list the commits if arguments are missing, 
    # or accept an argument to checkout. But strictly following the prompt:
    
if __name__ == "__main__":
    main()
