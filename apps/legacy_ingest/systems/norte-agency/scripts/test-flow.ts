
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function runTest() {
    console.log("🚀 Starting AgencyOS Test Flow...");

    try {
        // 1. Setup Mock Data
        const runId = Date.now().toString();
        const tenantId = `test-tenant-${runId}`;
        const ownerEmail = `test-owner-${runId}@agencyos.local`;
        console.log(`\n1. Using Tenant ID: ${tenantId}`);

        const tenant = await prisma.tenant.create({
            data: {
                id: tenantId,
                name: `Tenant ${runId}`,
                slug: `tenant-${runId}`,
            },
        });

        const owner = await prisma.user.create({
            data: {
                email: ownerEmail,
                name: "Test Owner",
                role: "OWNER",
                tenantId: tenant.id,
            },
        });

        const client = await prisma.client.create({
            data: {
                name: `Client ${runId}`,
                tenantId: tenant.id,
            },
        });

        // 2. Create a Job
        const job = await prisma.job.create({
            data: {
                title: "Test Job " + Date.now(),
                tenantId: tenant.id,
                status: "IN_PROGRESS",
                budget: 5000,
                clientId: client.id,
                createdById: owner.id,
            },
        });
        console.log(`✅ Created Job: ${job.title} (${job.id})`);

        // 3. Add Transaction (Income)
        const income = await prisma.transaction.create({
            data: {
                description: "Initial Deposit",
                amount: 2500,
                type: "INCOME",
                date: new Date(),
                tenantId: tenant.id,
                jobId: job.id,
                category: "OTHER",
                isVerified: true,
            },
        });
        console.log(`✅ Added Income: ${income.amount}`);

        // 4. Add Transaction (Expense)
        const expense = await prisma.transaction.create({
            data: {
                description: "Software License",
                amount: 150,
                type: "EXPENSE",
                date: new Date(),
                tenantId: tenant.id,
                jobId: job.id,
                category: "PRODUCTION",
            },
        });
        console.log(`✅ Added Expense: ${expense.amount}`);

        // 5. Verify Dashboard Stats Logic
        const revenue = await prisma.transaction.aggregate({
            where: { tenantId: tenant.id, type: "INCOME" },
            _sum: { amount: true },
        });

        console.log(`\n📊 Dashboard Verify:`);
        console.log(`   Total Revenue: ${revenue._sum.amount}`);

        if (Number(revenue._sum.amount) >= 2500) {
            console.log("   ✅ Revenue calculation correct");
        } else {
            console.error("   ❌ Revenue calculation Mismatch!");
        }

        // Cleanup
        console.log("\n🧹 Cleaning up test data...");
        await prisma.transaction.deleteMany({ where: { jobId: job.id } });
        await prisma.job.delete({ where: { id: job.id } });
        await prisma.client.delete({ where: { id: client.id } });
        await prisma.user.delete({ where: { id: owner.id } });
        await prisma.tenant.delete({ where: { id: tenant.id } });
        console.log("✅ Cleanup complete");

    } catch (e) {
        console.error("❌ Test Failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

runTest();
