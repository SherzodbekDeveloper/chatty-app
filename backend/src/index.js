import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { connectDB } from './lib/db.js'
import { app, server } from './lib/socket.js'
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'

dotenv.config()

const PORT = process.env.PORT || 5000
const NODE_ENV = process.env.NODE_ENV || 'development'
const isProduction = NODE_ENV === 'production'

// CORS Configuration
const corsOptions = {
	origin: isProduction
		? process.env.CLIENT_URL?.split(',') || []
		: process.env.CLIENT_URL || 'http://localhost:5173',
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))

// Security Headers
app.use((req, res, next) => {
	// Prevent clickjacking
	res.setHeader('X-Frame-Options', 'DENY')
	// Prevent MIME type sniffing
	res.setHeader('X-Content-Type-Options', 'nosniff')
	// Enable XSS protection
	res.setHeader('X-XSS-Protection', '1; mode=block')
	// Strict Transport Security (HTTPS only in production)
	if (isProduction) {
		res.setHeader(
			'Strict-Transport-Security',
			'max-age=31536000; includeSubDomains'
		)
	}
	// Content Security Policy
	res.setHeader(
		'Content-Security-Policy',
		"default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' ws: wss:;"
	)
	// Referrer Policy
	res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
	next()
})

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(cookieParser())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
	res.status(200).json({
		status: 'Server is running',
		environment: NODE_ENV,
		timestamp: new Date().toISOString(),
	})
})

// 404 handler
app.use((req, res) => {
	res.status(404).json({ error: 'Route not found' })
})

// Global error handler
app.use((err, req, res, next) => {
	console.error('Error:', err)
	res.status(err.status || 500).json({
		error: isProduction ? 'Internal server error' : err.message,
		...(isProduction ? {} : { stack: err.stack }),
	})
})

// Graceful shutdown
process.on('SIGTERM', () => {
	console.log('SIGTERM signal received: closing HTTP server')
	server.close(() => {
		console.log('HTTP server closed')
		process.exit(0)
	})
})

process.on('SIGINT', () => {
	console.log('SIGINT signal received: closing HTTP server')
	server.close(() => {
		console.log('HTTP server closed')
		process.exit(0)
	})
})

// Start server
connectDB()
	.then(() => {
		server.listen(PORT, () => {
			console.log(`🚀 Server running on port ${PORT}`)
			console.log(`📦 Environment: ${NODE_ENV}`)
			if (!isProduction) {
				console.log(`🌐 CORS enabled for: ${corsOptions.origin}`)
			}
		})
	})
	.catch(error => {
		console.error('❌ Failed to start server:', error.message)
		process.exit(1)
	})
