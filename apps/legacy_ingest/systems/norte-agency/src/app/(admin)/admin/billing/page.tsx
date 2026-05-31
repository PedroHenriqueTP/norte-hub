import React from 'react';
import { getConsolidatedBilling } from '@/actions/billing';
import { CreditCard, Users, Briefcase, Activity, ExternalLink } from 'lucide-react';

export default async function BillingPage() {
  const { tenants, globalMetrics } = await getConsolidatedBilling();

  return (
    <div className="p-6 space-y-8 text-slate-900 w-full">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Billing Consolidado</h1>
          <p className="text-slate-500">Acompanhamento financeiro global (Super Admin)</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium">Receita Estimada (MRR)</p>
              <h3 className="text-3xl font-bold mt-2 text-purple-700">
                R$ {globalMetrics.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <CreditCard size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium">Jobs Gerenciados</p>
              <h3 className="text-3xl font-bold mt-2">{globalMetrics.totalJobs}</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Briefcase size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium">Leads Processados</p>
              <h3 className="text-3xl font-bold mt-2">{globalMetrics.totalLeads}</h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <Activity size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Consumo por Tenant */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Consumo por Agência / Tenant</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-5 py-3">Tenant / Domínio</th>
                <th className="px-5 py-3 text-center">Usuários</th>
                <th className="px-5 py-3 text-center">Jobs (Projetos)</th>
                <th className="px-5 py-3 text-center">Leads (CRM)</th>
                <th className="px-5 py-3 text-right">Fatura Atual</th>
                <th className="px-5 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-900">{tenant.name}</p>
                    <p className="text-xs text-slate-500">{tenant.domain}</p>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="flex items-center justify-center gap-1"><Users size={14} className="text-slate-400"/> {tenant.activeUsers}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="flex items-center justify-center gap-1"><Briefcase size={14} className="text-slate-400"/> {tenant.totalJobs}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="flex items-center justify-center gap-1"><Activity size={14} className="text-slate-400"/> {tenant.totalLeads}</span>
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-slate-800">
                    R$ {tenant.estimatedInvoice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-semibold">
                      PENDENTE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
