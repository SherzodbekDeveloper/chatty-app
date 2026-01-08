import { ArrowLeft, MoreVertical } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { useChatStore } from '../store/useChatStore'

const ChatHeader = ({ onOpenSidebar }) => {
	const { selectedUser, setSelectedUser } = useChatStore()
	const { onlineUsers } = useAuthStore()

	const handleBack = () => {
		setSelectedUser(null)
		if (onOpenSidebar) {
			onOpenSidebar()
		}
	}

	return (
		<div className='sticky top-0 z-10 bg-base-100/95 backdrop-blur-sm border-b border-base-300'>
			<div className='p-3 sm:p-4'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-3 flex-1 min-w-0'>
  						<button
							onClick={handleBack}
							className='lg:hidden btn btn-ghost btn-sm btn-circle mr-1'
						>
							<ArrowLeft className='size-5' />
						</button>

						<div className='relative flex-shrink-0'>
							<img
								src={selectedUser.profilePic || '/avatar.png'}
								alt={selectedUser.fullName}
								className='size-10 sm:size-12 rounded-full object-cover'
							/>
							{onlineUsers.includes(selectedUser._id) && (
								<span className='absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-100' />
							)}
						</div>

  						<div className='flex-1 min-w-0'>
							<h3 className='font-semibold text-base sm:text-lg truncate'>
								{selectedUser.fullName}
							</h3>
							<p className='text-xs sm:text-sm text-base-content/60'>
								{onlineUsers.includes(selectedUser._id) ? (
									<span className='text-green-500'>Online</span>
								) : (
									<span>Offline</span>
								)}
							</p>
						</div>
					</div>

					<div className='flex items-center gap-2'>
						<button className='btn btn-ghost btn-sm btn-circle'>
							<MoreVertical className='size-5' />
						</button>
						<button
							onClick={handleBack}
							className='hidden lg:flex btn btn-ghost btn-sm btn-circle'
						>
							<ArrowLeft className='size-5' />
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
export default ChatHeader
