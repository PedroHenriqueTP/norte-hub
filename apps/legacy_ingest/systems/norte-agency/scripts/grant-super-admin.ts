
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const targetEmail = process.argv[2] || "owner@demoagency.com";

async function main() {
    // Use findFirst because email might not be unique in Prisma types if scoped by tenant
    const user = await prisma.user.findFirst({
        where: { email: targetEmail },
    });

    if (!user) {
        console.error(`User ${targetEmail} not found!`);
        return;
    }

    // Use executeRawUnsafe to bypass client validation if client is outdated
    // Enums in Postgres are case-sensitive usually.
    const count = await prisma.$executeRawUnsafe(
        `UPDATE "User" SET "role" = 'SUPER_ADMIN' WHERE "email" = $1`,
        targetEmail
    );

    console.log(`✅ Updated ${count} user(s) to SUPER_ADMIN.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
