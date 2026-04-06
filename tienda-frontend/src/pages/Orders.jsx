import { useState, useEffect } from 'react'
import { getOrders } from '../services/cart'
import toast from 'react-hot-toast'
import { Package } from 'lucide-react'

const statusColor = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  pagado: 'bg-blue-100 text-blue-700',
  enviado: 'bg-purple-100 text-purple-700',
  entregado: 'bg-green-100 text-green-700',
  cancelado: 'bg-red-100 text-red-700',
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrders()
      .then(r => setOrders(r.data))
      .catch(() => toast.error('Error al cargar pedidos'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center py-16 text-gray-400">Cargando...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mis pedidos</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-400">Aún no tienes pedidos</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">Pedido #{order.id}</h3>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor[order.status]}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-3">Envío a: {order.shipping_address}</p>
              <div className="space-y-1 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm text-gray-600">
                    <span>{item.quantity}× Producto #{item.product_id}</span>
                    <span>${Number(item.unit_price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-gray-800">
                <span>Total</span>
                <span>${Number(order.total).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}