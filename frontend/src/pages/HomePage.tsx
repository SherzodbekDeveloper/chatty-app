import { useState } from 'react'
import { useChatStore } from '../store/useChatStore'

import ChatContainer from '../components/ChatContainer'
import NoChatSelected from '../components/NoChatSelected'
import Sidebar from '../components/Sidebar'
import React from 'react'

const HomePage = () => {
  const { selectedUser } = useChatStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className='h-screen bg-base-200 flex flex-col'>
      {/* Mobile: Show sidebar overlay when open */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-40 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main container */}
      <div className='flex-1 flex overflow-hidden pt-16'>
        {/* Sidebar - Drawer on mobile, always visible on desktop */}
        <div
          className={`
            fixed lg:static inset-y-0 left-0 z-50
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            lg:translate-x-0
          `}
        >
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Chat area */}
        <div className='flex-1 flex flex-col overflow-hidden bg-base-100'>
          {!selectedUser ? (
            <NoChatSelected onOpenSidebar={() => setSidebarOpen(true)} />
          ) : (
            <ChatContainer onOpenSidebar={() => setSidebarOpen(true)} />
          )}
        </div>
      </div>
    </div>
  )
}
export default HomePage