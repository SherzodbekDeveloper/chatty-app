import { Search, Users, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useChatStore } from '../store/useChatStore'
import SidebarSkeleton from './skeletons/SidebarSkeleton'

const Sidebar = ({ onClose }) => {
	const {
		getUsers,
		users,
		selectedUser,
		setSelectedUser,
		isUsersLoading,
		unreadCounts,
	} = useChatStore()

	const { onlineUsers } = useAuthStore()
	const [showOnlineOnly, setShowOnlineOnly] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')

	useEffect(() => {
		getUsers()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const filteredUsers = (
		showOnlineOnly
			? users.filter(user => onlineUsers.includes(user._id))
			: users
	).filter(user =>
		user.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
	)

	const handleUserSelect = user => {
		setSelectedUser(user)
		if (onClose) {
			// Use setTimeout to defer onClose to next event loop cycle
			// This prevents React error #284: "Cannot update a component while rendering a different component"
			setTimeout(() => {
				onClose()
			}, 0)
		}
	}

	if (isUsersLoading) return <SidebarSkeleton />

	return (
		<aside className='h-full w-72 sm:w-80 bg-base-100 border-r border-base-300 flex flex-col shadow-lg'>
			{/* Header */}
			<div className='border-b border-base-300 p-4'>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center gap-2'>
						<Users className='size-5 text-primary' />
						<h2 className='font-semibold text-lg'>Chats</h2>
					</div>
					<button
						onClick={onClose}
						className='lg:hidden btn btn-ghost btn-sm btn-circle'
					>
						<X className='size-5' />
					</button>
				</div>

				<div className='relative'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/50' />
					<input
						type='text'
						placeholder='Search contacts...'
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
						className='w-full pl-10 pr-4 py-2 bg-base-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50'
					/>
				</div>

				<div className='mt-3 flex items-center gap-2'>
					<label className='cursor-pointer flex items-center gap-2'>
						<input
							type='checkbox'
							checked={showOnlineOnly}
							onChange={e => setShowOnlineOnly(e.target.checked)}
							className='checkbox checkbox-sm'
						/>
						<span className='text-xs text-base-content/70'>Online only</span>
					</label>
					<span className='text-xs text-base-content/50'>
						({onlineUsers.length - 1} online)
					</span>
				</div>
			</div>

			<div className='flex-1 overflow-y-auto'>
				{filteredUsers.length === 0 ? (
					<div className='text-center text-base-content/50 py-8 px-4'>
						<p className='text-sm'>
							{searchQuery ? 'No contacts found' : 'No users available'}
						</p>
					</div>
				) : (
					filteredUsers.map(user => {
						const unread = unreadCounts?.[user._id] || 0
						const isSelected = selectedUser?._id === user._id
						const isOnline = onlineUsers.includes(user._id)

						return (
							<button
								key={user._id}
								onClick={() => handleUserSelect(user)}
								className={`
                  w-full p-3 flex items-center gap-3
                  hover:bg-base-200 active:bg-base-300 transition-colors
                  border-l-2 border-transparent
                  ${isSelected ? 'bg-base-200 border-l-primary' : ''}
                `}
							>
								<div className='relative flex-shrink-0'>
									<img
										src={user.profilePic || '/avatar.png'}
										alt={user.fullName}
										className='size-12 object-cover rounded-full'
									/>
									{isOnline && (
										<span className='absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-100' />
									)}
									{unread > 0 && (
										<span className='absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-[11px] font-semibold flex items-center justify-center text-white shadow-md'>
											{unread > 4 ? '4+' : unread}
										</span>
									)}
								</div>

								<div className='flex-1 text-left min-w-0'>
									<div className='font-medium truncate text-base'>
										{user.fullName}
									</div>
									<div className='text-sm text-base-content/60 truncate'>
										{isOnline ? (
											<span className='text-green-500'>Online</span>
										) : (
											<span>Offline</span>
										)}
									</div>
								</div>
							</button>
						)
					})
				)}
			</div>
		</aside>
	)
}
export default Sidebar
