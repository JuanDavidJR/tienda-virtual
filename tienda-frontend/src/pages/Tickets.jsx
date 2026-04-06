import { useState, useEffect } from 'react'
import { createTicket, getMyTickets, replyTicket } from '../services/tickets'
import toast from 'react-hot-toast'
import { MessageCircle, Plus, Send } from 'lucide-react'

const statusColor = {
  abierto: 'bg-green-100 text-green-700',
  en_proceso: 'bg-yellow-100 text-yellow-700',
  resuelto: 'bg-blue-100 text-blue-700',
  cerrado: 'bg-gray-100 text-gray-600',
}

export default function Tickets() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [reply, setReply] = useState('')
  const [form, setForm] = useState({ subject: '', description: '', category: 'consulta' })

  useEffect(() => { fetchTickets() }, [])

  const fetchTickets = async () => {
    try {
      const { data } = await getMyTickets()
      setTickets(data)
    } catch {
      toast.error('Error al cargar tickets')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await createTicket(form)
      toast.success('Ticket creado')
      setShowForm(false)
      setForm({ subject: '', description: '', category: 'consulta' })
      fetchTickets()
    } catch {
      toast.error('Error al crear ticket')
    }
  }

  const handleReply = async (ticketId) => {
    if (!reply.trim()) return
    try {
      await replyTicket(ticketId, { message: reply })
      toast.success('Respuesta enviada')
      setReply('')
      fetchTickets()
      // Actualiza el ticket seleccionado
      const { data } = await getMyTickets()
      setTickets(data)
      setSelectedTicket(data.find(t => t.id === ticketId))
    } catch {
      toast.error('Error al responder')
    }
  }

  if (loading) return <div className="text-center py-16 text-gray-400">Cargando...</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Soporte</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} /> Nuevo ticket
        </button>
      </div>

      {/* Formulario nuevo ticket */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Crear nuevo ticket</h2>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Asunto</label>
            <input
              type="text"
              value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Categoría</label>
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="consulta">Consulta</option>
              <option value="queja">Queja</option>
              <option value="devolucion">Devolución</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Descripción</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
              Enviar
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de tickets */}
        <div className="space-y-3">
          {tickets.length === 0 ? (
            <div className="text-center py-16">
              <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-400">No tienes tickets aún</p>
            </div>
          ) : (
            tickets.map(ticket => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`bg-white rounded-xl border p-4 cursor-pointer hover:shadow-sm transition-shadow ${selectedTicket?.id === ticket.id ? 'border-blue-400' : 'border-gray-200'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800 text-sm">{ticket.subject}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[ticket.status]}`}>
                    {ticket.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 capitalize">{ticket.category} · {ticket.responses.length} respuesta(s)</p>
              </div>
            ))
          )}
        </div>

        {/* Detalle del ticket */}
        {selectedTicket && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col">
            <h2 className="font-bold text-gray-800 mb-1">{selectedTicket.subject}</h2>
            <p className="text-sm text-gray-400 mb-4 capitalize">{selectedTicket.category}</p>
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 mb-4">
              {selectedTicket.description}
            </div>

            {/* Respuestas */}
            <div className="space-y-3 flex-1 mb-4">
              {selectedTicket.responses.map(r => (
                <div key={r.id} className="bg-blue-50 rounded-lg p-3 text-sm text-gray-700">
                  <p className="font-medium text-blue-600 text-xs mb-1">Usuario #{r.user_id}</p>
                  {r.message}
                </div>
              ))}
            </div>

            {/* Responder */}
            {selectedTicket.status !== 'cerrado' && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  placeholder="Escribe tu respuesta..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={e => e.key === 'Enter' && handleReply(selectedTicket.id)}
                />
                <button
                  onClick={() => handleReply(selectedTicket.id)}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}