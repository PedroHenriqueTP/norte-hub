import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const tenant = await prisma.tenant.upsert({
        where: { slug: 'default-restaurant' },
        update: {},
        create: {
            name: 'Restaurante Modelo',
            slug: 'default-restaurant',
            plan: 'ENTERPRISE'
        }
    });

    const email = 'admin@delivery.com';
    const passwordRaw = '123456';
    const passwordHash = await bcrypt.hash(passwordRaw, 10);

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        user = await prisma.user.create({
            data: {
                name: 'Admin User',
                email,
                password: passwordHash,
                tenants: {
                    create: {
                        tenantId: tenant.id,
                        role: 'OWNER'
                    }
                }
            }
        });
    } else {
        await prisma.user.update({
            where: { id: user.id },
            data: { password: passwordHash }
        });
        await prisma.userTenant.upsert({
            where: {
                userId_tenantId: {
                    userId: user.id,
                    tenantId: tenant.id
                }
            },
            update: { role: 'OWNER' },
            create: {
                userId: user.id,
                tenantId: tenant.id,
                role: 'OWNER'
            }
        });
    }

    const superEmail = 'super@delivery.com';
    let superUser = await prisma.user.findUnique({ where: { email: superEmail } });
    if (!superUser) {
        superUser = await prisma.user.create({
            data: {
                name: 'Super Admin',
                email: superEmail,
                password: passwordHash,
                tenants: {
                    create: {
                        tenantId: tenant.id,
                        role: 'OWNER'
                    }
                }
            }
        });
    } else {
        await prisma.user.update({
            where: { id: superUser.id },
            data: { password: passwordHash }
        });
        await prisma.userTenant.upsert({
            where: {
                userId_tenantId: {
                    userId: superUser.id,
                    tenantId: tenant.id
                }
            },
            update: { role: 'OWNER' },
            create: {
                userId: superUser.id,
                tenantId: tenant.id,
                role: 'OWNER'
            }
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
