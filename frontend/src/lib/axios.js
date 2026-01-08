import axios from 'axios'

const getBaseURL = () => {
	if (import.meta.env.VITE_API_URL) {
		return import.meta.env.VITE_API_URL
	}
	if (import.meta.env.MODE === 'development') {
		return 'http://localhost:5001/api'
	}
	return '/api'
}

export const axiosInstance = axios.create({
	baseURL: getBaseURL(),
	withCredentials: true,
	timeout: 30000, // 30 seconds timeout
})

axiosInstance.interceptors.request.use(
	config => {
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

axiosInstance.interceptors.response.use(
	response => {
		return response
	},
	error => {
		if (error.response?.status === 401) {
			if (window.location.pathname !== '/login') {
				window.location.href = '/login'
			}
		}
		return Promise.reject(error)
	}
)
