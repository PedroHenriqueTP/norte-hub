const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("ðŸŒ± Seeding database...");

    // 1. Create Default Tenant (Agency)
    const tenant = await prisma.tenant.upsert({
        where: { slug: "demo-agency" },
        update: {},
        create: {
            name: "AgencyOS Demo",
            slug: "demo-agency",
        },
    });

    console.log(`ðŸ¢ Tenant created: ${tenant.name} (${tenant.id})`);

    // 2. Create Clients
    let client = await prisma.client.findFirst({
        where: { name: "Global Tech Corp", tenantId: tenant.id }
    });

    if (!client) {
        client = await prisma.client.create({
            data: {
                name: "Global Tech Corp",
                tenantId: tenant.id,
                document: "12.345.678/0001-90",
            },
        });
    }

    console.log(`ðŸ¤ Client created: ${client.name}`);

    // 2.5 Create Agency Owner User
    const owner = await prisma.user.upsert({
        where: {
            email_tenantId: {
                email: "owner@demoagency.com",
                tenantId: tenant.id
            }
        },
        update: {},
        create: {
            email: "owner@demoagency.com",
            name: "Demo Owner",
            role: "OWNER",
            tenantId: tenant.id,
        }
    });

    // 3. Create a Job
    let job = await prisma.job.findFirst({
        where: { title: "Summer Campaign 2026", tenantId: tenant.id }
    });

    if (!job) {
        job = await prisma.job.create({
            data: {
                title: "Summer Campaign 2026",
                status: "ACTIVE",
                budget: 50000,
                clientId: client.id,
                tenantId: tenant.id,
                createdById: owner.id,
            },
        });
        console.log(`ðŸŽ¨ Job created: ${job.title}`);

        // 4. Create Transactions (Only if job was just created to avoid dupes for now)
        await prisma.transaction.createMany({
            data: [
                {
                    description: "Initial Deposit",
                    amount: 15000,
                    type: "INCOME",
                    category: "OTHER",
                    date: new Date(),
                    jobId: job.id,
                    tenantId: tenant.id,
                    isVerified: true,
                },
                {
                    description: "Freelancer Retainer",
                    amount: 2500,
                    type: "EXPENSE",
                    category: "TALENT",
                    date: new Date(),
                    jobId: job.id,
                    tenantId: tenant.id,
                    isVerified: true,
                },
            ],
        });
        console.log("ðŸ’° Transactions created");
    } else {
        console.log(`ðŸŽ¨ Job found: ${job.title} (Skipping transactions)`);
    }

    // 5. Create systems Super Admin Tenant & User
    const systemsTenant = await prisma.tenant.upsert({
        where: { slug: "systems-admin" },
        update: {},
        create: {
            name: "AgencyOS Admin",
            slug: "systems-admin",
            document: "00.000.000/0001-00",
        },
    });

    const existingAdmin = await prisma.user.findFirst({
        where: {
            email: "admin@agencyos.com",
            tenantId: systemsTenant.id
        }
    });

    let superAdmin;
    if (!existingAdmin) {
        superAdmin = await prisma.user.create({
            data: {
                email: "admin@agencyos.com",
                name: "systems Super Admin",
                role: "SUPER_ADMIN",
                tenantId: systemsTenant.id,
            }
        });
    } else {
        superAdmin = await prisma.user.update({
            where: { id: existingAdmin.id },
            data: { role: "SUPER_ADMIN" }
        });
    }

    console.log(`ðŸ‘‘ Super Admin created: ${superAdmin.email} (Tenant: ${systemsTenant.name})`);
    console.log("âœ… Seeding finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

