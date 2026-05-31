import { getAuthContext } from "@/services/auth-context";
import { JobService } from "@/services/jobs.service";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, DollarSign, Clock, CheckCircle2, FileText, User, MoreVertical, Check } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import { JobItemManager } from "@/components/jobs/job-item-manager";
import { prisma } from "@/lib/prisma";
import { approveJobBudgetAction } from "@/actions/jobs";
import { RoleDebug } from "@/components/debug/role-debug";
import { JobOverviewCards } from "@/components/jobs/job-overview-cards";

export default async function JobDetailsPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { tenantId, role } = await getAuthContext();
    const jobData = await JobService.with(tenantId).getById(params.id);
    const job = jobData as any; // Casting to any to avoid type errors until prisma generate is run

    if (!job) {
        notFound();
    }

    // Fetch potential producers and team members
    const users = await prisma.user.findMany({
        where: {
            tenantId,
            role: { in: ['OWNER', 'PRODUCER_GENERAL', 'PRODUCER_SUPPORT', 'FREELANCER_EXTERNAL', 'SUPERVISOR', 'DIRECTOR', 'FINANCE'] }
        },
        select: { id: true, name: true, email: true }
    });

    const isOwner = role === 'OWNER';
    const isSuperAdmin = role === 'SUPER_ADMIN';

    // Super Admin should have all permissions ("God Mode")
    const canApprove = isOwner || isSuperAdmin || ['DIRECTOR', 'SUPERVISOR'].includes(role as string);
    const canEdit = isOwner || isSuperAdmin || ['PRODUCER_GENERAL', 'SUPERVISOR', 'DIRECTOR', 'FINANCE'].includes(role as string);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <Link href="/jobs">
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 rounded-full">
                                <ArrowLeft className="h-4 w-4 text-slate-500" />
                            </Button>
                        </Link>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{job.title}</h1>
                            <Badge variant="outline" className={`
                                ${job.status === 'ACTIVE' || job.status === 'IN_PROGRESS' ? 'bg-green-50 text-green-700 border-green-200' :
                                    job.status === 'QUOTATION_APPROVED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                        job.status === 'QUOTATION_REQUESTED' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                            'bg-slate-50 text-slate-700 border-slate-200'}
                            `}>
                                {job.status === 'ACTIVE' ? 'Em Andamento' :
                                    job.status === 'QUOTATION_REQUESTED' ? 'Aprovação Pendente' :
                                        job.status === 'QUOTATION_APPROVED' ? 'Aprovado' :
                                            job.status}
                            </Badge>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 pl-11 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                            <User className="h-3 w-3" /> {job.client.name}
                        </span>
                        {job.deadline && (
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" /> Entrega: {format(job.deadline, 'dd/MM/yyyy')}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2 pl-11 md:pl-0">
                    {canApprove && (
                        <form action={async () => {
                            "use server";
                            await approveJobBudgetAction(job.id);
                        }}>
                            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white gap-2">
                                <CheckCircle2 className="h-4 w-4" /> Aprovar Orçamento
                            </Button>
                        </form>
                    )}
                    {canEdit && (
                        <Button variant="outline" className="h-9">Editar Job</Button>
                    )}
                </div>
            </div>

            {/* Top Section: Overview Cards */}
            <JobOverviewCards job={job} client={job.client} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Items & Description */}
                <div className="lg:col-span-3 space-y-6">

                    {/* Items Manager */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-semibold text-slate-800">Itens do Job (Escopo)</CardTitle>
                                <Badge variant="outline">Total Itens: {Number(job.items?.length || 0)}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <JobItemManager
                                jobId={job.id}
                                items={job.items || []}
                                canEdit={canEdit}
                                users={users}
                            />
                        </CardContent>
                    </Card>

                    {/* Description */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold text-slate-800">Briefing / Descrição</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                                {job.description || "Sem descrição disponível."}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <RoleDebug role={role} canEdit={canEdit} />
        </div>
    );
}
