
with open('packages/database/prisma/schema.prisma', 'rb') as f:
    lines = f.readlines()
    for i, line in enumerate(lines[440:480]):
        print(f"{440+i}: {line}")
