import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCart, removeFromCart, checkout } from '../services/cart'
import toast from 'react-hot-toast'
import { Trash2, ShoppingBag } from 'lucide-react'

export default function Cart() {
  const [cart, setCart] = useState({ items: [], total: 0 })
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(true)
  const [checkingOut, setCheckingOut] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { fetchCart() }, [])

  const fetchCart = async () => {
    try {
      const { data } = await getCart()
      setCart(data)
    } catch {
      toast.error('Error al cargar el carrito')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId)
      toast.success('Producto eliminado')
      fetchCart()
    } catch {
      toast.error('Error al eliminar')
    }
  }

  const handleCheckout = async () => {
    if (!address.trim()) {
      toast.error('Ingresa una dirección de envío')
      return
    }
    setCheckingOut(true)
    try {
      await checkout({ shipping_address: address })
      toast.success('¡Pedido creado exitosamente!')
      navigate('/orders')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Error al procesar el pedido')
    } finally {
      setCheckingOut(false)
    }
  }

  if (loading) return <div className="text-center py-16 text-gray-400">Cargando...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mi carrito</h1>

      {cart.items.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-400 mb-4">Tu carrito está vacío</p>
          <Link to="/catalog" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Ver catálogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de items */}
          <div className="lg:col-span-2 space-y-3">
            {cart.items.map(item => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{item.product_name}</h3>
                  <p className="text-sm text-gray-400">
                    {item.quantity} × ${Number(item.unit_price).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-800">${Number(item.subtotal).toLocaleString()}</span>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 h-fit">
            <h2 className="font-bold text-gray-800 text-lg mb-4">Resumen</h2>
            <div className="flex justify-between text-gray-600 mb-2">
              <span>Subtotal</span>
              <span>${Number(cart.total).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-800 text-lg border-t pt-3 mb-4">
              <span>Total</span>
              <span>${Number(cart.total).toLocaleString()}</span>
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Dirección de envío</label>
              <textarea
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Calle, número, ciudad..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {checkingOut ? 'Procesando...' : 'Confirmar pedido'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}