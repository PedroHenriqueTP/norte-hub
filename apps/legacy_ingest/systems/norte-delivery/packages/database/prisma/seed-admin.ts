import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@delivery.com';
    const password = await bcrypt.hash('123456', 10);

    // Create Tenant First
    let tenant = await prisma.tenant.findFirst({ where: { slug: 'delivery-platform' } });
    if (!tenant) {
        tenant = await prisma.tenant.create({
            data: {
                name: 'Delivery Platform HQ',
                slug: 'delivery-platform',
                plan: 'ENTERPRISE'
            }
        });
        console.log('Created Tenant:', tenant.id);
    }

    // Upsert User
    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password,
            role: 'ADMIN',
            tenantId: tenant.id
        },
        create: {
            name: 'Admin User',
            email,
            password,
            role: 'ADMIN',
            tenantId: tenant.id,
            phone: '11999999999'
        }
    });

    console.log('Admin User Ready:', user.email);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
