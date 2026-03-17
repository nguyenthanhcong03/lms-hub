'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Sparkles, X } from 'lucide-react'
import { TbMessageCircleFilled } from 'react-icons/tb'
interface ChatbotButtonProps {
  isOpen: boolean
  onClick: () => void
}

const ChatbotButton = ({ isOpen, onClick }: ChatbotButtonProps) => {
  return (
    <div className='animate-fade-in-up fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6'>
      {/* Nền kính nâng cao với nhiều lớp */}
      <div className='absolute inset-0 rounded-full'>
        {/* Nền gradient cơ bản */}
        <div className='absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 opacity-90 transition-all duration-500' />
        {/* Lớp phủ kính */}
        <div className='absolute inset-0 rounded-full bg-white/10 backdrop-blur-xl transition-all duration-500' />
        {/* Lớp phủ gradient động */}
        <div className='absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500' />
      </div>

      {/* Vòng hiệu ứng nổi */}
      <div
        className={cn(
          'absolute inset-0 rounded-full transition-all duration-500',
          'animate-pulse bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-blue-600/30',
          isOpen ? 'scale-125 opacity-40' : 'scale-110 opacity-20'
        )}
      />

      {/* Vòng ngoài nhấp nháy - hiệu ứng lan tỏa */}
      <div className='absolute inset-0 animate-ping rounded-full bg-purple-500/20 opacity-75' />

      {/* Nút chính */}
      <Button
        onClick={onClick}
        size='icon'
        className={cn(
          'relative h-14 w-14 overflow-hidden rounded-full shadow-2xl transition-all duration-300 sm:h-16 sm:w-16',
          'bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 text-white',
          'border-2 border-white/30 backdrop-blur-xl',
          'hover:scale-110 hover:shadow-xl hover:shadow-purple-500/25',
          'hover:from-blue-700 hover:via-blue-800 hover:to-purple-700',
          'group transform-gpu will-change-transform',
          'animate-bounce-gentle',
          'focus:outline-none',
          isOpen ? 'scale-95 rotate-180 shadow-inner' : 'hover:rotate-12 active:scale-95'
        )}
        aria-label={isOpen ? 'Đóng trợ lý chat' : 'Mở trợ lý chat'}
        aria-expanded={isOpen}
        aria-controls={isOpen ? 'chatbot-dialog' : undefined}
      >
        {/* Hiệu ứng ánh sáng động giống header */}
        <div className='absolute inset-0 translate-x-[-100%] -skew-x-12 transform rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]'></div>

        {/* Lớp phủ phong cách kính */}
        <div className='absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent'></div>

        {/* Vùng chứa biểu tượng */}
        <div className='relative z-10 flex items-center justify-center'>
          {isOpen ? (
            <X size={18} className={cn('transition-all duration-300 sm:h-5 sm:w-5', 'drop-shadow-sm')} />
          ) : (
            <div className='relative flex items-center justify-center'>
              <TbMessageCircleFilled
                size={20}
                className='animate-float shrink-0 drop-shadow-sm transition-all duration-300 sm:h-[22px] sm:w-[22px]'
              />

              {/* Hiệu ứng lấp lánh nâng cao */}
              <Sparkles
                className={cn(
                  'absolute h-3 w-3 text-white/80 transition-all duration-500 sm:h-4 sm:w-4',
                  'animate-pulse opacity-0 group-hover:opacity-100',
                  '-top-1 -right-1 group-hover:scale-110'
                )}
              />
            </div>
          )}
        </div>
      </Button>
    </div>
  )
}

export default ChatbotButton
