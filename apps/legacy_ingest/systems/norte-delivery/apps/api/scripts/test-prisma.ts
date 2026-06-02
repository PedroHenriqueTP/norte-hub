
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking Prisma Client Table Access...');

    try {
        if (prisma.table) {
            console.log('SUCCESS: prisma.table is defined.');
            const count = await prisma.table.count();
            console.log(`Table Count: ${count}`);
        } else {
            console.error('FAILURE: prisma.table is UNDEFINED. Check generated client.');
            // Check keys
            console.log('Available keys on prisma:', Object.keys(prisma));
        }

    } catch (e) {
        console.error('Execution Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
