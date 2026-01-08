import axios from 'axios'

const getBaseURL = () => {
	// Check if VITE_API_URL is set (for production with separate API domain)
	if (import.meta.env.VITE_API_URL) {
		return import.meta.env.VITE_API_URL
	}
	// Development mode
	if (import.meta.env.MODE === 'development') {
		return 'http://localhost:5001/api'
	}
	// Production mode - use relative paths (same domain)
	return '/api'
}

export const axiosInstance = axios.create({
	baseURL: getBaseURL(),
	withCredentials: true,
	timeout: 30000, // 30 seconds timeout
})

// Request interceptor
axiosInstance.interceptors.request.use(
	config => {
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
	response => {
		return response
	},
	error => {
		if (error.response?.status === 401) {
			// Handle unauthorized - redirect to login
			if (window.location.pathname !== '/login') {
				window.location.href = '/login'
			}
		}
		return Promise.reject(error)
	}
)
