'use client'

import { useEffect, useState } from 'react'
import { Users, DollarSign, MessageSquare, TrendingUp } from 'lucide-react'
import type { Lead, Transaction, Message } from '@/types'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    totalIncome: 0,
    totalExpense: 0,
    totalMessages: 0,
  })
  const [recentLeads, setRecentLeads] = useState<Lead[]>([])
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [leadsRes, transactionsRes, messagesRes] = await Promise.all([
        fetch('/api/leads'),
        fetch('/api/transactions'),
        fetch('/api/messages'),
      ])

      const leadsData = await leadsRes.json()
      const transactionsData = await transactionsRes.json()
      const messagesData = await messagesRes.json()

      const leads = leadsData.leads || []
      const transactions = transactionsData.transactions || []
      const messages = messagesData.messages || []

      setStats({
        totalLeads: leads.length,
        newLeads: leads.filter((l: Lead) => l.status === 'new').length,
        totalIncome: transactionsData.summary?.totalIncome || 0,
        totalExpense: transactionsData.summary?.totalExpense || 0,
        totalMessages: messages.length,
      })

      setRecentLeads(leads.slice(0, 5))
      setRecentTransactions(transactions.slice(0, 5))
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  if (loading) {
    return <div className="text-center py-12">Carregando...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total de Leads</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalLeads}</p>
            </div>
            <Users className="text-primary-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Novos Leads</p>
              <p className="text-2xl font-bold text-primary-600 mt-1">{stats.newLeads}</p>
            </div>
            <TrendingUp className="text-green-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Receita Total</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {formatCurrency(stats.totalIncome)}
              </p>
            </div>
            <DollarSign className="text-green-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Mensagens</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalMessages}</p>
            </div>
            <MessageSquare className="text-blue-600" size={32} />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Leads Recentes</h2>
          </div>
          <div className="p-6">
            {recentLeads.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhum lead ainda</p>
            ) : (
              <div className="space-y-4">
                {recentLeads.map((lead) => (
                  <div key={lead._id} className="flex items-center justify-between pb-4 border-b last:border-0">
                    <div>
                      <p className="font-semibold text-gray-900">{lead.name}</p>
                      <p className="text-sm text-gray-600">{lead.email}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        lead.status === 'new'
                          ? 'bg-blue-100 text-blue-800'
                          : lead.status === 'contacted'
                          ? 'bg-yellow-100 text-yellow-800'
                          : lead.status === 'converted'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {lead.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Transações Recentes</h2>
          </div>
          <div className="p-6">
            {recentTransactions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhuma transação ainda</p>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction._id} className="flex items-center justify-between pb-4 border-b last:border-0">
                    <div>
                      <p className="font-semibold text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <span
                      className={`font-bold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

