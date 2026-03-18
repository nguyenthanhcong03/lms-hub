'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import slugify from 'slugify'
import { useImmer } from 'use-immer'

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
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { CourseInfo, CourseLevel, CourseStatus, ICourse } from '@/types/course'

import Editor from '@/components/tiptap/editor'
import Toolbar from '@/components/tiptap/toolbar'
import { ImageUpload } from '@/components/ui/image-upload'
import { useAllCategories } from '@/hooks/use-categories'
import { useCreateCourse, useUpdateCourse } from '@/hooks/use-courses'
import { CourseSchema, courseFormSchema } from '@/validators/course.validator'
import { useEffect, useMemo, useState } from 'react'
import { MdAdd } from 'react-icons/md'
import { NumericFormat } from 'react-number-format'
import { toast } from 'sonner'

export const createEmptyCourseInfo = (): CourseInfo => ({
  requirements: [],
  benefits: [],
  techniques: [],
  documents: [],
  qa: []
})

// Lược giản schema kiểm tra dữ liệu khóa học cho form (không gồm trường info)

interface CoursesActionDialogProps {
  mode?: 'create' | 'edit'
  course?: ICourse
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CoursesActionDialog = ({ mode = 'create', course, open, onOpenChange }: CoursesActionDialogProps) => {
  const createCourseMutation = useCreateCourse()
  const updateCourseMutation = useUpdateCourse()

  // Lấy toàn bộ danh mục từ API (cho dropdown)
  const { data: categories, isLoading: categoriesLoading } = useAllCategories()

  const defaultValues = useMemo(
    () => ({
      title: '',
      slug: '',
      excerpt: '',
      description: '',
      image: '',
      introUrl: '',
      price: 0,
      oldPrice: 0,
      isFree: false,
      status: CourseStatus.DRAFT,
      categoryId: '',
      level: CourseLevel.BEGINNER
    }),
    []
  )

  // Tách state cho thông tin khóa học bằng useImmer
  const [courseInfo, setCourseInfo] = useImmer<CourseInfo>(() => course?.info || createEmptyCourseInfo())

  // Theo dõi trạng thái slug có bị sửa tay hay không
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)

