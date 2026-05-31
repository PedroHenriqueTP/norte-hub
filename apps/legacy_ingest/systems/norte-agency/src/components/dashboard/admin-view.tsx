"use client";

import { JobCard } from "@/components/jobs/job-card";
import { DollarSign, Briefcase, FileText } from "lucide-react";

export function AdminView({ stats, jobs, userRole }: { stats: any, jobs: any[], userRole: string }) {
    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Agency Dashboard</h1>
                    <p className="text-muted-foreground">Overview of your agency's performance.</p>
                </div>
                <div className="flex gap-4">
                    {/* Action Buttons */}
                </div>
            </header>

            {/* Agency Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border shadow-sm dark:border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-violet-500/10 rounded-lg text-violet-400">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Active Jobs</h3>
                            <div className="text-2xl font-bold">{stats?.activeJobs || 0}</div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border shadow-sm dark:border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-500/10 rounded-lg text-orange-400">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Pending Invoices</h3>
                            <div className="text-2xl font-bold">{stats?.pendingInvoices || 0}</div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border shadow-sm dark:border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/10 rounded-lg text-green-400">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Revenue (Mo)</h3>
                            <div className="text-2xl font-bold">R$ {stats?.revenueThisMonth || 0}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Jobs Grid */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Active Projects</h2>
                {jobs && jobs.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {jobs.map((job) => (
                            <JobCard key={job.id} job={job} userRole={userRole} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">No active jobs found for this tenant.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
