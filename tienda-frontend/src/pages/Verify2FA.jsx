import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { verify2FA } from '../services/auth'
import toast from 'react-hot-toast'
import { ShieldCheck } from 'lucide-react'

export default function Verify2FA() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email

  if (!email) {
    navigate('/login')
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await verify2FA({ email, code })
      loginUser(data.access_token)
      toast.success('Verificación exitosa')
      navigate('/catalog')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Código incorrecto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 w-full max-w-md">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
            <ShieldCheck size={28} className="text-blue-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Verificación 2FA</h1>
        <p className="text-gray-400 text-sm text-center mb-6">
          Ingresa el código de 6 dígitos de Google Authenticator
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            maxLength={6}
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="000000"
            className="w-full border border-gray-300 rounded-lg px-3 py-3 text-center text-2xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Verificar'}
          </button>
        </form>
      </div>
    </div>
  )
}
