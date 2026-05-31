"use client";

import { JobCard } from "@/components/jobs/job-card";
import { CheckCircle, Clock } from "lucide-react";

export function MemberView({ jobs, userRole }: { jobs: any[], userRole: string }) {
    // Filter jobs assigned to member (simplified logic for now, showing all active jobs)
    const myJobs = jobs.filter(j => j.status === 'ACTIVE');

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Workspace</h1>
                    <p className="text-muted-foreground">Here are the projects you are working on.</p>
                </div>
            </header>

            {/* Personal Stats */}
            <div className="grid gap-4 md:grid-cols-2">
                <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border shadow-sm dark:border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">My Active Jobs</h3>
                            <div className="text-2xl font-bold">{myJobs.length}</div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border shadow-sm dark:border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/10 rounded-lg text-green-400">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Tasks Completed</h3>
                            <div className="text-2xl font-bold">12</div>
                            {/* Placeholder for now */}
                        </div>
                    </div>
                </div>
            </div>

            {/* My Jobs Grid */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Assigned Projects</h2>
                {myJobs && myJobs.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {myJobs.map((job) => (
                            <JobCard key={job.id} job={job} userRole={userRole} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">No active jobs assigned to you.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
