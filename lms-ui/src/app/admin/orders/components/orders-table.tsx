'use client'

import { DataTable, DataTablePagination } from '@/components/table'
import { useAdminOrders } from '@/hooks/use-orders'
import { useDebounce } from '@/hooks/use-debounce'
import { VisibilityState, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { columns } from './orders-columns'
import DataTableToolbar from './data-table-toolbar'
import OrdersBulkDeleteDialog from './orders-bulk-delete-dialog'
import OrderStatusDialog from './order-status-dialog'

import { TABLE_CONSTANTS, PAGINATION_CONSTANTS, SortOrder } from '@/constants'
import { IOrder } from '@/types/order'

// Kiểu trạng thái bộ lọc để tổ chức rõ ràng hơn
interface FilterState {
  search: string
  status: string[]
  paymentMethod: string[]
  sortBy: string
  sortOrder: SortOrder
}

const OrdersTable = () => {
  // Trạng thái cốt lõi của bảng
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null)

  // Trạng thái phân trang
  const [currentPage, setCurrentPage] = useState(PAGINATION_CONSTANTS.DEFAULT_PAGE)
  const [pageSize, setPageSize] = useState(PAGINATION_CONSTANTS.DEFAULT_PAGE_SIZE)

  // Trạng thái bộ lọc - gom nhóm để tối ưu hiệu năng
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: [],
    paymentMethod: [],
    sortBy: TABLE_CONSTANTS.DEFAULT_SORT_BY,
    sortOrder: TABLE_CONSTANTS.DEFAULT_SORT_ORDER
  })

  // Debounce tìm kiếm để tránh gọi API quá nhiều
  const debouncedSearch = useDebounce(filters.search, 300)

  // Ghi nhớ tham số truy vấn
  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: pageSize,
      search: debouncedSearch,
      status: filters.status.length > 0 ? filters.status : undefined,
      paymentMethod: filters.paymentMethod.length > 0 ? filters.paymentMethod : undefined,
      sortBy: filters.sortBy as 'createdAt' | 'updatedAt' | 'totalAmount' | 'code',
      sortOrder: filters.sortOrder
    }),
    [currentPage, pageSize, debouncedSearch, filters]
  )

  // Lấy danh sách đơn hàng
  const { data } = useAdminOrders(queryParams)

  // Cập nhật bộ lọc với quản lý state phù hợp
  const updateFilters = useCallback(
    (newFilters: Partial<FilterState>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }))
      // Đặt lại về trang đầu khi bộ lọc thay đổi
      if (currentPage !== 1) {
        setCurrentPage(1)
      }
    },
    [currentPage]
  )

  // Đặt lại phân trang khi bộ lọc thay đổi
  useEffect(() => {
    setCurrentPage(1)
  }, [filters.status, filters.paymentMethod, debouncedSearch])

  // Chuẩn bị dữ liệu bảng
  const orders = data?.orders ?? []
  const totalCount = data?.pagination?.total ?? 0

  // Xử lý khi bấm trạng thái
  const handleStatusClick = useCallback((order: IOrder) => {
    setSelectedOrder(order)
    setStatusDialogOpen(true)
  }, [])

  // Cấu hình bảng
  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection,
      columnVisibility
    },
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getRowId: (row) => row._id,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    meta: {
      onStatusClick: handleStatusClick
    }
  })

  // Lấy số dòng đã chọn cho thao tác hàng loạt
  const selectedRowCount = Object.keys(rowSelection).length

  // Xử lý xóa hàng loạt
  const handleBulkDelete = useCallback(() => {
    if (selectedRowCount > 0) {
      setBulkDeleteDialogOpen(true)
    }
  }, [selectedRowCount])

  // Xử lý phân trang
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size)
    setCurrentPage(1) // Đặt lại về trang đầu
  }, [])

  // Tính toán thông tin phân trang
  const pagination = useMemo(
    () => ({
      page: currentPage,
      pageSize,
      limit: pageSize,
      total: totalCount,
      pageCount: Math.ceil(totalCount / pageSize),
      totalPages: Math.ceil(totalCount / pageSize)
    }),
    [currentPage, pageSize, totalCount]
  )

  return (
    <div className='space-y-4'>
      {/* Thanh công cụ với bộ lọc và hành động */}
      <DataTableToolbar
        table={table}
        filters={filters}
        onFiltersChange={updateFilters}
        selectedRowCount={selectedRowCount}
        onBulkDelete={handleBulkDelete}
      />

      {/* Bảng dữ liệu chính */}
      <div className='overflow-hidden rounded-xs border'>
        <DataTable table={table} />
      </div>

      {/* Phân trang */}
      <DataTablePagination
        pagination={pagination}
        currentDataLength={orders.length}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* Hộp thoại xóa hàng loạt */}
      {bulkDeleteDialogOpen && (
        <OrdersBulkDeleteDialog
          open={bulkDeleteDialogOpen}
          onOpenChange={setBulkDeleteDialogOpen}
          selectedOrders={Object.keys(rowSelection)}
          onSuccess={() => {
            setRowSelection({})
            // Có thể gọi lại dữ liệu hoặc xử lý thành công tại đây
          }}
        />
      )}

      {/* Hộp thoại cập nhật trạng thái */}
      {statusDialogOpen && selectedOrder && (
        <OrderStatusDialog order={selectedOrder} open={statusDialogOpen} onOpenChange={setStatusDialogOpen} />
      )}
    </div>
  )
}

export default OrdersTable
