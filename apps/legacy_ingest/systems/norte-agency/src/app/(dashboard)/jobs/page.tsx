import { getAuthContext } from "@/services/auth-context";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { JobTable } from "@/components/jobs/job-table";
import { JobFilters } from "@/components/jobs/job-filters";
import { ClientService } from "@/services/client.service";

export default async function JobsPage({
    searchParams,
}: any) {
    const { tenantId, role } = await getAuthContext();
    const resolvedSearchParams = await searchParams;

    // Fetch Clients for filter
    const clients = await ClientService.with(tenantId).getAll();

    // Build Where Clause
    const where: any = { tenantId };

    if (resolvedSearchParams.query) {
        where.OR = [
            { title: { contains: resolvedSearchParams.query, mode: 'insensitive' } },
            // { id: { contains: searchParams.query, mode: 'insensitive' } } // UUID search might fail if partial
        ];
    }

    if (resolvedSearchParams.clientId) {
        where.clientId = resolvedSearchParams.clientId;
    }

    if (resolvedSearchParams.status) {
        where.status = resolvedSearchParams.status;
    }

    const jobsData = await prisma.job.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
            client: { select: { name: true } },
            _count: { select: { transactions: true, documents: true } }
        }
    });

    const jobs = jobsData.map(job => ({
        ...job,
        budget: Number(job.budget)
    }));

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Jobs</h1>
                    <p className="text-slate-500">Gerencie todos os projetos em visualização de produção.</p>
                </div>
                <Link href="/jobs/new">
                    <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm">
                        <Plus className="mr-2 h-4 w-4" /> Novo Job
                    </Button>
                </Link>
            </div>

            <JobFilters clients={clients} />
            <JobTable jobs={jobs} currentUserRole={role} />
        </div>
    );
}
