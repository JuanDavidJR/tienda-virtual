import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getCategories } from '../services/products'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Plus, Package, Tag } from 'lucide-react'

export default function Admin() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [tab, setTab] = useState('producto')

  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', stock: '', image_url: '', category_id: ''
  })
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getCategories().then(r => setCategories(r.data))
  }, [])

  const handleCreateProduct = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/products/', {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        category_id: parseInt(productForm.category_id),
        image_url: productForm.image_url || null
      })
      toast.success('Producto creado')
      setProductForm({ name: '', description: '', price: '', stock: '', image_url: '', category_id: '' })
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Error al crear producto')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCategory = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/products/categories', categoryForm)
      toast.success('Categoría creada')
      setCategoryForm({ name: '', description: '' })
      const { data } = await getCategories()
      setCategories(data)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Error al crear categoría')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Panel de administrador</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('producto')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'producto' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
        >
          <Package size={16} /> Nuevo producto
        </button>
        <button
          onClick={() => setTab('categoria')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'categoria' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
        >
          <Tag size={16} /> Nueva categoría
        </button>
      </div>

      {/* Formulario producto */}
      {tab === 'producto' && (
        <form onSubmit={handleCreateProduct} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Crear producto</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nombre</label>
              <input
                type="text"
                value={productForm.name}
                onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Categoría</label>
              <select
                value={productForm.category_id}
                onChange={e => setProductForm({ ...productForm, category_id: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecciona una categoría</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Precio</label>
              <input
                type="number"
                step="0.01"
                value={productForm.price}
                onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Stock</label>
              <input
                type="number"
                value={productForm.stock}
                onChange={e => setProductForm({ ...productForm, stock: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Descripción</label>
            <textarea
              value={productForm.description}
              onChange={e => setProductForm({ ...productForm, description: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">URL de imagen (opcional)</label>
            <input
              type="url"
              value={productForm.image_url}
              onChange={e => setProductForm({ ...productForm, image_url: e.target.value })}
              placeholder="https://..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Plus size={16} /> {loading ? 'Creando...' : 'Crear producto'}
          </button>
        </form>
      )}

      {/* Formulario categoría */}
      {tab === 'categoria' && (
        <form onSubmit={handleCreateCategory} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Crear categoría</h2>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nombre</label>
            <input
              type="text"
              value={categoryForm.name}
              onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Descripción</label>
            <input
              type="text"
              value={categoryForm.description}
              onChange={e => setCategoryForm({ ...categoryForm, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Plus size={16} /> {loading ? 'Creando...' : 'Crear categoría'}
          </button>
        </form>
      )}
    </div>
  )
}
