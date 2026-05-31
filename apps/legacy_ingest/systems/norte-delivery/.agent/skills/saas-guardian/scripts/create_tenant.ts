import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
    const args = process.argv.slice(2);
    const tenantName = args[0] || 'FastFeast HQ';
    const adminEmail = args[1] || 'admin@fastfeast.com';
    const rawPassword = 'changeme123';

    console.log(`ðŸ›¡ï¸  systems GUARDIAN: Configurando ambiente real para "${tenantName}"...`);

    try {
        // 1. Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: adminEmail }
        });

        if (existingUser) {
            console.log(`âš ï¸  UsuÃ¡rio ${adminEmail} jÃ¡ existe. Atualizando senha...`);
            const hashedPassword = await bcrypt.hash(rawPassword, 10);
            await prisma.user.update({
                where: { email: adminEmail },
                data: { password: hashedPassword }
            });
            console.log(`âœ… Senha resetada para: ${rawPassword}`);
            return;
        }

        // 2. Create Tenant
        const slug = tenantName.toLowerCase().replace(/\s+/g, '-') + '-' + randomUUID().substring(0, 4);
        const tenant = await prisma.tenant.create({
            data: {
                name: tenantName,
                slug: slug,
                plan: 'ENTERPRISE'
            }
        });

        console.log(`ðŸ¢ Tenant criado: ${tenant.name} (ID: ${tenant.id})`);

        // 3. Create Admin User
        const hashedPassword = await bcrypt.hash(rawPassword, 10);
        const user = await prisma.user.create({
            data: {
                name: 'Admin User',
                email: adminEmail,
                password: hashedPassword,
                role: 'OWNER',
                tenantId: tenant.id
            }
        });

        console.log(`
âœ… ACESSO LIBERADO!
-----------------------------------------
ðŸ¢ OrganizaÃ§Ã£o: ${tenant.name}
ðŸ‘¤ Admin User:  ${user.email}
ðŸ”‘ Senha Real:  ${rawPassword}
-----------------------------------------
Use essas credenciais para fazer login na aplicaÃ§Ã£o.
        `);

    } catch (error) {
        console.error('âŒ Erro crÃ­tico:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

