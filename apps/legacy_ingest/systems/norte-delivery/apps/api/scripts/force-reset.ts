
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@delivery.com';
    const newPassword = '123456';

    console.log(`Resetting password for ${email}...`);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        console.error('User not found!');
        return;
    }

    const hash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { email },
        data: { password: hash }
    });

    console.log('✅ Password reset successfully to: 123456');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
