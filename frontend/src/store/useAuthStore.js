import { create } from 'zustand'
import { axiosInstance } from '../../lib/axios.js'
import toast from 'react-hot-toast'
import axios from 'axios'

export const useAuthStore = create(set => ({
	authUser: null,
	isSigningUp: false,
	isLogginIng: false,
	isUpdatingProfile: false,

	isCheckingAuth: true,

	checkAuth: async () => {
		try {
			const res = await axiosInstance.get('/auth/check')
			set({ authUser: res.data })
		} catch (error) {
			console.log('error in checkAuht', error.message)
			set({ authUser: null })
		} finally {
			set({ isCheckingAuth: false })
		}
	},
	signup: async data => {
		set({ isSigningUp: true })

		try {
			const res = await axiosInstance.post('/auth/signup', data)
			set({ authUser: res.data })
			toast.success('Account created successfully')
		} catch (error) {
			const message =
				error.response?.data?.message || error.message || 'Signup failed'

			toast.error(message)
		} finally {
			set({ isSigningUp: false })
		}
	},

	login: async (data) => {
		set({isLogginIng: true})
		try {
			const res = await axiosInstance.post("/auth/login", data)
			set({authUser: res.data});
			toast.success("Logged in successfully")
		} catch (error) {
			toast.error(error.response.data.message)
		} finally{
			set({isLogginIng:false})
		}
	},
	logout: async () => {
		try {
			await axiosInstance.post("/auth/logout")
			set({authUser: null})
			toast.success("Logged out succesfullyy")
		} catch (error) {
			toast.error(error.response.data.message)
		}
	}
}))

