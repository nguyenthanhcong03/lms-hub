'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import slugify from 'slugify'

import Editor from '@/components/tiptap/editor'
import Toolbar from '@/components/tiptap/toolbar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useCreateBlog, useUpdateBlog } from '@/hooks/use-blogs'
import { useAllCategories } from '@/hooks/use-categories'
import { cn } from '@/lib/utils'
import { BlogStatus, IBlog } from '@/types/blog'
import { formatDate } from '@/utils/format'
import { blogSchema, BlogSchema } from '@/validators/blog.validator'
import { Calendar as CalendarIcon } from 'lucide-react'
import { MdAdd, MdEdit } from 'react-icons/md'
import { toast } from 'sonner'
import { ImageUpload } from '@/components/ui/image-upload'

interface BlogsActionDialogProps {
  mode?: 'create' | 'edit'
  blog?: IBlog
  open: boolean
  onOpenChange: (open: boolean) => void
}

const BlogsActionDialog = ({ mode = 'create', blog, open, onOpenChange }: BlogsActionDialogProps) => {
  const createBlogMutation = useCreateBlog()
  const updateBlogMutation = useUpdateBlog()

  // Lấy tất cả danh mục từ API (cho dropdown)
  const { data: categories, isLoading: categoriesLoading } = useAllCategories()

  // Theo dõi xem slug có được chỉnh thủ công hay không
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = React.useState(false)

  const defaultValues = React.useMemo(
    () => ({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      thumbnail: '',
      status: BlogStatus.DRAFT,
      publishedAt: new Date(),
      categoryId: ''
    }),
    []
  )

  const form = useForm<BlogSchema>({
    resolver: yupResolver(blogSchema),
    defaultValues,
    mode: 'onChange'
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    watch,
    setValue
  } = form

  // Theo dõi trường tiêu đề để tự sinh slug
  const titleValue = watch('title')
  const statusValue = watch('status')

  // Tự động tạo slug từ tiêu đề
  React.useEffect(() => {
    if (titleValue && !isSlugManuallyEdited) {
      const generatedSlug = slugify(titleValue, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g
      })
      setValue('slug', generatedSlug, { shouldValidate: true })
    }
  }, [titleValue, isSlugManuallyEdited, setValue])

  // Reset trạng thái chỉnh slug thủ công khi mở hộp thoại
  React.useEffect(() => {
    if (open) {
      setIsSlugManuallyEdited(mode === 'edit' && !!blog?.slug)
    }
  }, [open, mode, blog?.slug])

  React.useEffect(() => {
    if (open && blog) {
      const formDefaults = {
        title: blog?.title || '',
        slug: blog?.slug || '',
        content: blog?.content || '',
        excerpt: blog?.excerpt || '',
        thumbnail: blog?.thumbnail || '',
        status: blog?.status || BlogStatus.DRAFT,
        publishedAt: blog?.publishedAt ? new Date(blog.publishedAt) : new Date(), // Mặc định ngày hiện tại nếu chưa có
        categoryId: blog?.category?._id || blog?.categoryIds?.[0] || '' // Ưu tiên cấu trúc mới, fallback về cấu trúc cũ
      }

      reset(formDefaults)
    }
  }, [open, blog, reset])

  const onSubmit = async (data: BlogSchema) => {
    const blogData = {
      ...data,
      publishedAt: data.publishedAt.toISOString(), // Luôn gửi publishedAt vì trường này bắt buộc
      // Chuyển chuỗi rỗng thành undefined cho thumbnail
      thumbnail: data.thumbnail && data.thumbnail !== '' ? data.thumbnail : undefined
    }

    if (mode === 'create') {
      await createBlogMutation.mutateAsync(blogData)
      toast.success('Thêm bài viết thành công!')
    } else if (blog) {
      await updateBlogMutation.mutateAsync({
        id: blog._id,
        ...blogData
      })
      toast.success('Cập nhật bài viết thành công!')
    }

    onOpenChange(false)
  }

  const handleCategoryChange = (categoryId: string) => {
    setValue('categoryId', categoryId, { shouldValidate: true })
  }

  const title = mode === 'create' ? 'Tạo bài viết' : 'Chỉnh sửa bài viết'
  const description =
    mode === 'create' ? 'Thêm một bài viết mới vào nền tảng.' : 'Cập nhật thông tin và nội dung bài viết.'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex h-[90vh] flex-col p-0 sm:max-w-[1200px]'>
        <DialogHeader className='flex-shrink-0 border-b px-6 pt-6 pb-2'>
          <DialogTitle className='flex items-center gap-2'>
            {mode === 'create' ? <MdAdd className='h-5 w-5' /> : <MdEdit className='h-5 w-5' />}
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className='flex min-h-0 flex-1 flex-col'>
            {/* Khu vực nội dung có thể cuộn */}
            <div className='flex-1 overflow-y-auto px-6 py-4'>
              <div className='space-y-6'>
                {/* Phần thông tin cơ bản */}
                <div className='space-y-4'>
                  <h3 className='border-b pb-2 text-lg font-semibold text-gray-900'>Thông tin cơ bản</h3>

                  <div className='grid grid-cols-1 items-start gap-6 md:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='title'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Tiêu đề <span className='text-red-500'>*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='Tiêu đề bài viết' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='slug'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Đường dẫn tĩnh <span className='text-red-500'>*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder='blog-slug'
                              onChange={(e) => {
                                field.onChange(e)
                                setIsSlugManuallyEdited(true)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='status'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Trạng thái <span className='text-red-500'>*</span>
                          </FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Chọn trạng thái' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={BlogStatus.DRAFT}>Nháp</SelectItem>
                              <SelectItem value={BlogStatus.PUBLISHED}>Đã xuất bản</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Phần danh mục */}
                    <FormField
                      control={form.control}
                      name='categoryId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Danh mục <span className='text-red-500'>*</span>
                          </FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value)
                              handleCategoryChange(value)
                            }}
                          >
                            <FormControl>
                              <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Chọn danh mục' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categoriesLoading ? (
                                <SelectItem value='__loading__' disabled>
                                  Đang tải danh mục...
                                </SelectItem>
                              ) : categories?.length ? (
                                categories.map((category) => (
                                  <SelectItem key={category._id} value={category._id}>
                                    {category.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value='__no_categories__' disabled>
                                  Không có danh mục nào
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Ngày xuất bản - bắt buộc cho cả NHÁP và ĐÃ XUẤT BẢN */}
                  <FormField
                    control={form.control}
                    name='publishedAt'
                    render={({ field }) => (
                      <FormItem className='flex flex-col'>
                        <FormLabel>
                          {statusValue === BlogStatus.PUBLISHED ? 'Ngày xuất bản' : 'Ngày lên lịch xuất bản'}{' '}
                          <span className='text-red-500'>*</span>
                        </FormLabel>
                        <Popover modal={true}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant='outline'
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? formatDate(field.value) : <span>Chọn một ngày</span>}
                                <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-auto p-0'>
                            <Calendar
                              mode='single'
                              selected={field.value || undefined}
                              onSelect={(date) => {
                                if (date) {
                                  // Nếu chọn ngày mới, giữ giờ hiện tại hoặc đặt theo thời điểm hiện tại
                                  const newDate = field.value
                                    ? new Date(
                                        date.getFullYear(),
                                        date.getMonth(),
                                        date.getDate(),
                                        field.value.getHours(),
                                        field.value.getMinutes()
                                      )
                                    : new Date(
                                        date.getFullYear(),
                                        date.getMonth(),
                                        date.getDate(),
                                        new Date().getHours(),
                                        new Date().getMinutes()
                                      )
                                  field.onChange(newDate)
                                } else {
                                  field.onChange(null)
                                }
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <div className='text-muted-foreground text-xs'>
                          {statusValue === BlogStatus.PUBLISHED
                            ? 'Ngày bài viết được xuất bản.'
                            : 'Ngày bài viết sẽ được lên lịch xuất bản.'}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='excerpt'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Trích đoạn <span className='text-red-500'>*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder='Nhập một đoạn trích ngắn gọn về bài viết...'
                            className='min-h-[100px]'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Trường ảnh bìa */}
                <div className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='thumbnail'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ảnh bìa</FormLabel>
                        <FormControl>
                          <ImageUpload
                            value={field.value}
                            onChange={field.onChange}
                            onError={(error) => console.error('Image upload error:', error)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Trường nội dung */}
                <div className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='content'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Nội dung <span className='text-red-500'>*</span>
                        </FormLabel>
                        <FormControl>
                          <div className='overflow-hidden rounded-xs border'>
                            <Toolbar />
                            <Editor
                              content={field.value}
                              onChange={(content) => field.onChange(content)}
                              className='min-h-[400px]'
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Chân trang cố định */}
            <DialogFooter className='flex-shrink-0 border-t px-6 py-4'>
              <Button type='button' variant='outline' onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Hủy
              </Button>
              <Button
                type='submit'
                disabled={isSubmitting || createBlogMutation.isPending || updateBlogMutation.isPending}
              >
                {isSubmitting || createBlogMutation.isPending || updateBlogMutation.isPending
                  ? 'Đang lưu...'
                  : mode === 'create'
                    ? 'Tạo bài viết'
                    : 'Cập nhật'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default BlogsActionDialog
