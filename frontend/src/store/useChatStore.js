import toast from 'react-hot-toast'
import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import { useAuthStore } from './useAuthStore'

export const useChatStore = create((set, get) => ({
	messages: [],
	users: [],
	selectedUser: null,
	unreadCounts: {}, // { [userId]: number }
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
		const socket = useAuthStore.getState().socket
		if (!socket) {
			console.error('[useChatStore] Socket not available')
			return
		}

		const authUser = useAuthStore.getState().authUser
		if (!authUser) return

		socket.off('newMessage')

		socket.on('newMessage', newMessage => {
			const senderId = newMessage.senderId?.toString() || newMessage.senderId
			const receiverId =
				newMessage.receiverId?.toString() || newMessage.receiverId
			const currentUserId = authUser._id?.toString() || authUser._id

			// Ignore messages that are not related to current user
			if (senderId !== currentUserId && receiverId !== currentUserId) return

			// Determine the other user in this conversation
			const otherUserId = senderId === currentUserId ? receiverId : senderId

			const { selectedUser: currentSelectedUser } = get()
			const selectedUserId =
				currentSelectedUser?._id?.toString() || currentSelectedUser?._id

			// If this message belongs to the currently open chat, append to messages
			if (selectedUserId && otherUserId === selectedUserId) {
				const existingMessages = get().messages
				const messageExists = existingMessages.some(
					msg => msg._id?.toString() === newMessage._id?.toString()
				)

				if (!messageExists) {
					set({
						messages: [...existingMessages, newMessage],
					})
				}
				return
			}

			// Otherwise, increase unread count badge for that user (up to 4+)
			set(state => {
				const current = state.unreadCounts[otherUserId] || 0
				const next = current >= 4 ? 4 : current + 1
				return {
					unreadCounts: {
						...state.unreadCounts,
						[otherUserId]: next,
					},
				}
			})

			// Optional: show browser notification for incoming messages from other users
			if (typeof window !== 'undefined' && 'Notification' in window) {
				if (Notification.permission === 'granted') {
					// We don't have full user details here; badge is the priority
					new Notification('New message', {
						body: newMessage.text || 'New message received',
					})
				} else if (Notification.permission === 'default') {
					Notification.requestPermission()
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

	setSelectedUser: selectedUser =>
		set(state => {
			const newCounts = { ...state.unreadCounts }
			if (selectedUser?._id) {
				newCounts[selectedUser._id] = 0 // clear unread when opening chat
			}
			return {
				selectedUser,
				unreadCounts: newCounts,
			}
		}),
}))
