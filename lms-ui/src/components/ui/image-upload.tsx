'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { UploadedImage, UploadService } from '@/services/upload'
import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import { X } from 'lucide-react'
import Image from 'next/image'
import { ChangeEvent, DragEvent, KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MdImage, MdPhotoLibrary, MdUpload } from 'react-icons/md'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onError?: (error: string) => void
  onUploaded?: (result: { url: string; publicId: string }) => void
  disabled?: boolean
  label?: string
  folder?: string
  maxSizeMB?: number
  className?: string
  showUrlInput?: boolean
  placeholder?: string
  helperText?: string
  accept?: string
}

const DEFAULT_ACCEPT = 'image/png,image/jpeg,image/jpg,image/webp,image/gif'

export function ImageUpload({
  value,
  onChange,
  onError,
  onUploaded,
  disabled = false,
  label,
  folder = 'uploads',
  maxSizeMB = 5,
  className,
  helperText,
  accept = DEFAULT_ACCEPT
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null)
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewObjectUrlRef = useRef<string | null>(null)
  const resolvedHelperText = helperText || `PNG, JPG, WEBP, GIF. Tối đa ${maxSizeMB}MB.`

  const {
    data: libraryData,
    isLoading: isLibraryLoading,
    isFetchingNextPage,
    hasNextPage,
    error: libraryError,
    fetchNextPage,
    refetch: refetchLibrary
  } = useInfiniteQuery({
    queryKey: ['uploaded-images-library', folder],
    queryFn: ({ pageParam }) =>
      UploadService.listUploadedImages({
        folder,
        limit: 8,
        nextCursor: (pageParam as string | undefined) ?? undefined
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: isLibraryOpen,
    staleTime: 60_000
  })

  const deleteImageMutation = useMutation({
    mutationFn: async (payload: { publicId: string; url: string }) => {
      await UploadService.deleteImage(payload.publicId)
      return payload
    },
    onSuccess: async ({ url }) => {
      if (value === url) {
        onChange('')
      }

      await refetchLibrary()
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Không thể xóa ảnh khỏi Cloud.'
      emitError(message)
    }
  })

  const libraryImages = useMemo<UploadedImage[]>(() => {
    if (!libraryData?.pages) {
      return []
    }

    return libraryData.pages.flatMap((page) => page.images)
  }, [libraryData])

  useEffect(() => {
    return () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (value && previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current)
      previewObjectUrlRef.current = null
      setLocalPreviewUrl(null)
    }
  }, [value])

  const emitError = useCallback(
    (message: string) => {
      onError?.(message)
    },
    [onError]
  )

  useEffect(() => {
    if (libraryError) {
      const message = libraryError instanceof Error ? libraryError.message : 'Không thể tải thư viện ảnh.'
      emitError(message)
    }
  }, [libraryError, emitError])

  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith('image/')) {
      emitError('Chỉ chấp nhận file ảnh')
      return false
    }

    const maxBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxBytes) {
      emitError(`Kích thước ảnh không được vượt quá ${maxSizeMB}MB`)
      return false
    }

    return true
  }

  const uploadSelectedFile = async (file: File) => {
    if (!validateFile(file)) {
      return
    }

    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current)
    }

    const nextPreviewUrl = URL.createObjectURL(file)
    previewObjectUrlRef.current = nextPreviewUrl
    setLocalPreviewUrl(nextPreviewUrl)

    try {
      setIsUploading(true)
      const uploaded = await UploadService.uploadImage(file, folder)
      onChange(uploaded.url)
      onUploaded?.(uploaded)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Không thể tải ảnh lên. Vui lòng thử lại.'
      emitError(errorMessage)
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current)
        previewObjectUrlRef.current = null
      }
      setLocalPreviewUrl(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    await uploadSelectedFile(file)
    event.target.value = ''
  }

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (disabled || isUploading) {
      return
    }

    setIsDragOver(false)
    const file = event.dataTransfer.files?.[0]
    if (!file) {
      return
    }

    await uploadSelectedFile(file)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (!disabled && !isUploading) {
        fileInputRef.current?.click()
      }
    }
  }

  const openLibrary = () => {
    setIsLibraryOpen(true)
    void refetchLibrary()
  }

  const selectLibraryImage = (image: UploadedImage) => {
    onChange(image.url)
    onUploaded?.({ url: image.url, publicId: image.publicId })
    setIsLibraryOpen(false)
  }

  const handleDeleteLibraryImage = (event: React.MouseEvent, image: UploadedImage) => {
    event.stopPropagation()

    deleteImageMutation.mutate({ publicId: image.publicId, url: image.url })
  }

  return (
    <div className={cn('space-y-3', className)}>
      {label && <Label>{label}</Label>}

      {!value ? (
        <div className='space-y-3'>
          <input
            ref={fileInputRef}
            type='file'
            accept={accept}
            className='hidden'
            onChange={handleFileChange}
            disabled={disabled || isUploading}
          />

          <div
            role='button'
            tabIndex={disabled ? -1 : 0}
            onKeyDown={handleKeyDown}
            onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(event) => {
              event.preventDefault()
              if (!disabled && !isUploading) {
                setIsDragOver(true)
              }
            }}
            onDragLeave={() => setIsDragOver(false)}
            className={cn(
              'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-6 text-center transition-colors',
              isDragOver && 'border-primary bg-primary/5',
              (disabled || isUploading) && 'cursor-not-allowed opacity-60'
            )}
          >
            <MdImage className='text-muted-foreground h-7 w-7' />
            <p className='text-sm font-medium'>Kéo thả ảnh vào đây hoặc bấm để chọn file</p>
            <p className='text-muted-foreground text-xs'>{resolvedHelperText}</p>

            <Button
              type='button'
              variant='secondary'
              disabled={disabled || isUploading}
              className='mt-1'
              onClick={(event) => {
                event.stopPropagation()
                fileInputRef.current?.click()
              }}
            >
              <MdUpload className='mr-2 h-4 w-4' />
              {isUploading ? 'Đang tải lên...' : 'Chọn ảnh'}
            </Button>

            <Button
              type='button'
              variant='outline'
              disabled={disabled || isUploading}
              onClick={(event) => {
                event.stopPropagation()
                openLibrary()
              }}
            >
              <MdPhotoLibrary className='mr-2 h-4 w-4' />
              Chọn từ thư viện
            </Button>
          </div>

          {localPreviewUrl && (
            <div className='relative mx-auto w-full max-w-sm overflow-hidden rounded-lg border'>
              <Image
                src={localPreviewUrl}
                alt='Uploading preview'
                width={300}
                height={200}
                className='w-full object-cover'
              />
              {isUploading && (
                <div className='bg-background/70 absolute inset-0 flex items-center justify-center'>
                  <span className='rounded-md bg-black/80 px-3 py-1 text-sm text-white'>Đang upload ảnh...</span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className='space-y-3'>
          <div className='relative mx-auto w-full max-w-sm'>
            <Image
              src={value}
              alt='Uploaded image'
              width={300}
              height={200}
              className='w-full rounded-lg border object-cover'
            />
            <Button
              type='button'
              variant='destructive'
              size='icon'
              onClick={() => onChange('')}
              disabled={disabled || isUploading}
              className='absolute top-2 right-2 h-6 w-6 rounded-full'
            >
              <X className='h-4 w-4' />
            </Button>
          </div>

          <div className='flex justify-center'>
            <div className='flex gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isUploading}
              >
                Đổi ảnh khác
              </Button>
              <Button type='button' variant='outline' disabled={disabled || isUploading} onClick={openLibrary}>
                <MdPhotoLibrary className='mr-2 h-4 w-4' />
                Chọn từ thư viện
              </Button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type='file'
            accept={accept}
            className='hidden'
            onChange={handleFileChange}
            disabled={disabled || isUploading}
          />
        </div>
      )}

      {!value && (
        <p className='text-muted-foreground text-xs'>
          Hệ thống sẽ tải ảnh lên server và trả về URL để lưu vào dữ liệu.
        </p>
      )}

      <Dialog open={isLibraryOpen} onOpenChange={setIsLibraryOpen}>
        <DialogContent className='max-h-[90vh] max-w-3xl overflow-hidden'>
          <DialogHeader>
            <DialogTitle>Thư viện ảnh đã upload</DialogTitle>
            <DialogDescription>Chọn một ảnh đã có sẵn để sử dụng lại.</DialogDescription>
          </DialogHeader>

          <div className='space-y-4 overflow-auto pr-1'>
            {isLibraryLoading ? (
              <p className='text-muted-foreground text-sm'>Đang tải thư viện ảnh...</p>
            ) : libraryImages.length === 0 ? (
              <p className='text-muted-foreground text-sm'>Chưa có ảnh nào trong thư viện.</p>
            ) : (
              <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4'>
                {libraryImages.map((image) => (
                  <div key={image.publicId} className='group relative'>
                    <button
                      type='button'
                      onClick={() => selectLibraryImage(image)}
                      className='hover:border-primary relative w-full overflow-hidden rounded-md border text-left transition'
                    >
                      <Image
                        src={image.url}
                        alt={image.publicId}
                        width={220}
                        height={140}
                        className='h-28 w-full object-cover'
                      />
                      <div className='bg-background/95 p-2'>
                        <p className='truncate text-xs'>{image.publicId}</p>
                      </div>
                    </button>

                    <Button
                      type='button'
                      size='icon'
                      variant='destructive'
                      className='absolute top-2 right-2 h-6 w-6 rounded-full opacity-100 transition group-hover:opacity-100 sm:opacity-0'
                      onClick={(event) => handleDeleteLibraryImage(event, image)}
                      disabled={deleteImageMutation.isPending}
                    >
                      <X className='h-4 w-4' />
                    </Button>

                    {deleteImageMutation.isPending && deleteImageMutation.variables?.publicId === image.publicId && (
                      <div className='bg-background/70 absolute inset-0 flex items-center justify-center rounded-md'>
                        <span className='rounded bg-black/80 px-2 py-1 text-xs text-white'>Đang xóa...</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {hasNextPage && (
              <div className='flex justify-center'>
                <Button
                  type='button'
                  variant='outline'
                  disabled={isFetchingNextPage}
                  onClick={() => void fetchNextPage()}
                >
                  {isFetchingNextPage ? 'Đang tải...' : 'Tải thêm ảnh'}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
