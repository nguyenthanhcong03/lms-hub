'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

// Import tĩnh cho sidebar luôn hiển thị (quan trọng)
import ProfileSidebar from './components/profile-sidebar'
import type { ProfileTab } from './components/profile-sidebar'

// Import động cho các tab (theo người dùng, có tương tác)
const MyCoursesTab = dynamic(() => import('./components/my-courses-tab'), {
  ssr: false
})

const ProfileInfoTab = dynamic(() => import('./components/profile-info-tab'), {
  ssr: false
})

const MyPostsTab = dynamic(() => import('./components/my-posts-tab'), {
  ssr: false
})

const SettingsTab = dynamic(() => import('./components/settings-tab'), {
  ssr: false
})

// Trang hồ sơ cá nhân
const MyProfilePage = () => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('account')

  // Render nội dung tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return <ProfileInfoTab />
      case 'courses':
        return <MyCoursesTab />
      case 'posts':
        return <MyPostsTab />
      case 'settings':
        return <SettingsTab />
      default:
        return <ProfileInfoTab />
    }
  }

  return (
    <div className='container mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:py-8'>
      <div className='grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8'>
        {/* Thanh bên */}
        <div className='lg:col-span-1'>
          <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Nội dung chính */}
        <div className='lg:col-span-3'>{renderTabContent()}</div>
      </div>
    </div>
  )
}

export default MyProfilePage
