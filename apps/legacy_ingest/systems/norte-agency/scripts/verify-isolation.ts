
import { PrismaClient } from "@prisma/client";
import { JobService } from "../src/services/jobs.service";

const prisma = new PrismaClient();

async function main() {
    console.log("🔒 Verifying Tenant Isolation...");

    // 1. Setup: Create 2 Tenants
    const tenantA = await prisma.tenant.upsert({
        where: { slug: "isolation-test-a" },
        update: {},
        create: { name: "Tenant A", slug: "isolation-test-a" },
    });

    const tenantB = await prisma.tenant.upsert({
        where: { slug: "isolation-test-b" },
        update: {},
        create: { name: "Tenant B", slug: "isolation-test-b" },
    });

    // 2. Setup: Create Jobs for each
    await prisma.job.deleteMany({ where: { title: { startsWith: "Isolation Test" } } });

    const clientA = await prisma.client.create({
        data: { name: "Client A", tenantId: tenantA.id }
    });
    const clientB = await prisma.client.create({
        data: { name: "Client B", tenantId: tenantB.id }
    });

    // User for creator relation
    const userA = await prisma.user.create({
        data: { email: `test-a-${Date.now()}@test.com`, tenantId: tenantA.id }
    });


    await prisma.job.create({
        data: {
            title: "Isolation Test Job A",
            tenantId: tenantA.id,
            clientId: clientA.id,
            createdById: userA.id
        },
    });

    await prisma.job.create({
        data: {
            title: "Isolation Test Job B",
            tenantId: tenantB.id,
            clientId: clientB.id,
            createdById: userA.id // In this test we just need a valid ID, cross-tenant FK is possible in DB but Service prevents access
        },
    });

    // 3. Attack: Try to read ALL jobs using Tenant A's service
    console.log(`🕵️  Attempting to access data using Tenant A's context (${tenantA.id})...`);
    const serviceA = JobService.with(tenantA.id);
    const jobsA = await serviceA.getAll();

    console.log(`📊 Found ${jobsA.length} jobs for Tenant A.`);

    // 4. Trace Analysis
    const leakedJobs = jobsA.filter((j) => j.tenantId !== tenantA.id);

    if (leakedJobs.length > 0) {
        console.error("❌ CRITICAL FAIL: Data Leak Detected!");
        console.error(leakedJobs);
        process.exit(1);
    }

    // 5. Verify ID B is NOT present
    const jobB = jobsA.find((j) => j.title === "Isolation Test Job B");
    if (jobB) {
        console.error("❌ CRITICAL FAIL: Tenant A can see Tenant B's job!");
        process.exit(1);
    }

    console.log("✅ SUCCESS: Tenant A only sees Tenant A's data.");
    console.log("🛡️  Tenant Guard is Active.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
