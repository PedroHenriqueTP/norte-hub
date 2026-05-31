import sys
import re

def analyze_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        print(f"🔍 Auditando UX em: {filepath}\n")
        score = 100
        issues = []

        # Checagem de Feedback
        if 'toast' not in content and 'alert' in content:
            issues.append("⚠️  Uso de 'alert()' detectado. Substitua por Toasts modernos.")
            score -= 10
        
        if 'isLoading' not in content and 'isPending' not in content:
            issues.append("⚠️  Nenhum estado de 'Loading' encontrado. A UI trava durante requisições?")
            score -= 20

        # Checagem Visual
        if 'hover:' not in content:
            issues.append("🎨 Botões/Links parecem não ter estados de Hover.")
            score -= 10
        
        if 'motion.' not in content and 'AnimatePresence' not in content:
            issues.append("✨ Nenhuma animação (Framer Motion) detectada. A tela pode estar 'dura'.")
            score -= 15

        # Checagem de Responsividade
        if 'md:' not in content and 'lg:' not in content:
            issues.append("📱 Possível falta de responsividade (sem breakpoints md/lg).")
            score -= 20

        # Checagem de Acessibilidade
        if '<img' in content and 'alt=' not in content:
            issues.append("♿ Imagens sem tag 'alt'. Ruim para SEO e leitores de tela.")
            score -= 5

        # Relatório
        print(f"🏆 Nota de Polimento: {score}/100")
        if issues:
            print("\nMelhorias Sugeridas:")
            for issue in issues:
                print(f" - {issue}")
        else:
            print("✅ Nenhum problema óbvio detectado estaticamente.")

    except FileNotFoundError:
        print("Arquivo não encontrado.")
    except Exception as e:
        print(f"Erro ao analisar arquivo: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        analyze_file(sys.argv[1])
    else:
        print("Uso: python ux_audit.py <caminho_do_arquivo>")
