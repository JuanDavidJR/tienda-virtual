import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, getCategories } from '../services/products'
import { addToCart } from '../services/cart'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Search, Filter, ShoppingCart } from 'lucide-react'

export default function Catalog() {
  const { token } = useAuth()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    category_id: '',
    min_price: '',
    max_price: ''
  })

  useEffect(() => {
    getCategories().then(r => setCategories(r.data))
    fetchProducts()
  }, [])

  const fetchProducts = async (params = {}) => {
    setLoading(true)
    try {
      const { data } = await getProducts(params)
      setProducts(data)
    } catch {
      toast.error('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const params = {}
    if (filters.search) params.search = filters.search
    if (filters.category_id) params.category_id = filters.category_id
    if (filters.min_price) params.min_price = filters.min_price
    if (filters.max_price) params.max_price = filters.max_price
    fetchProducts(params)
  }

  const handleAddToCart = async (productId) => {
    if (!token) {
      toast.error('Debes iniciar sesión para agregar al carrito')
      return
    }
    try {
      await addToCart({ product_id: productId, quantity: 1 })
      toast.success('Agregado al carrito')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Error al agregar')
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Catálogo</h1>

      {/* Filtros */}
      <form onSubmit={handleSearch} className="bg-white rounded-xl border border-gray-200 p-4 mb-8 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-48">
          <label className="block text-sm text-gray-600 mb-1">Buscar</label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Nombre o descripción..."
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="min-w-40">
          <label className="block text-sm text-gray-600 mb-1">Categoría</label>
          <select
            value={filters.category_id}
            onChange={e => setFilters({ ...filters, category_id: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="min-w-32">
          <label className="block text-sm text-gray-600 mb-1">Precio mín.</label>
          <input
            type="number"
            placeholder="0"
            value={filters.min_price}
            onChange={e => setFilters({ ...filters, min_price: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="min-w-32">
          <label className="block text-sm text-gray-600 mb-1">Precio máx.</label>
          <input
            type="number"
            placeholder="999999"
            value={filters.max_price}
            onChange={e => setFilters({ ...filters, max_price: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Filter size={16} /> Filtrar
        </button>

        <button
          type="button"
          onClick={() => { setFilters({ search: '', category_id: '', min_price: '', max_price: '' }); fetchProducts() }}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Limpiar
        </button>
      </form>

      {/* Grid de productos */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Cargando productos...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No se encontraron productos</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Imagen */}
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-gray-300 text-sm">Sin imagen</span>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {product.category.name}
                </span>
                <h3 className="font-semibold text-gray-800 mt-2 mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-3">{product.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-800">
                    ${Number(product.price).toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-400">Stock: {product.stock}</span>
                </div>

                <div className="flex gap-2 mt-3">
                  <Link
                    to={`/product/${product.id}`}
                    className="flex-1 text-center border border-gray-300 text-gray-600 py-1.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                  >
                    Ver más
                  </Link>
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    disabled={product.stock === 0}
                    className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:opacity-40"
                  >
                    <ShoppingCart size={14} />
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}