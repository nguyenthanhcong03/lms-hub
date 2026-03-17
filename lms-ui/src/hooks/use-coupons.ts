'use client'

import CouponService from '@/services/coupons'
import type {
  CouponsListParams,
  CreateCouponRequest,
  GetActiveCouponsRequest,
  UpdateCouponRequest,
  ValidateCouponRequest
} from '@/types/coupon'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// Khóa truy vấn cho coupons
export const couponKeys = {
  all: ['coupons'] as const,
  lists: () => [...couponKeys.all, 'list'] as const,
  list: (filters: CouponsListParams) => [...couponKeys.lists(), filters] as const,
  details: () => [...couponKeys.all, 'detail'] as const,
  detail: (id: string) => [...couponKeys.details(), id] as const,
  active: (params?: GetActiveCouponsRequest) => [...couponKeys.all, 'active', params] as const
} as const

// Admin hooks for coupons CRUD

// Hook để get all coupons (admin)
export function useCoupons(params?: CouponsListParams) {
  return useQuery({
    queryKey: couponKeys.list(params || {}),
    queryFn: () => CouponService.getCoupons(params),
    placeholderData: keepPreviousData
  })
}

// Hook để get single coupon (admin)
export function useCoupon(id: string) {
  return useQuery({
    queryKey: couponKeys.detail(id),
    queryFn: () => CouponService.getCoupon(id),
    enabled: !!id
  })
}

// Hook để create coupon (admin)
export function useCreateCoupon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (couponData: CreateCouponRequest) => CouponService.createCoupon(couponData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() })
    },
    onError: (error) => {
      toast.error(error?.message || 'Không tạo được mã giảm giá')
    }
  })
}

// Hook để update coupon (admin)
export function useUpdateCoupon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (couponData: UpdateCouponRequest) => CouponService.updateCoupon(couponData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: couponKeys.detail(variables.id)
      })
    },
    onError: (error) => {
      toast.error(error?.message || 'Không cập nhật được mã giảm giá')
    }
  })
}

// Hook để delete coupon (admin)
export function useDeleteCoupon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => CouponService.deleteCoupon(id),
    onSuccess: () => {
      toast.success('Mã giảm giá đã được xóa thành công!')
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() })
    },
    onError: (error) => {
      toast.error(error?.message || 'Không xóa được mã giảm giá')
    }
  })
}

// Hook để bulk delete coupons (admin)
export function useBulkDeleteCoupons() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) => CouponService.deleteCoupons(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() })
    },
    onError: (error) => {
      toast.error(error?.message || 'Không xóa được các mã giảm giá')
    }
  })
}

// Public hooks

// Hook để get active coupons (public)
export function useActiveCoupons(params?: GetActiveCouponsRequest) {
  return useQuery({
    queryKey: couponKeys.active(params),
    queryFn: () => CouponService.getActiveCoupons(params)
  })
}

// Hook để validate coupon (public)
export function useValidateCoupon() {
  return useMutation({
    mutationFn: (data: ValidateCouponRequest) => CouponService.validateCoupon(data),
    onSuccess: (response) => {
      toast.success(`Mã giảm giá ${response.code} đã được áp dụng thành công!`)
      return response
    },
    onError: (error) => {
      toast.error(error?.message || 'Không xác thực được mã giảm giá')
    }
  })
}
