import toast from 'react-hot-toast'
import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import { useAuthStore } from './useAuthStore'

export const useChatStore = create((set, get) => ({
	messages: [],
	users: [],
	selectedUser: null,
	isUsersLoading: false,
	isMessagesLoading: false,
	isSendingMessage: false, // add loading state for sending

	getUsers: async () => {
		set({ isUsersLoading: true })
		try {
			const res = await axiosInstance.get('/messages/users')
			set({ users: res.data })
		} catch (error) {
			const errorMessage =
				error.response?.data?.message || error.message || 'Failed to load users'
			toast.error(errorMessage)
			console.error('[useChatStore] getUsers error:', error)
		} finally {
			set({ isUsersLoading: false })
		}
	},

	getMessages: async userId => {
		if (!userId) {
			toast.error('Invalid user ID')
			return
		}

		set({ isMessagesLoading: true })
		try {
			const res = await axiosInstance.get(`/messages/${userId}`)
			set({ messages: res.data })
		} catch (error) {
			const errorMessage =
				error.response?.data?.message ||
				error.message ||
				'Failed to load messages'
			toast.error(errorMessage)
			console.error('[useChatStore] getMessages error:', error)
		} finally {
			set({ isMessagesLoading: false })
		}
	},

	sendMessage: async messageData => {
		const { selectedUser, messages } = get()

		if (!selectedUser) {
			toast.error('No user selected')
			return
		}

		if (!messageData || (!messageData.text && !messageData.image)) {
			toast.error('Message cannot be empty')
			return
		}

		set({ isSendingMessage: true })
		try {
			const res = await axiosInstance.post(
				`/messages/send/${selectedUser._id}`,
				messageData
			)
			set({ messages: [...messages, res.data] })

			const socket = useAuthStore.getState().socket
			if (socket) {
				socket.emit('messageSent', res.data)
			}
		} catch (error) {
			const errorMessage =
				error.response?.data?.message ||
				error.message ||
				'Failed to send message'
			toast.error(errorMessage)
			console.error('[useChatStore] sendMessage error:', {
				status: error.response?.status,
				message: errorMessage,
				data: error.response?.data,
			})
		} finally {
			set({ isSendingMessage: false })
		}
	},

	subscribeToMessages: () => {
		const { selectedUser } = get()
		if (!selectedUser) return

		const socket = useAuthStore.getState().socket
		if (!socket) {
			console.error('[useChatStore] Socket not available')
			return
		}

		const authUser = useAuthStore.getState().authUser
		if (!authUser) return

		socket.off('newMessage')

		socket.on('newMessage', newMessage => {
			const { selectedUser: currentSelectedUser } = get()
			if (!currentSelectedUser) return

			// Check if message is part of the current conversation
			// Message should be from selected user to current user, or from current user to selected user
			const senderId = newMessage.senderId?.toString() || newMessage.senderId
			const receiverId =
				newMessage.receiverId?.toString() || newMessage.receiverId
			const selectedUserId =
				currentSelectedUser._id?.toString() || currentSelectedUser._id
			const currentUserId = authUser._id?.toString() || authUser._id

			const isFromSelectedUser =
				senderId === selectedUserId && receiverId === currentUserId
			const isToSelectedUser =
				senderId === currentUserId && receiverId === selectedUserId

			if (isFromSelectedUser || isToSelectedUser) {
				// Check if message already exists to avoid duplicates
				const existingMessages = get().messages
				const messageExists = existingMessages.some(
					msg => msg._id?.toString() === newMessage._id?.toString()
				)

				if (!messageExists) {
					set({
						messages: [...existingMessages, newMessage],
					})
				}
			}
		})
	},

	unsubscribeFromMessages: () => {
		const socket = useAuthStore.getState().socket
		if (socket) {
			socket.off('newMessage')
		}
	},

	setSelectedUser: selectedUser => set({ selectedUser }),
}))
