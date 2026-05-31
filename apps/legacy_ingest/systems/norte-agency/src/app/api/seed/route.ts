
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    try {
        await prisma.user.deleteMany();
        await prisma.tenant.deleteMany();
        await prisma.job.deleteMany();

        // 1. Create Default Tenant (Agency)
        const tenant = await prisma.tenant.create({
            data: {
                name: "AgencyOS Demo",
                slug: "demo-agency",
                document: "12345678900",
            },
        });

        // 2. Create Owners & Admins
        const passwordHash = await hash("123456", 10);

        await prisma.user.create({
            data: {
                email: "owner@demoagency.com",
                name: "Demo Owner",
                password: passwordHash,
                role: "OWNER",
                tenantId: tenant.id,
            }
        });

        // 3. Create Super Admin
        const systemsTenant = await prisma.tenant.create({
            data: {
                name: "AgencyOS Admin",
                slug: "systems-admin",
            },
        });

        await prisma.user.create({
            data: {
                email: "admin@agencyos.com",
                name: "systems Super Admin",
                password: passwordHash,
                role: "SUPER_ADMIN",
                tenantId: systemsTenant.id,
            }
        });

        return NextResponse.json({ success: true, message: "Database seeded successfully" });
    } catch (error) {
        console.error("Seeding failed:", error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}

