
import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@delivery.com';
    const password = 'password123';

    console.log(`Checking for existing user: ${email}...`);

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        console.log('User already exists.');
        return;
    }

    console.log('Creating new Tenant and Admin User...');

    const hashedPassword = await bcrypt.hash(password, 10);

    // Use transaction to ensure data integrity
    await prisma.$transaction(async (tx) => {
        // 1. Create Tenant
        const tenant = await tx.tenant.create({
            data: {
                name: 'Delivery Corp HQ',
                slug: 'delivery-hq',
                plan: 'ENTERPRISE',
            },
        });

        console.log(`Tenant created: ${tenant.name} (${tenant.id})`);

        // 2. Create User
        const user = await tx.user.create({
            data: {
                name: 'Admin User',
                email,
                password: hashedPassword,
                role: Role.OWNER,
                tenantId: tenant.id,
            },
        });

        console.log(`User created: ${user.name} (${user.id})`);
    });

    console.log('Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
