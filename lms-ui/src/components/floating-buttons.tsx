'use client'

import dynamic from 'next/dynamic'

// Import động với ssr: false để tránh sai khớp hydration
const Chatbot = dynamic(() => import('@/components/chatbot/chatbot'), {
  ssr: false
})

const FloatingButtons = () => {
  return (
    <>
      <Chatbot />
    </>
  )
}

export default FloatingButtons
