import { Skeleton } from '@/components/ui/skeleton'

export function BlogCardSkeleton() {
  return (
    <article className='group overflow-hidden rounded-xs border border-gray-200 bg-white'>
      {/* Skeleton ảnh */}
      <div className='relative aspect-[16/10] overflow-hidden'>
        <Skeleton className='h-full w-full' />
        {/* Skeleton nhãn danh mục */}
        <div className='absolute top-4 left-4'>
          <Skeleton className='h-6 w-20 rounded-full' />
        </div>
      </div>

      {/* Skeleton nội dung */}
      <div className='space-y-4 p-6'>
        {/* Skeleton thông tin */}
        <div className='flex items-center space-x-4'>
          <div className='flex items-center space-x-1'>
            <Skeleton className='h-4 w-4' />
            <Skeleton className='h-4 w-24' />
          </div>
          <div className='flex items-center space-x-1'>
            <Skeleton className='h-4 w-4' />
            <Skeleton className='h-4 w-16' />
          </div>
        </div>

        {/* Skeleton tiêu đề */}
        <div className='space-y-2'>
          <Skeleton className='h-6 w-full' />
          <Skeleton className='h-6 w-3/4' />
        </div>

        {/* Skeleton thân bài */}
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-2/3' />
        </div>

        {/* Skeleton tác giả và đọc thêm */}
        <div className='flex items-center justify-between pt-4'>
          {/* Skeleton tác giả */}
          <div className='flex items-center space-x-3'>
            <Skeleton className='h-10 w-10 rounded-full' />
            <div className='space-y-1'>
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-3 w-12' />
            </div>
          </div>

          {/* Skeleton đọc thêm */}
          <Skeleton className='h-6 w-20' />
        </div>
      </div>
    </article>
  )
}
