import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("ðŸŒ± Seeding database with Smart Protocol...");

    // --- 1. SUPER ADMIN (Dono do systems) ---
    // Contexto: Acesso total, dashboard de mÃ©tricas, gestÃ£o de tenants.
    // Email: admin@agencyos.local
    // Senha: Admin123!

    // Primeiro cria o Tenant do Admin (systems Provider)
    const adminTenant = await prisma.tenant.upsert({
        where: { slug: "agency-os-admin" },
        update: {},
        create: {
            name: "AgencyOS HQ",
            slug: "agency-os-admin",
            document: "00.000.000/0001-00",
        },
    });

    const superAdminPassword = await hash("Admin123!", 10);

    // Tenta encontrar ou criar o usuÃ¡rio Super Admin
    // Precisamos de uma lÃ³gica customizada porque o identificador Ãºnico pode variar
    const superAdmin = await prisma.user.upsert({
        where: {
            email_tenantId: {
                email: "admin@agencyos.local",
                tenantId: adminTenant.id
            }
        },
        update: {
            role: "SUPER_ADMIN", // Garante que Ã© admin mesmo se rodar seed de novo
            password: superAdminPassword // Reseta a senha para o padrÃ£o conhecido
        },
        create: {
            name: "Super Admin",
            email: "admin@agencyos.local",
            password: superAdminPassword,
            role: "SUPER_ADMIN",
            tenantId: adminTenant.id,
        }
    });

    console.log(`ðŸ‘‘ Super Admin ensured: ${superAdmin.email}`);

    // --- 2. TENANT PADRÃƒO (Dono de AgÃªncia) ---
    // Contexto: Uso do software, CRM, Projetos.
    // Email: contato@agencia-alpha.com
    // Senha: Tenant123!
    // AgÃªncia: AgÃªncia Alpha

    const demoTenant = await prisma.tenant.upsert({
        where: { slug: "agencia-alpha" },
        update: {},
        create: {
            name: "AgÃªncia Alpha",
            slug: "agencia-alpha",
            document: "12.345.678/0001-90",
        },
    });

    const tenantPassword = await hash("Tenant123!", 10);

    const demoUser = await prisma.user.upsert({
        where: {
            email_tenantId: {
                email: "contato@agencia-alpha.com",
                tenantId: demoTenant.id
            }
        },
        update: {
            role: "OWNER",
            password: tenantPassword
        },
        create: {
            name: "Dono da Alpha",
            email: "contato@agencia-alpha.com",
            password: tenantPassword,
            role: "OWNER",
            tenantId: demoTenant.id
        }
    });

    console.log(`ðŸ¢ Standard Tenant ensured: ${demoUser.email}`);

    // --- 3. DADOS DE EXEMPLO (SÃ³ cria se nÃ£o existirem para nÃ£o duplicar infinito) ---

    // Verifica se jÃ¡ tem clientes para este tenant
    const clientCount = await prisma.client.count({ where: { tenantId: demoTenant.id } });

    let client;
    if (clientCount === 0) {
        client = await prisma.client.create({
            data: {
                name: "Cliente Exemplo Ltda",
                tenantId: demoTenant.id,
                document: "98.765.432/0001-10",
            }
        });
        console.log(`ðŸ¤ Client created: ${client.name}`);
    } else {
        client = await prisma.client.findFirst({ where: { tenantId: demoTenant.id } });
    }

    if (client) {
        // Verifica se jÃ¡ tem jobs
        const jobCount = await prisma.job.count({ where: { tenantId: demoTenant.id } });

        let job;
        if (jobCount === 0) {
            job = await prisma.job.create({
                data: {
                    title: "Campanha VerÃ£o 2026",
                    status: "ACTIVE",
                    budget: 15000,
                    clientId: client.id,
                    tenantId: demoTenant.id,
                    createdById: demoUser.id,
                },
            });
            console.log(`ðŸŽ¨ Job created: ${job.title}`);
        } else {
            job = await prisma.job.findFirst({ where: { tenantId: demoTenant.id } });
        }

        if (job) {
            // Cria transaÃ§Ãµes apenas se nÃ£o existirem (simplificado)
            const txCount = await prisma.transaction.count({ where: { jobId: job.id } });
            if (txCount === 0) {
                await prisma.transaction.createMany({
                    data: [
                        {
                            description: "Entrada Inicial",
                            amount: 5000,
                            type: "INCOME",
                            category: "OTHER",
                            date: new Date(),
                            jobId: job.id,
                            tenantId: demoTenant.id,
                            isVerified: true,
                        },
                        {
                            description: "Pagamento Freelancer",
                            amount: 1200,
                            type: "EXPENSE",
                            category: "TALENT",
                            date: new Date(),
                            jobId: job.id,
                            tenantId: demoTenant.id,
                            isVerified: true,
                        },
                    ],
                });
                console.log("ðŸ’° Transactions created");
            }
        }
    }

    // --- 4. NORTE HUB: DADOS FICTÃCIOS (Seeding) ---
    const walletCount = await prisma.digitalWallet.count({ where: { tenantId: demoTenant.id } });
    if (walletCount === 0) {
        await prisma.digitalWallet.create({
            data: {
                tenantId: demoTenant.id,
                balance: 1540.50
            }
        });
        console.log(`ðŸ’³ Digital Wallet created for user: ${demoUser.email}`);
    }

    const socialEventsCount = await prisma.socialEvent.count({ where: { tenantId: demoTenant.id } });
    if (socialEventsCount === 0) {
        await prisma.socialEvent.createMany({
            data: [
                {
                    tenantId: demoTenant.id,
                    userId: demoUser.id,
                    type: "WORKOUT_COMPLETED",
                    content: "Bateu PR no Supino: 100kg",
                },
                {
                    tenantId: demoTenant.id,
                    userId: demoUser.id,
                    type: "SALE_MADE",
                    content: "Nova venda gerada via Afiliado (InfoHub)",
                },
                {
                    tenantId: demoTenant.id,
                    userId: superAdmin.id, // Mocked global news
                    type: "ORACLE_NEWS",
                    content: "Oportunidade B2B: 3 novas empresas na sua regiÃ£o precisam de GestÃ£o de TrÃ¡fego.",
                }
            ]
        });
        console.log(`ðŸŒ Social Events (Norte Stream) populated.`);
    }

    console.log("âœ… Smart Seeding finished successfully.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

