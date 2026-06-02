
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- DIAGNOSTIC START ---');

    try {
        const tenants = await prisma.tenant.findMany();
        console.log(`Tenants Found: ${tenants.length}`);
        tenants.forEach(t => console.log(` - [${t.id}] ${t.name} (${t.slug})`));

        const users = await prisma.user.findMany();
        console.log(`\nUsers Found: ${users.length}`);
        users.forEach(u => console.log(` - [${u.id}] ${u.name} (${u.email}) -> Tenant: ${u.tenantId}`));

        if (tenants.length === 0 || users.length === 0) {
            console.error('\nCRITICAL: Database is missing data. Seed required.');
        } else {
            console.log('\nDatabase seems populated.');
        }

    } catch (e) {
        console.error('Connection Error:', e);
    } finally {
        await prisma.$disconnect();
        console.log('--- DIAGNOSTIC END ---');
    }
}

main();
