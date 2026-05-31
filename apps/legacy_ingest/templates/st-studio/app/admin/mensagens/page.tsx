'use client'

import { useEffect, useState } from 'react'
import { Send, MessageSquare, Phone, Mail } from 'lucide-react'
import type { Message, Lead } from '@/types'

export default function MensagensPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
    fetchLeads()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages')
      const data = await response.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads')
      const data = await response.json()
      setLeads(data.leads || [])
    } catch (error) {
      console.error('Erro ao buscar leads:', error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLead || !newMessage.trim()) return

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'admin@studio.com',
          to: selectedLead.phone,
          content: newMessage,
          type: 'whatsapp',
          direction: 'outgoing',
          leadId: selectedLead._id,
        }),
      })

      setNewMessage('')
      fetchMessages()
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
    }
  }

  const getMessagesForLead = (leadId: string) => {
    return messages.filter((m) => m.leadId === leadId)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'whatsapp':
        return <Phone size={16} />
      case 'email':
        return <Mail size={16} />
      default:
        return <MessageSquare size={16} />
    }
  }

  if (loading) {
    return <div className="text-center py-12">Carregando...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mensagens</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Lista de Leads */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Clientes</h2>
          </div>
          <div className="divide-y">
            {leads.map((lead) => {
              const leadMessages = getMessagesForLead(lead._id)
              return (
                <button
                  key={lead._id}
                  onClick={() => setSelectedLead(lead)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition ${
                    selectedLead?._id === lead._id ? 'bg-primary-50' : ''
                  }`}
                >
                  <p className="font-semibold text-gray-900">{lead.name}</p>
                  <p className="text-sm text-gray-600">{lead.phone}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {leadMessages.length} mensagem{leadMessages.length !== 1 ? 's' : ''}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Conversa */}
        <div className="md:col-span-2 bg-white rounded-lg shadow flex flex-col">
          {selectedLead ? (
            <>
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">{selectedLead.name}</h2>
                <p className="text-sm text-gray-600">{selectedLead.email}</p>
              </div>

              <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-96">
                {getMessagesForLead(selectedLead._id).map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${
                      message.direction === 'outgoing' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.direction === 'outgoing'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        {getIcon(message.type)}
                        <span className="ml-2 text-xs opacity-75">
                          {new Date(message.createdAt).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <p>{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={sendMessage} className="p-6 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="submit"
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 flex items-center"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p>Selecione um cliente para ver as mensagens</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

