import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
	cors: {
		origin: process.env.CLIENT_URL || 'http://localhost:5173',
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	},
})

const userSocketMap = {}

export function getReceiverSocketId(userId) {
	return userSocketMap[userId]
}

io.on('connection', socket => {
	console.log('User connected:', socket.id)

	const userId = socket.handshake.query.userId
	if (userId != null) {
		userSocketMap[userId] = socket.id
		io.emit('getOnlineUsers', Object.keys(userSocketMap))
	} else {
		console.warn('Connection attempt without valid userId')
	}

	socket.on('disconnect', () => {
		console.log('User disconnected:', socket.id)
		if (userId != null) {
			delete userSocketMap[userId]
			io.emit('getOnlineUsers', Object.keys(userSocketMap))
		}
	})
})

export { app, io, server }
