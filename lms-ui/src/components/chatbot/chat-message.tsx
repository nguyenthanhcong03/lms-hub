'use client'

import { BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/utils/format'
import { DEFAULT_AVATAR } from '@/constants'

interface ChatMessageProps {
  message: string
  isUser: boolean
  timestamp?: Date
  isLoading?: boolean
  user?: {
    avatar?: string
    name?: string
  }
  courses?: Array<{
    id: string
    slug: string
    title: string
    price: number
    oldPrice?: number
    image: string
    level: string
  }>
  suggestions?: string[]
  intent?: string
  onSuggestionClick?: (suggestion: string) => void
}

const ChatMessage = ({
  message,
  isUser,
  timestamp,
  isLoading = false,
  user,
  courses = [],
  suggestions = [],
  onSuggestionClick
}: ChatMessageProps) => {
  return (
    <div className={cn('group mb-6 flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {/* Ảnh đại diện */}
      <div className='relative shrink-0'>
        <Avatar className='h-10 w-10'>
          <div className='h-full w-full overflow-hidden rounded-full border-2 border-white/20 shadow-lg'>
            <Image
              src={isUser ? user?.avatar || DEFAULT_AVATAR : '/images/chatbot.png'}
              alt={isUser ? 'Ảnh đại diện người dùng' : 'Ảnh đại diện chatbot'}
              width={40}
              height={40}
              className='h-full w-full object-cover'
              priority
            />
          </div>
        </Avatar>
      </div>

      {/* Nội dung tin nhắn */}
      <div className={cn('flex w-full max-w-[300px] flex-col', isUser ? 'items-end' : 'items-start')}>
        {/* Bóng bóng tin nhắn */}
        <div className='group/bubble relative'>
          <div
            className={cn(
              'relative rounded-2xl px-4 py-3 text-sm shadow-lg transition-all duration-300',
              'border backdrop-blur-sm',
              isUser
                ? 'bg-brand-gradient-main rounded-br-md border-white/20 text-white'
                : 'rounded-bl-md border-gray-200/50 bg-white/90 text-gray-900'
            )}
          >
            {isLoading ? (
              <div className='flex items-center justify-center py-2'>
                {/* Hiệu ứng 3 chấm chuyển động */}
                <div className='flex gap-1'>
                  <div
                    className='bg-brand-indigo-primary h-2 w-2 animate-bounce rounded-full will-change-transform'
                    style={{
                      animationDelay: '0s',
                      animationDuration: '1s',
                      animationIterationCount: 'infinite'
                    }}
                  />
                  <div
                    className='bg-brand-indigo-primary h-2 w-2 animate-bounce rounded-full will-change-transform'
                    style={{
                      animationDelay: '0.15s',
                      animationDuration: '1s',
                      animationIterationCount: 'infinite'
                    }}
                  />
                  <div
                    className='bg-brand-indigo-primary h-2 w-2 animate-bounce rounded-full will-change-transform'
                    style={{
                      animationDelay: '0.3s',
                      animationDuration: '1s',
                      animationIterationCount: 'infinite'
                    }}
                  />
                </div>
              </div>
            ) : (
              <>
                <p className='leading-relaxed break-words whitespace-pre-wrap'>{message}</p>

                {/* Phần khóa học */}
                {!isUser && courses && courses.length > 0 && (
                  <div className='mt-3 w-full'>
                    <div className='mb-2 text-sm font-medium text-gray-700'>📚 Khóa học được đề xuất:</div>
                    <div className='max-h-[200px] w-full space-y-1.5 overflow-y-auto'>
                      {courses.map((course) => (
                        <Link key={course.id} href={`/courses/${course.slug}`} className='block w-full'>
                          <div className='w-full rounded-lg border border-gray-200/50 bg-white/60 p-2 transition-colors duration-200 hover:bg-white/80'>
                            <div className='flex items-start gap-2'>
                              {/* Ảnh khóa học - Khối 1 (nhỏ hơn) */}
                              <div className='flex-shrink-0'>
                                <div className='relative h-10 w-14 overflow-hidden rounded bg-gray-100'>
                                  {course.image ? (
                                    <Image
                                      src={course.image}
                                      alt={course.title}
                                      fill
                                      className='object-cover'
                                      sizes='56px'
                                    />
                                  ) : (
                                    <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600'>
                                      <BookOpen className='h-3 w-3 text-white' />
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Tiêu đề + giá - Khối 2 */}
                              <div className='flex min-w-0 flex-1 flex-col gap-1.5'>
                                {/* Tiêu đề khóa học */}
                                <div>
                                  <h4 className='line-clamp-1 text-xs leading-tight font-medium text-gray-900'>
                                    {course.title}
                                  </h4>
                                </div>

                                {/* Thông tin giá khóa học (rút gọn) */}
                                <div className='flex items-center gap-2'>
                                  {course.oldPrice && course.oldPrice > course.price && (
                                    <span className='text-xs text-gray-400 line-through'>
                                      {formatPrice(course.oldPrice)}
                                    </span>
                                  )}
                                  <span className='text-sm font-semibold text-blue-600'>
                                    {course.price === 0 ? 'Miễn phí' : formatPrice(course.price)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Phần gợi ý */}
                {!isUser && suggestions && suggestions.length > 0 && (
                  <div className='mt-3 w-full max-w-full'>
                    <div className='mb-2 text-sm font-medium text-gray-700'>💡 Bạn có thể hỏi:</div>
                    <div className='grid w-full max-w-full grid-cols-1 gap-1.5'>
                      {suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant='outline'
                          size='sm'
                          className='h-auto min-h-[32px] w-full justify-start overflow-hidden rounded-lg border-gray-200/50 bg-white/60 px-3 py-2 text-left text-xs transition-colors duration-200 hover:border-blue-200 hover:bg-blue-50'
                          onClick={() => onSuggestionClick?.(suggestion)}
                          title={suggestion}
                        >
                          <span
                            className='line-clamp-2 overflow-hidden leading-tight'
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {suggestion}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dấu hiệu đã gửi cho tin nhắn của người dùng */}
                {isUser && (
                  <div className='absolute -right-1 -bottom-1 flex h-3 w-3 items-center justify-center rounded-full bg-white/80'>
                    <div className='bg-brand-purple-primary h-1.5 w-1.5 rounded-full' />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mốc thời gian */}
        {timestamp && !isLoading && (
          <span className={cn('mt-2 px-2 text-xs font-medium text-gray-500 opacity-70')}>
            {timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        )}
      </div>
    </div>
  )
}

export default ChatMessage