  const form = useForm<CourseSchema>({
    resolver: yupResolver(courseFormSchema),
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
  const isFreeValue = watch('isFree')

  // Tự động tạo slug từ tiêu đề
  useEffect(() => {
    if (titleValue && !isSlugManuallyEdited) {
      const generatedSlug = slugify(titleValue, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g
      })
      setValue('slug', generatedSlug, { shouldValidate: true })
    }
  }, [titleValue, isSlugManuallyEdited, setValue])

  // Xử lý bật/tắt khóa học miễn phí - đặt lại giá khi đánh dấu miễn phí
  useEffect(() => {
    if (isFreeValue) {
      setValue('price', 0, { shouldValidate: true })
      setValue('oldPrice', 0, { shouldValidate: true })
    }
  }, [isFreeValue, setValue])

  // Đặt lại trạng thái sửa tay slug khi mở hộp thoại
  useEffect(() => {
    if (open) {
      setIsSlugManuallyEdited(mode === 'edit' && !!course?.slug)
    }
  }, [open, mode, course?.slug])

  useEffect(() => {
    if (open) {
      const formDefaults = {
        title: course?.title || '',
        slug: course?.slug || '',
        excerpt: course?.excerpt || '',
        description: course?.description || '',
        image: course?.image || '',
        introUrl: course?.introUrl || '',
        price: course?.price || 0,
        oldPrice: course?.oldPrice || 0,
        isFree: course?.isFree || false,
        status: course?.status || CourseStatus.DRAFT,
        categoryId: course?.categoryId || '',
        level: course?.level || CourseLevel.BEGINNER
      }

      reset(formDefaults)
      setCourseInfo(course?.info || createEmptyCourseInfo())
    }
  }, [open, course, reset, setCourseInfo])

  const onSubmit = async (data: CourseSchema) => {
    const courseData = {
      ...data,
      info: courseInfo
    }

    if (mode === 'create') {
      await createCourseMutation.mutateAsync(courseData)
      toast.success('Tạo khóa học thành công!')
    } else if (course) {
      await updateCourseMutation.mutateAsync({
        id: course._id,
        ...courseData
      })
      toast.success('Cập nhật khóa học thành công!')
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex h-[90vh] flex-col p-0 sm:max-w-[900px]'>
        <DialogHeader className='flex-shrink-0 border-b px-6 pt-6 pb-2'>
          <DialogTitle>{mode === 'create' ? 'Tạo khóa học mới' : 'Chỉnh sửa khóa học'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Thêm khóa học mới vào nền tảng.' : 'Cập nhật thông tin và cài đặt khóa học.'}
          </DialogDescription>
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
                            <Input {...field} placeholder='Tiêu đề khóa học' />
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
                            Đường dẫn <span className='text-red-500'>*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder='course-slug'
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
                              <SelectItem value={CourseStatus.DRAFT}>Nháp</SelectItem>
                              <SelectItem value={CourseStatus.PUBLISHED}>Đã xuất bản</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='introUrl'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL video giới thiệu</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='https://example.com/intro-video.mp4' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='grid grid-cols-1 items-start gap-6 md:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='categoryId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Danh mục <span className='text-red-500'>*</span>
                          </FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
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
                                  Khôngh có danh mục
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='level'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Cấp độ <span className='text-red-500'>*</span>
                          </FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Chọn cấp độ' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(CourseLevel).map((level) => (
                                <SelectItem key={level} value={level}>
                                  {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Trường tóm tắt */}
                  <FormField
                    control={form.control}
                    name='excerpt'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Tóm tắt{' '}
                          <span className='text-xs font-normal text-gray-500'>(Tóm tắt ngắn, tối đa 300 ký tự)</span>
                        </FormLabel>
                        <FormControl>
                          <textarea
                            {...field}
                            placeholder='Tóm tắt ngắn về khóa học...'
                            className='min-h-[80px] w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-sm'
                            maxLength={300}
                          />
                        </FormControl>
                        <div className='flex items-center justify-between'>
                          <FormMessage />
                          <span className='text-xs text-gray-500'>{field.value?.length || 0}/300</span>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Trường hình ảnh */}
                <div className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='image'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hình ảnh</FormLabel>
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

                {/* Trường mô tả */}
                <div className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả</FormLabel>
                        <FormControl>
                          <div className='overflow-hidden rounded-md border'>
                            <Toolbar />
                            <Editor
                              content={field.value}
                              onChange={(content) => field.onChange(content)}
                              className='min-h-[200px]'
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Phần học phí */}
                <div className='space-y-4'>
                  <div className='flex items-center justify-between border-b pb-2'>
                    <h3 className='text-lg font-semibold text-gray-900'>Học Phí</h3>
                    <div className='flex items-center space-x-6'>
                      <FormField
                        control={form.control}
                        name='isFree'
                        render={({ field }) => (
                          <FormItem className='m-0 flex items-center space-x-2'>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className='m-0 text-sm font-medium'>Khóa học miễn phí</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-1 items-start gap-6 md:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='price'
                      render={({ field: { onChange, onBlur, name, value, ref } }) => (
                        <FormItem>
                          <FormLabel>
                            Price {!form.watch('isFree') && <span className='text-red-500'>*</span>}
                          </FormLabel>
                          <FormControl>
                            <NumericFormat
                              name={name}
                              value={value}
                              onBlur={onBlur}
                              getInputRef={ref}
                              customInput={Input}
                              thousandSeparator=','
                              decimalSeparator='.'
                              suffix=' đ'
                              allowNegative={false}
                              placeholder='0 đ'
                              disabled={form.watch('isFree')}
                              onValueChange={(values) => onChange(values.floatValue)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='oldPrice'
                      render={({ field: { onChange, onBlur, name, value, ref } }) => (
                        <FormItem>
                          <FormLabel>Giá gốc </FormLabel>
                          <FormControl>
                            <NumericFormat
                              name={name}
                              value={value}
                              onBlur={onBlur}
                              getInputRef={ref}
                              customInput={Input}
                              thousandSeparator=','
                              decimalSeparator='.'
                              suffix=' đ'
                              allowNegative={false}
                              placeholder='0 đ'
                              disabled={form.watch('isFree')}
                              onValueChange={(values) => onChange(values.floatValue)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                {/* Phần chi tiết khóa học */}
                <div className='space-y-4'>
                  <h3 className='border-b pb-2 text-lg font-semibold text-gray-900'>Chi tiết khóa học</h3>
                  {/* Yêu cầu và lợi ích */}
                  <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                    {/* Yêu cầu */}
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between'>
                        <Label className='text-sm font-medium text-gray-700'>Yêu cầu</Label>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          className='h-8 w-8 border-dashed p-0 hover:border-solid'
                          onClick={() =>
                            setCourseInfo((draft) => {
                              draft.requirements.push('')
                            })
                          }
                        >
                          <MdAdd className='h-4 w-4' />
                        </Button>
                      </div>
                      <div className='space-y-2'>
                        {courseInfo.requirements.map((requirement, index) => (
                          <div key={index} className='flex w-full gap-2'>
                            <Input
                              value={requirement}
                              onChange={(e) =>
                                setCourseInfo((draft) => {
                                  draft.requirements[index] = e.target.value
                                })
                              }
                              placeholder={`Yêu cầu ${index + 1}`}
                              className='text-sm'
                            />
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              className='h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700'
                              onClick={() =>
                                setCourseInfo((draft) => {
                                  draft.requirements.splice(index, 1)
                                })
                              }
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                        {courseInfo.requirements.length === 0 && (
                          <p className='py-4 text-center text-sm text-gray-500 italic'>Chưa có yêu cầu nào</p>
                        )}
                      </div>
                    </div>

                    {/* Lợi ích */}
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between'>
                        <Label className='text-sm font-medium text-gray-700'>Lợi ích</Label>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          className='h-8 w-8 border-dashed p-0 hover:border-solid'
                          onClick={() =>
                            setCourseInfo((draft) => {
                              draft.benefits.push('')
                            })
                          }
                        >
                          <MdAdd className='h-4 w-4' />
                        </Button>
                      </div>
                      <div className='space-y-2'>
                        {courseInfo.benefits.map((benefit, index) => (
                          <div key={index} className='flex gap-2'>
                            <Input
                              value={benefit}
                              onChange={(e) =>
                                setCourseInfo((draft) => {
                                  draft.benefits[index] = e.target.value
                                })
                              }
                              placeholder={`Lợi ích ${index + 1}`}
                              className='flex-1 text-sm'
                            />
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              className='h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700'
                              onClick={() =>
                                setCourseInfo((draft) => {
                                  draft.benefits.splice(index, 1)
                                })
                              }
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                        {courseInfo.benefits.length === 0 && (
                          <p className='py-4 text-center text-sm text-gray-500 italic'>Chưa có lợi ích nào</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Kỹ thuật và tài liệu */}
                  <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                    {/* Kỹ thuật */}
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between'>
                        <Label className='text-sm font-medium text-gray-700'>Kỹ thuật</Label>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          className='h-8 w-8 border-dashed p-0 hover:border-solid'
                          onClick={() =>
                            setCourseInfo((draft) => {
                              draft.techniques.push('')
                            })
                          }
                        >
                          <MdAdd className='h-4 w-4' />
                        </Button>
                      </div>
                      <div className='space-y-2'>
                        {courseInfo.techniques.map((technique, index) => (
                          <div key={index} className='flex gap-2'>
                            <Input
                              value={technique}
                              onChange={(e) =>
                                setCourseInfo((draft) => {
                                  draft.techniques[index] = e.target.value
                                })
                              }
                              placeholder={`Kỹ thuật ${index + 1}`}
                              className='flex-1 text-sm'
                            />
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              className='h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700'
                              onClick={() =>
                                setCourseInfo((draft) => {
                                  draft.techniques.splice(index, 1)
                                })
                              }
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                        {courseInfo.techniques.length === 0 && (
                          <p className='py-4 text-center text-sm text-gray-500 italic'>Chưa có kỹ thuật nào</p>
                        )}
                      </div>
                    </div>

                    {/* Tài liệu */}
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between'>
                        <Label className='text-sm font-medium text-gray-700'>Tài liệu</Label>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          className='h-8 w-8 border-dashed p-0 hover:border-solid'
                          onClick={() =>
                            setCourseInfo((draft) => {
                              draft.documents.push('')
                            })
                          }
                        >
                          <MdAdd className='h-4 w-4' />
                        </Button>
                      </div>
                      <div className='space-y-2'>
                        {courseInfo.documents.map((document, index) => (
                          <div key={index} className='flex gap-2'>
                            <Input
                              value={document}
                              onChange={(e) =>
                                setCourseInfo((draft) => {
                                  draft.documents[index] = e.target.value
                                })
                              }
                              placeholder={`Tài liệu ${index + 1}`}
                              className='flex-1 text-sm'
                            />
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              className='h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700'
                              onClick={() =>
                                setCourseInfo((draft) => {
                                  draft.documents.splice(index, 1)
                                })
                              }
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                        {courseInfo.documents.length === 0 && (
                          <p className='py-4 text-center text-sm text-gray-500 italic'>Chưa có tài liệu nào</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phần hỏi đáp */}
                <div className='space-y-4'>
                  <div className='flex items-center justify-end'>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      className='h-9 border-dashed px-3 hover:border-solid'
                      onClick={() =>
                        setCourseInfo((draft) => {
                          draft.qa.push({ question: '', answer: '' })
                        })
                      }
                    >
                      <MdAdd className='mr-2 h-4 w-4' />
                      Thêm Q&A
                    </Button>
                  </div>

                  <div className='space-y-3'>
                    {courseInfo.qa.map((qaItem, index) => (
                      <div key={index} className='space-y-3 rounded-lg border bg-gray-50/50 p-4'>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm font-medium text-gray-600'>Hỏi & Đáp #{index + 1}</span>
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            className='h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700'
                            onClick={() =>
                              setCourseInfo((draft) => {
                                draft.qa.splice(index, 1)
                              })
                            }
                          >
                            ×
                          </Button>
                        </div>
                        <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                          <div className='space-y-1'>
                            <Label className='text-xs text-gray-500'>Câu hỏi</Label>
                            <Input
                              value={qaItem.question}
                              onChange={(e) =>
                                setCourseInfo((draft) => {
                                  draft.qa[index].question = e.target.value
                                })
                              }
                              placeholder='Nhập câu hỏi'
                              className='text-sm'
                            />
                          </div>
                          <div className='space-y-1'>
                            <Label className='text-xs text-gray-500'>Câu trả lời</Label>
                            <Input
                              value={qaItem.answer}
                              onChange={(e) =>
                                setCourseInfo((draft) => {
                                  draft.qa[index].answer = e.target.value
                                })
                              }
                              placeholder='Nhập câu trả lời'
                              className='text-sm'
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {courseInfo.qa.length === 0 && (
                      <div className='rounded-lg border-2 border-dashed border-gray-200 py-8 text-center'>
                        <p className='text-sm text-gray-500'>Chưa có câu hỏi nào</p>
                        <p className='mt-1 text-xs text-gray-400'>Nhấn &ldquo;Thêm Q&A&rdquo; để bắt đầu</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Chân trang cố định */}
            <DialogFooter className='flex-shrink-0 border-t px-6 py-4'>
              <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button
                type='submit'
                disabled={isSubmitting || createCourseMutation.isPending || updateCourseMutation.isPending}
              >
                {isSubmitting || createCourseMutation.isPending || updateCourseMutation.isPending
                  ? 'Đang lưu...'
                  : mode === 'create'
                    ? 'Tạo khóa học'
                    : 'Cập nhật'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CoursesActionDialog
