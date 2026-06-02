
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@delivery.com';
    const password = '123456';

    console.log(`Testing login for: ${email} / ${password}`);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        console.error('User NOT FOUND in DB.');
        return;
    }

    console.log('User found:', user.id, user.name);
    console.log('Stored Hash:', user.password);

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
        console.log('SUCCESS: Password matches hash.');
    } else {
        console.error('FAILURE: Password DOES NOT match hash.');

        // Debug: Compare with a fresh hash
        const testHash = await bcrypt.hash(password, 10);
        console.log('Fresh Hash of "123456":', testHash);
    }
}

main()
    .finally(async () => await prisma.$disconnect());
