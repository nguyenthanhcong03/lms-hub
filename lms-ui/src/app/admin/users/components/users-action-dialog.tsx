'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePublicRoles } from '@/hooks/use-roles'
import { useUpdateUser } from '@/hooks/use-users'
import { IRole } from '@/types/role'
import { IUser, UpdateUserRequest } from '@/types/user'
import { yupResolver } from '@hookform/resolvers/yup'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { MdEdit } from 'react-icons/md'
import { toast } from 'sonner'
import * as yup from 'yup'

// Schema validation rút gọn chỉ cho trạng thái và vai trò
const userValidationSchema = yup.object().shape({
  status: yup
    .string()
    .oneOf(['active', 'inactive', 'banned'], 'Vui lòng chọn trạng thái hợp lệ')
    .required('Trạng thái là bắt buộc'),
  roles: yup.array().of(yup.string().required()).default([])
})

type UserFormData = yup.InferType<typeof userValidationSchema>

interface UserActionDialogProps {
  user: IUser
  open: boolean
  onOpenChange: (open: boolean) => void
}

const UsersActionDialog = ({ user, open, onOpenChange }: UserActionDialogProps) => {
  // Hook gọi API
  const updateUserMutation = useUpdateUser()
  const { data: rolesResponse } = usePublicRoles()
  const roles = rolesResponse || []
  const isLoading = updateUserMutation.isPending

  // Khởi tạo form
  const form = useForm<UserFormData>({
    resolver: yupResolver(userValidationSchema),
    mode: 'onChange',
    defaultValues: {
      status: user?.status || 'active',
      roles: user?.roles?.map((role) => role._id) || []
    }
  })

  // Reset form khi dialog mở/đóng hoặc khi user thay đổi
  React.useEffect(() => {
    if (open && user) {
      form.reset({
        status: user.status,
        roles: user.roles.map((role) => role._id)
      })
    }
  }, [open, user, form])

  const onSubmit = async (data: UserFormData) => {
    const updateData: UpdateUserRequest = {
      id: user._id,
      status: data.status,
      roles: data.roles
    }

    updateUserMutation.mutate(updateData, {
      onSuccess: () => {
        toast.success('Cập nhật trạng thái người dùng thành công')
        onOpenChange(false)
        form.reset()
      }
    })
  }

  const title = 'Cập nhật trạng thái người dùng'
  const description = 'Cập nhật trạng thái và phân quyền vai trò cho người dùng.'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <MdEdit className='h-5 w-5' />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Hiển thị thông tin người dùng */}
            <div className='bg-muted/50 space-y-2 rounded-lg p-4'>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <span className='font-medium'>Tên đăng nhập:</span> {user.username}
                </div>
                <div>
                  <span className='font-medium'>Email:</span> {user.email}
                </div>
                <div>
                  <span className='font-medium'>Loại người dùng:</span> {user.userType}
                </div>
                <div>
                  <span className='font-medium'>Trạng thái hiện tại:</span>{' '}
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : user.status === 'inactive'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.status === 'active'
                      ? 'Đang hoạt động'
                      : user.status === 'inactive'
                        ? 'Ngưng hoạt động'
                        : 'Bị khóa'}
                  </span>
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cập nhật trạng thái *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full' disabled={isLoading}>
                        <SelectValue placeholder='Chọn trạng thái' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='active'>Đang hoạt động</SelectItem>
                      <SelectItem value='inactive'>Ngưng hoạt động</SelectItem>
                      <SelectItem value='banned'>Bị khóa</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='roles'
              render={() => (
                <FormItem>
                  <FormLabel>Cập nhật vai trò</FormLabel>
                  <div className='grid max-h-32 grid-cols-2 gap-2 overflow-y-auto'>
                    {roles.map((role: IRole) => (
                      <FormField
                        key={role._id}
                        control={form.control}
                        name='roles'
                        render={({ field }) => {
                          return (
                            <FormItem key={role._id} className='flex flex-row items-start space-y-0 space-x-3'>
                              <FormControl>
                                <Checkbox
                                  checked={field.value.includes(role._id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, role._id])
                                      : field.onChange(field.value.filter((value) => value !== role._id))
                                  }}
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormLabel className='text-sm font-normal'>{role.name}</FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type='button' variant='outline' onClick={() => onOpenChange(false)} disabled={isLoading}>
                Hủy
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading ? 'Đang cập nhật...' : 'Cập nhật người dùng'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default UsersActionDialog
