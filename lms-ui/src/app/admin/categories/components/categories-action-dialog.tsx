'use client'

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
import { Switch } from '@/components/ui/switch'
import { yupResolver } from '@hookform/resolvers/yup'
import * as React from 'react'
import { useForm } from 'react-hook-form'

import { useCreateCategory, useUpdateCategory } from '@/hooks/use-categories'
import { ICategory } from '@/types/category'
import { MdAdd, MdEdit } from 'react-icons/md'
import { toast } from 'sonner'
import { categorySchema, CategorySchema } from '@/validators/category.validator'
import { CategoryStatus } from '@/types/category'
import slugify from 'slugify'

interface CategoriesActionDialogProps {
  mode?: 'create' | 'edit'
  category?: ICategory
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CategoriesActionDialog = ({ mode = 'create', category, open, onOpenChange }: CategoriesActionDialogProps) => {
  // Hook gọi API
  const createCategoryMutation = useCreateCategory()
  const updateCategoryMutation = useUpdateCategory()

  const isLoading = createCategoryMutation.isPending || updateCategoryMutation.isPending

  // Khởi tạo form với giá trị mặc định
  const form = useForm<CategorySchema>({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      status: CategoryStatus.ACTIVE
    }
  })

  // Tạo slug từ tên
  const generateSlug = (name: string): string => {
    return slugify(name, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    })
  }

  // Theo dõi trường tên để tự động tạo slug
  const watchName = form.watch('name')
  React.useEffect(() => {
    if (watchName) {
      const slug = generateSlug(watchName)
      form.setValue('slug', slug)
    }
  }, [watchName, mode, form])

  // Đặt lại form khi mở/đóng hộp thoại hoặc khi danh mục thay đổi
  React.useEffect(() => {
    if (open) {
      form.reset({
        name: category?.name || '',
        slug: category?.slug || '',
        status: category?.status ?? CategoryStatus.ACTIVE
      })
    }
  }, [open, category, form])

  const onSubmit = async (data: CategorySchema) => {
    if (mode === 'create') {
      createCategoryMutation.mutate(
        {
          name: data.name,
          slug: data.slug,
          status: data.status
        },
        {
          onSuccess: () => {
            toast.success('Tạo danh mục thành công!')
            onOpenChange(false)
            form.reset()
          }
        }
      )
    } else if (category) {
      updateCategoryMutation.mutate(
        {
          id: category._id,
          name: data.name,
          slug: data.slug,
          status: data.status
        },
        {
          onSuccess: () => {
            toast.success('Cập nhật danh mục thành công!')
            onOpenChange(false)
            form.reset()
          }
        }
      )
    }
  }

  const title = mode === 'create' ? 'Tạo danh mục' : 'Chỉnh sửa danh mục'
  const description = mode === 'create' ? 'Thêm danh mục mới để tổ chức khóa học.' : 'Cập nhật thông tin danh mục.'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            {mode === 'create' ? <MdAdd className='h-5 w-5' /> : <MdEdit className='h-5 w-5' />}
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 items-start gap-4'>
              {/* Tên danh mục */}
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tên danh mục <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='Nhập tên danh mục' {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Đường dẫn tĩnh */}
              <FormField
                control={form.control}
                name='slug'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Slug <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='category-slug' {...field} disabled={isLoading} />
                    </FormControl>
                    <div className='text-muted-foreground mt-1 text-xs'>
                      Phiên bản thân thiện URL của tên (chữ thường, chỉ dùng dấu gạch nối)
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Trạng thái */}
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>Trạng thái</FormLabel>
                      <div className='text-muted-foreground text-sm'>Hiển thị danh mục này cho học viên</div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value === CategoryStatus.ACTIVE}
                        onCheckedChange={(checked) => {
                          field.onChange(checked ? CategoryStatus.ACTIVE : CategoryStatus.INACTIVE)
                        }}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type='button' variant='outline' onClick={() => onOpenChange(false)} disabled={isLoading}>
                Hủy
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading ? 'Đang lưu...' : mode === 'create' ? 'Tạo danh mục' : 'Cập nhật danh mục'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CategoriesActionDialog
