"use client";

import { motion } from "framer-motion";
import { Building2, Users, DollarSign, Activity } from "lucide-react";

export function SuperAdminView({ stats }: { stats: any }) {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">SaaS Command Center</h1>
                    <p className="text-muted-foreground">Monitor global performance across all tenants.</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition">
                        Manage Tenants
                    </button>
                </div>
            </div>

            {/* Global Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <div className="p-6 bg-zinc-900 rounded-xl border border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-violet-500/10 rounded-lg text-violet-400">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-400">Total Tenants</p>
                            <h3 className="text-2xl font-bold text-white">{stats?.totalTenants || 0}</h3>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-zinc-900 rounded-xl border border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/10 rounded-lg text-green-400">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-400">Global MRR</p>
                            <h3 className="text-2xl font-bold text-white">R$ {stats?.globalMRR || "0,00"}</h3>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-zinc-900 rounded-xl border border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-400">Total Users</p>
                            <h3 className="text-2xl font-bold text-white">{stats?.totalUsers || 0}</h3>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-zinc-900 rounded-xl border border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-500/10 rounded-lg text-orange-400">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-400">System Health</p>
                            <h3 className="text-2xl font-bold text-white">99.9%</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity / Tenants List placeholder */}
            <div className="bg-zinc-900 rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Tenants</h3>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-white">Agency Demo {i}</p>
                                    <p className="text-sm text-zinc-500">Created 2 days ago</p>
                                </div>
                            </div>
                            <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded border border-green-500/20">Active</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
