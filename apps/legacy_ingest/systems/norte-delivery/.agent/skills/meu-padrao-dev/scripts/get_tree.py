import os

def list_files(startpath):
    ignore_dirs = {'.git', 'node_modules', '.next', 'dist', 'coverage', '.agent'}
    print(f"Estrutura de pastas do projeto: {startpath}")
    for root, dirs, files in os.walk(startpath):
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        level = root.replace(startpath, '').count(os.sep)
        indent = ' ' * 4 * (level)
        print(f'{indent}{os.path.basename(root)}/')
        subindent = ' ' * 4 * (level + 1)
        for f in files:
            if f.endswith(('.ts', '.tsx', '.js', '.json', '.prisma', '.css', '.md')):
                print(f'{subindent}{f}')

if __name__ == "__main__":
    list_files('.')
