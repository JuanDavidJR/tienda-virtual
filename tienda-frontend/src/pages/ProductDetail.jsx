import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProduct } from '../services/products'
import { addToCart } from '../services/cart'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { ShoppingCart, ArrowLeft, Package } from 'lucide-react'

export default function ProductDetail() {
  const { id } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    getProduct(id)
      .then(r => setProduct(r.data))
      .catch(() => toast.error('Producto no encontrado'))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = async () => {
    if (!token) {
      toast.error('Debes iniciar sesión')
      navigate('/login')
      return
    }
    setAdding(true)
    try {
      await addToCart({ product_id: product.id, quantity })
      toast.success('Agregado al carrito')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Error al agregar')
    } finally {
      setAdding(false)
    }
  }

  if (loading) return <div className="text-center py-16 text-gray-400">Cargando...</div>
  if (!product) return <div className="text-center py-16 text-gray-400">Producto no encontrado</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-6"
      >
        <ArrowLeft size={18} /> Volver
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

          {/* Imagen */}
          <div className="h-72 md:h-full bg-gray-100 flex items-center justify-center">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-300">
                <Package size={48} />
                <span className="text-sm">Sin imagen</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-8 flex flex-col justify-between">
            <div>
              <span className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {product.category.name}
              </span>
              <h1 className="text-2xl font-bold text-gray-800 mt-3 mb-2">{product.name}</h1>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">{product.description}</p>

              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-bold text-gray-800">
                  ${Number(product.price).toLocaleString()}
                </span>
                <span className={`text-sm px-3 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
                </span>
              </div>
            </div>

            {/* Cantidad y botón */}
            {product.stock > 0 && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Cantidad</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors font-bold"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                      className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                >
                  <ShoppingCart size={18} />
                  {adding ? 'Agregando...' : 'Agregar al carrito'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
