import os

def generate_saas_context(project_name, path):
    context_file = os.path.join(path, "AI_CONTEXT_SNAPSHOT.md")
    print(f"🧠 Gerando cérebro contextual para {project_name}...")
    
    with open(context_file, "w", encoding="utf-8") as f:
        f.write(f"# Contexto Técnico: {project_name}\n\n")
        f.write("## 🛠 Stack Tecnológica\n- Framework: Next.js (App Router)\n- Linguagem: TypeScript\n- ORM: Prisma\n\n")
        
        # Captura o Schema do Prisma (O DNA do seu SaaS)
        prisma_path = os.path.join(path, "prisma", "schema.prisma")
        if os.path.exists(prisma_path):
            f.write("## 🧬 Database Schema (Prisma)\n
```prisma\n")
            with open(prisma_path, "r") as p: f.write(p.read())
            f.write("\n```\n\n")
            
        # Captura as pendências (Seu arquivo de tarefas)
        todo_path = os.path.join(path, "Oque-ta-faltando-nessa-porra.txt")
        if os.path.exists(todo_path):
            f.write("## 🚩 Pendências e Dívida Técnica\n")
            with open(todo_path, "r") as t: f.write(t.read())
            f.write("\n\n")

        f.write("## 📂 Estrutura de Pastas (Principais)\n```\n")
        # Lista pastas de lógica de negócio
        for folder in ['src/app', 'src/services', 'src/lib']:
            full_folder = os.path.join(path, folder)
            if os.path.exists(full_folder):
                f.write(f"\n{folder}:\n")
                f.write("\n".join(os.listdir(full_folder)[:10]))
        f.write("\n```")

# Executa para seus projetos principais
projects = {
    "AgencyOS": r"C:\Users\ACER\Desktop\app-promoin\agency-os",
    "CRMMed": r"C:\Users\ACER\Desktop\crm-med"
}

for name, path in projects.items():
    if os.path.exists(path):
        generate_saas_context(name, path)