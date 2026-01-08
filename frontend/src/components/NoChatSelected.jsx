import { MessageSquare, Users } from 'lucide-react'

const NoChatSelected = ({ onOpenSidebar }) => {
	return (
		<div className='w-full flex flex-1 flex-col items-center justify-center p-6 sm:p-12 bg-base-100'>
			<div className='max-w-md text-center space-y-6'>
				<div className='flex justify-center mb-6'>
					<div className='relative'>
						<div className='w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-primary/10 flex items-center justify-center'>
							<MessageSquare className='w-10 h-10 sm:w-12 sm:h-12 text-primary' />
						</div>
					</div>
				</div>

				<div className='space-y-3'>
					<h2 className='text-2xl sm:text-3xl font-bold'>Welcome to Chatty!</h2>
					<p className='text-base-content/60 text-sm sm:text-base'>
						Select a conversation from the sidebar to start chatting
					</p>
				</div>

				{/* Mobile: Show button to open sidebar */}
				{onOpenSidebar && (
					<button
						onClick={onOpenSidebar}
						className='lg:hidden btn btn-primary gap-2 mt-6'
					>
						<Users className='size-5' />
						<span>View Contacts</span>
					</button>
				)}
			</div>
		</div>
	)
}

export default NoChatSelected
