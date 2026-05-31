import sys
import re

def analyze_log(log_text):
    patterns = {
        'EADDRINUSE': 'Porta presa. O servidor já está rodando em outro lugar.',
        'ECONNREFUSED': 'Conexão recusada. O banco de dados ou serviço externo está offline.',
        'P2002': 'Violação de constraint UNIQUE do Prisma (dado duplicado).',
        'P2025': 'Prisma não encontrou o registro solicitado.',
        'client version': 'Versão do Prisma Client incompatível. Rode "npx prisma generate".',
        'sh: 1:': 'Comando de script não encontrado (falta pacote no SO ou PATH errado).',
        'Exit code 137': 'Out of Memory (OOM). O processo consumiu toda a RAM e o Docker matou ele.'
    }

    print("🕵️‍♂️ SHERLOCK DO TERMINAL: Analisando padrões...")
    found = False
    
    for error_code, explanation in patterns.items():
        if error_code in log_text:
            print(f"\n🚩 DETECTADO: {error_code}")
            print(f"💡 Explicação: {explanation}")
            found = True
    
    if not found:
        print("\n🤷 Nenhum padrão conhecido detectado automaticamente.")
        print("Vou analisar o Stack Trace linha a linha manualmente...")

if __name__ == "__main__":
    # Pega o argumento ou lê do stdin
    if len(sys.argv) > 1:
        log_input = sys.argv[1]
    else:
        log_input = "Sem input"
    
    analyze_log(log_input)
