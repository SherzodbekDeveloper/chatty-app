import { Image, Send, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useChatStore } from '../store/useChatStore'

const MessageInput = () => {
	const [text, setText] = useState('')
	const [imagePreview, setImagePreview] = useState(null)
	const fileInputRef = useRef(null)
	const inputRef = useRef(null)
	const { sendMessage, selectedUser, isSendingMessage } = useChatStore()

	useEffect(() => {
		if (inputRef.current) {
			setTimeout(() => {
				inputRef.current?.focus()
			}, 100)
		}
	}, [selectedUser?._id])

	const handleImageChange = e => {
		const file = e.target.files && e.target.files[0]
		if (!file) return

		if (!file.type.startsWith('image/')) {
			toast.error('Please select an image file')
			return
		}

		if (file.size > 10 * 1024 * 1024) {
			toast.error('Image size must be less than 10MB')
			return
		}

		const reader = new FileReader()
		reader.onloadend = () => {
			setImagePreview(reader.result)
		}
		reader.readAsDataURL(file)
	}

	const removeImage = () => {
		setImagePreview(null)
		if (fileInputRef.current) fileInputRef.current.value = ''
	}

	const handleSendMessage = async e => {
		e.preventDefault()
		if ((!text.trim() && !imagePreview) || isSendingMessage) return

		try {
			await sendMessage({
				text: text.trim(),
				image: imagePreview,
			})

			setText('')
			setImagePreview(null)
			if (fileInputRef.current) fileInputRef.current.value = ''

			setTimeout(() => {
				inputRef.current?.focus()
			}, 100)
		} catch (error) {
			console.error('Failed to send message:', error)
		}
	}

	return (
		<div className='sticky bottom-0 bg-base-100 border-t border-base-300 p-3 sm:p-4'>
			{imagePreview && (
				<div className='mb-3 flex items-center gap-2'>
					<div className='relative'>
						<img
							src={imagePreview}
							alt='Preview'
							className='w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border-2 border-primary'
						/>
						<button
							onClick={removeImage}
							className='absolute -top-2 -right-2 w-6 h-6 rounded-full bg-error text-error-content flex items-center justify-center shadow-lg hover:scale-110 transition-transform'
							type='button'
						>
							<X className='size-4' />
						</button>
					</div>
				</div>
			)}

			<form onSubmit={handleSendMessage} className='flex items-end gap-2'>
				<button
					type='button'
					onClick={() => fileInputRef.current?.click()}
					className={`btn btn-circle btn-sm sm:btn-md ${
						imagePreview ? 'btn-primary' : 'btn-ghost'
					}`}
				>
					<Image className='size-5' />
				</button>

				<div className='flex-1'>
					<input
						type='text'
						ref={inputRef}
						value={text}
						onChange={e => setText(e.target.value)}
						placeholder='Type a message...'
						className='w-full input input-bordered rounded-full px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary/50'
						disabled={isSendingMessage}
					/>
				</div>

				<button
					type='submit'
					disabled={(!text.trim() && !imagePreview) || isSendingMessage}
					className='btn btn-circle btn-primary btn-sm sm:btn-md disabled:opacity-50'
				>
					{isSendingMessage ? (
						<span className='loading loading-spinner loading-sm' />
					) : (
						<Send className='size-5' />
					)}
				</button>

				<input
					type='file'
					accept='image/*'
					className='hidden'
					ref={fileInputRef}
					onChange={handleImageChange}
				/>
			</form>
		</div>
	)
}
export default MessageInput
