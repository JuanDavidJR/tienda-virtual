import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Bienvenido a TiendaVirtual</h1>
      <p className="text-gray-500 mb-8">Los mejores productos al mejor precio</p>
      <Link to="/catalog" className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors text-lg">
        Ver catálogo
      </Link>
    </div>
  )
}