import os
import datetime
import time
import google.generativeai as genai
from google.api_core import exceptions

# --- Configurações ---
# Tenta pegar a chave do ambiente ou defina manualmente aqui se preferir
API_KEY = os.environ.get("AIzaSyC7LDzpUAcB9CdQSidTI4x036eMjNfV7MI")

IGNORE_DIRS = {
    'node_modules', '.git', '.next', 'dist', 'build', 
    '__pycache__', 'venv', 'env', '.idea', '.vscode', 'migrations'
}

# Foca apenas em arquivos de código fonte essenciais
TARGET_EXTS = {'.py', '.ts', '.tsx', '.js', '.jsx'}

class AntigravityAuditor:
    def __init__(self, root_path):
        self.root_path = root_path
        self.report = []
        self.stats = {'files': 0, 'lines': 0, 'ai_success': 0, 'ai_fail': 0}
        self.model = None
        self.setup_ai()

    def setup_ai(self):
        if not API_KEY:
            print("⚠️ AVISO: GEMINI_API_KEY não encontrada. Rodando em modo ESTÁTICO (sem IA).")
            return

        try:
            genai.configure(api_key=API_KEY)
            # Tenta listar modelos para achar um compatível
            try:
                available_models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
            except:
                available_models = []
            
            # Ordem de preferência
            preferences = ['models/gemini-1.5-flash', 'models/gemini-1.5-pro', 'models/gemini-pro']
            
            chosen_model = None
            for pref in preferences:
                if pref in available_models:
                    chosen_model = pref
                    break
            
            # Se não achou na lista (as vezes a lista não retorna tudo), tenta o pro padrão
            if not chosen_model:
                chosen_model = 'gemini-pro'

            print(f"✨ AI Mode Ativado usando o modelo: {chosen_model}")
            self.model = genai.GenerativeModel(chosen_model)
            
        except Exception as e:
            print(f"❌ Erro ao configurar IA: {e}")
            self.model = None

    def inspect_directory(self):
        print(f"🚀 Iniciando inspeção antigravitacional em: {self.root_path}...\n")
        
        self.report.append(f"# 🕵️ Relatório de Auditoria Antigravity")
        self.report.append(f"**Data:** {datetime.datetime.now().strftime('%d/%m/%Y %H:%M')}")
        self.report.append(f"**Modo:** {'IA Ativa 🤖' if self.model else 'Análise Estática 📝'}\n")
        self.report.append("---")

        for root, dirs, files in os.walk(self.root_path):
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

            for file in files:
                ext = os.path.splitext(file)[1]
                if ext in TARGET_EXTS:
                    file_path = os.path.join(root, file)
                    self.analyze_file(file_path, file)

        self.save_report()

    def analyze_file(self, full_path, filename):
        rel_path = os.path.relpath(full_path, self.root_path)
        print(f"Analisando: {rel_path}...", end="\r") # Mostra progresso na mesma linha
        
        try:
            with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                lines = content.splitlines()
        except:
            return

        self.stats['files'] += 1
        self.stats['lines'] += len(lines)

        ai_analysis = None
        if self.model and len(lines) < 600: # Limite de tamanho para não gastar tokens demais
            ai_analysis = self.ask_gemini(filename, content)
            if ai_analysis:
                self.stats['ai_success'] += 1
            else:
                self.stats['ai_fail'] += 1
        
        # Adiciona ao relatório
        self.report.append(f"\n### 📄 `{rel_path}`")
        
        if ai_analysis:
            self.report.append(ai_analysis)
        else:
            # Fallback para análise manual simples se a IA falhar ou arquivo for muito grande
            self.report.append(f"- **Linhas:** {len(lines)}")
            self.report.append(f"- *Análise IA não disponível (erro ou arquivo muito grande).*")

    def ask_gemini(self, filename, content):
        """Envia o código para o Gemini analisar."""
        prompt = (
            f"Você é um Tech Lead Senior especialista em Python e TypeScript."
            f"Analise o arquivo '{filename}' abaixo."
            f"Seja extremamente conciso (max 3 bullet points)."
            f"1. O que esse código faz (resumo funcional)."
            f"2. Uma sugestão crítica para melhorar a performance, segurança ou legibilidade (Clean Code)."
            f"\n\nCódigo:\n{content}"
        )
        
        try:
            # IMPORTANTE: Pausa para respeitar o Rate Limit do plano Free (aprox 15 RPM)
            time.sleep(4.5) 
            
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except exceptions.ResourceExhausted:
            print(f"\n⚠️ Cota de API excedida em {filename}. Continuando sem IA...")
            return None
        except Exception as e:
            # Erros silenciosos para não parar o script
            return None

    def save_report(self):
        self.report.append("\n---")
        self.report.append("## 📊 Estatísticas Gerais")
        self.report.append(f"- **Arquivos:** {self.stats['files']}")
        self.report.append(f"- **Sucesso IA:** {self.stats['ai_success']} arquivos analisados")
        self.report.append(f"- **Falha/Pulo IA:** {self.stats['ai_fail']}")
        
        output_file = "AUDITORIA_ANTIGRAVITY.md"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(self.report))
        
        print(f"\n\n✅ Inspeção concluída! Relatório salvo em: {output_file}")

if __name__ == "__main__":
    current_dir = os.getcwd()
    auditor = AntigravityAuditor(current_dir)
    auditor.inspect_directory()
