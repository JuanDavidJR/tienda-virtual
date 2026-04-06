import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { User, ShoppingBag, MessageCircle, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mi perfil</h1>

      {/* Avatar */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4 flex items-center gap-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <User size={32} className="text-blue-600" />
        </div>
        <div>
          <p className="font-bold text-gray-800 text-lg">Usuario #{user?.id}</p>
          <p className="text-gray-400 text-sm">Cuenta activa</p>
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="space-y-3">
        <Link
          to="/orders"
          className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:shadow-sm transition-shadow"
        >
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <ShoppingBag size={20} className="text-purple-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Mis pedidos</p>
            <p className="text-sm text-gray-400">Ver historial de compras</p>
          </div>
        </Link>

        <Link
          to="/tickets"
          className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:shadow-sm transition-shadow"
        >
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <MessageCircle size={20} className="text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Soporte</p>
            <p className="text-sm text-gray-400">Ver mis tickets de atención</p>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full bg-white rounded-xl border border-red-200 p-4 flex items-center gap-4 hover:bg-red-50 transition-colors"
        >
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <LogOut size={20} className="text-red-500" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-red-600">Cerrar sesión</p>
            <p className="text-sm text-gray-400">Salir de tu cuenta</p>
          </div>
        </button>
      </div>
    </div>
  )
}