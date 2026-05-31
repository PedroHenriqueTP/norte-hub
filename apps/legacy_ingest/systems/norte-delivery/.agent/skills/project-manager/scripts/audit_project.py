import os
import json

def read_file(path):
    try:
        with open(path, 'r') as f:
            return f.read()
    except:
        return None

def audit():
    print("🕵️♂️  INICIANDO AUDITORIA DO PROJETO...\n")
    
    # 1. Check Stack (Package.json)
    # Checking root, api, and web package.jsons
    pkgs_to_check = ['package.json', 'apps/api/package.json', 'apps/web/package.json']
    
    for pkg_path in pkgs_to_check:
        if os.path.exists(pkg_path):
            print(f"📦 Analisando {pkg_path}:")
            pkg_content = read_file(pkg_path)
            if pkg_content:
                data = json.loads(pkg_content)
                deps = data.get('dependencies', {}).keys()
                print(f"   -> Deps: {', '.join(list(deps)[:10])}...")
        else:
            print(f"❌ {pkg_path} não encontrado.")

    # 2. Check Database Models (Prisma)
    # Checking common locations for monorepo or standard
    schema_paths = ['prisma/schema.prisma', 'packages/database/prisma/schema.prisma']
    schema_found = False
    
    for schema_path in schema_paths:
        if os.path.exists(schema_path):
            schema = read_file(schema_path)
            if schema:
                models = [line.split()[1] for line in schema.splitlines() if line.startswith('model ')]
                print(f"\n🗄️  Tabelas no Banco ({schema_path}):\n   -> {', '.join(models)}")
                schema_found = True
                break
    
    if not schema_found:
        print("\n⚠️  Prisma Schema não encontrado (sem banco definido?).")

    # 3. Check Structure highlights
    print("\n📂 Estrutura Relevante:")
    interesting_paths = ['apps', 'packages', 'src', 'pages', 'components', 'docker-compose.yml', '.env', 'ROADMAP.md', 'task.md', 'TECH_STACK.md']
    for p in interesting_paths:
        if os.path.exists(p):
            print(f"   ✅ {p} encontrado")
        else:
            print(f"   ❌ {p} ausente")
            
    # 4. Check Agent Artifacts
    print("\n🤖 Memória do Agente:")
    if os.path.exists('.agent/artifacts'):
        artifacts = os.listdir('.agent/artifacts')
        print(f"   -> {len(artifacts)} artefatos encontrados.")
    else:
        print("   -> Diretório de artefatos vazio ou inexistente.")

if __name__ == "__main__":
    audit()
