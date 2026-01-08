import { LogOut, MessageSquare, Settings, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

const Navbar = () => {
	const { logout, authUser } = useAuthStore()

	return (
		<header className='fixed top-0 left-0 right-0 z-50 bg-base-100/95 backdrop-blur-md border-b border-base-300 shadow-sm'>
			<div className='h-14 sm:h-16'>
				<div className='flex items-center justify-between h-full px-4'>
					<Link
						to='/'
						className='flex items-center gap-2 sm:gap-2.5 hover:opacity-80 transition-opacity'
					>
						<div className='size-8 sm:size-9 rounded-lg bg-primary/10 flex items-center justify-center'>
							<MessageSquare className='w-4 h-4 sm:w-5 sm:h-5 text-primary' />
						</div>
						<h1 className='text-base sm:text-lg font-bold'>Chatty</h1>
					</Link>

					<div className='flex items-center gap-3 sm:gap-4'>
						<Link
							to='/settings'
							className='btn btn-ghost btn-sm sm:btn-sm gap-2'
							title='Settings'
						>
							<Settings className='w-4 h-4 sm:w-5 sm:h-5' />
							<span className='hidden md:inline'>Settings</span>
						</Link>

						{authUser && (
							<>
								<Link
									to='/profile'
									className='btn btn-ghost btn-sm sm:btn-sm gap-2'
									title='Profile'
								>
									<User className='w-4 h-4 sm:w-5 sm:h-5' />
									<span className='hidden md:inline'>Profile</span>
								</Link>

								<button
									onClick={logout}
									className='btn btn-ghost btn-sm sm:btn-sm gap-2'
								>
									<LogOut className='w-4 h-4 sm:w-5 sm:h-5' />
									<span className='hidden md:inline'>Logout</span>
								</button>
							</>
						)}
					</div>
				</div>
			</div>
		</header>
	)
}
export default Navbar
