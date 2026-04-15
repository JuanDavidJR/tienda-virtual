import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ShoppingCart, Package, Ticket, User, LogOut, Store, Settings } from 'lucide-react'

export default function Navbar() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
          <Store size={24} />
          TiendaVirtual
        </Link>

        {/* Links centrales */}
        <div className="flex items-center gap-6">
          <Link to="/catalog" className="text-gray-600 hover:text-blue-600 transition-colors">
            Catálogo
          </Link>
          {token && (
            <>
              <Link to="/cart" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
                <ShoppingCart size={18} /> Carrito
              </Link>
              <Link to="/orders" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
                <Package size={18} /> Pedidos
              </Link>
              <Link to="/tickets" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
                <Ticket size={18} /> Soporte
              </Link>
              <Link to="/admin" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
  <Settings size={18} /> Admin
</Link>

            </>
          )}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {token ? (
            <>
              <Link to="/profile" className="text-gray-600 hover:text-blue-600 transition-colors">
                <User size={20} />
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors"
              >
                <LogOut size={18} /> Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                Ingresar
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
