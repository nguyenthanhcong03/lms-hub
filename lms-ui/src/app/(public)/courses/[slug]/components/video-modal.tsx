'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  videoUrl: string | null
  title?: string
}

function VideoModal({ isOpen, onClose, videoUrl, title }: VideoModalProps) {
  const getVideoEmbedUrl = (url: string) => {
    // Chuyển URL YouTube dạng watch sang URL embed
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`
    }
    // Chuyển URL YouTube rút gọn
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0]
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`
    }
    // Nếu đã là URL embed hoặc URL video khác
    return url
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent showCloseButton={false} className='overflow-hidden border-none bg-black p-0 sm:max-w-5xl'>
        <DialogHeader className='sr-only'>
          <DialogTitle>{title || 'Xem trước video'}</DialogTitle>
        </DialogHeader>
        <div className='relative aspect-video w-full bg-black'>
          {isOpen && videoUrl && (
            <iframe
              src={getVideoEmbedUrl(videoUrl)}
              className='h-full w-full'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
              title={title || 'Xem trước video'}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default VideoModal
