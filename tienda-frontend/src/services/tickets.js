import api from './api'

export const createTicket = (data) => api.post('/tickets/', data)
export const getMyTickets = () => api.get('/tickets/me')
export const replyTicket = (id, data) => api.post(`/tickets/${id}/reply`, data)