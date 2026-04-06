import api from './api'

export const getCart = () => api.get('/cart/')
export const addToCart = (data) => api.post('/cart/add', data)
export const removeFromCart = (id) => api.delete(`/cart/item/${id}`)
export const checkout = (data) => api.post('/cart/checkout', data)
export const getOrders = () => api.get('/cart/orders')