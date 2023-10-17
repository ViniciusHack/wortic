import { io, Socket } from 'socket.io-client'
import { api } from './api'

let socket: Socket

export const getSocket = async (): Promise<Socket> => {
  if (!socket) {
    await api.get('/socketio')
    socket = io()
    socket.on('connect', () => {
      console.log('Conectado ao servidor')
    })
    
    socket.on('connect_error', (error) => {
      console.log('Erro ao conectar ao servidor:', error)
    })
    
    socket.on('disconnect', (reason) => {
      console.log('Desconectado do servidor:', reason)
    })
  }
  return socket
}
