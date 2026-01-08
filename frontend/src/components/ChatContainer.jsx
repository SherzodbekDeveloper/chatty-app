import { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'

import { formatMessageTime } from '../lib/utils'
import { useAuthStore } from '../store/useAuthStore'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import MessageSkeleton from './skeletons/MessageSkeleton'

const ChatContainer = ({ onOpenSidebar }) => {
	const {
		messages,
		getMessages,
		isMessagesLoading,
		selectedUser,
		subscribeToMessages,
		unsubscribeFromMessages,
	} = useChatStore()
	const { authUser } = useAuthStore()
	const messageEndRef = useRef < HTMLDivElement > null
	const messagesContainerRef = useRef < HTMLDivElement > null

	useEffect(() => {
		if (!selectedUser?._id) return

		getMessages(selectedUser._id)

		subscribeToMessages()

		return () => unsubscribeFromMessages()
	}, [
		selectedUser?._id,
		getMessages,
		subscribeToMessages,
		unsubscribeFromMessages,
	])

	useEffect(() => {
		if (messageEndRef.current) {
			setTimeout(() => {
				messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
			}, 100)
		}
	}, [messages])

	if (isMessagesLoading) {
		return (
			<div className='flex-1 flex flex-col h-full overflow-hidden'>
				<ChatHeader onOpenSidebar={onOpenSidebar} />
				<MessageSkeleton />
				<MessageInput />
			</div>
		)
	}

	return (
		<div className='flex-1 flex flex-col h-full overflow-hidden'>
			<ChatHeader onOpenSidebar={onOpenSidebar} />

			<div
				ref={messagesContainerRef}
				className='flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-3'
			>
				{messages.length === 0 ? (
					<div className='flex items-center justify-center h-full'>
						<div className='text-center text-base-content/50'>
							<p className='text-sm'>
								No messages yet. Start the conversation!
							</p>
						</div>
					</div>
				) : (
					messages.map(message => {
						const isSentByMe =
							(message.senderId?.toString() || message.senderId) ===
							(authUser._id?.toString() || authUser._id)
						return (
							<div
								key={message._id}
								className={`flex gap-2 ${
									isSentByMe ? 'flex-row-reverse' : 'flex-row'
								}`}
							>
								<div
									className={`flex-shrink-0 ${
										isSentByMe ? 'hidden sm:block' : ''
									}`}
								>
									<img
										src={
											isSentByMe
												? authUser.profilePic || '/avatar.png'
												: selectedUser.profilePic || '/avatar.png'
										}
										alt='avatar'
										className='size-8 rounded-full object-cover'
									/>
								</div>

								<div
									className={`flex flex-col max-w-[75%] sm:max-w-[60%] ${
										isSentByMe ? 'items-end' : 'items-start'
									}`}
								>
									{!isSentByMe && (
										<span className='text-xs text-base-content/50 mb-1 px-1'>
											{formatMessageTime(message.createdAt)}
										</span>
									)}
									<div
										className={`rounded-2xl px-4 py-2 ${
											isSentByMe
												? 'bg-primary text-primary-content'
												: 'bg-base-200 text-base-content'
										}`}
									>
										{message.image && (
											<img
												src={message.image}
												alt='Attachment'
												className='max-w-full sm:max-w-[250px] rounded-lg mb-2'
											/>
										)}
										{message.text && (
											<p className='text-sm sm:text-base break-words'>
												{message.text}
											</p>
										)}
									</div>
									{isSentByMe && (
										<span className='text-xs text-base-content/50 mt-1 px-1'>
											{formatMessageTime(message.createdAt)}
										</span>
									)}
								</div>
							</div>
						)
					})
				)}
				<div ref={messageEndRef} />
			</div>

			<MessageInput />
		</div>
	)
}
export default ChatContainer
