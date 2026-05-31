
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        select: {
            email: true,
            role: true,
            name: true,
        },
    });

    console.log("Registered Users:");
    users.forEach((u) => {
        console.log(`- ${u.email} (${u.role}) - ${u.name}`);
    });

    const superAdmins = users.filter((u) => u.role === "SUPER_ADMIN");
    if (superAdmins.length > 0) {
        console.log("\n✅ Super Admin(s) found:");
        superAdmins.forEach((u) => console.log(`  - ${u.email}`));
    } else {
        console.log("\n❌ No SUPER_ADMIN found.");
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
