'use client'

import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useOverviewStats } from '@/hooks/use-dashboard'
import { Skeleton } from '@/components/ui/skeleton'
import type { OverviewDataItem } from '@/types/dashboard'

// 1. Import động component
const Chart = dynamic(() => import('./dynamic-bar-chart'), {
  // 2. QUAN TRỌNG: Tránh đưa bundle Recharts lớn vào HTML ban đầu
  //    hoặc JavaScript cấp trang từ phía server.
  ssr: false,
  // 3. Tùy chọn: Cung cấp UI dự phòng trong lúc tải chart
  loading: () => (
    <div className='flex h-[350px] animate-pulse items-center justify-center rounded-md bg-gray-50'>
      <p className='text-muted-foreground text-sm'>Đang tải biểu đồ...</p>
    </div>
  )
})

export default function Overview() {
  // Dữ liệu có thể được lấy hiệu quả từ phía server (Server Component)
  const { data: overviewData, isLoading } = useOverviewStats()

  const renderChartContent = () => {
    if (isLoading) {
      return (
        <div className='flex h-[350px] flex-col'>
          <div className='mb-4 flex h-6 items-end justify-between'>
            <Skeleton className='h-3 w-8' />
            <Skeleton className='h-3 w-10' />
            <Skeleton className='h-3 w-8' />
            <Skeleton className='h-3 w-6' />
          </div>
          <div className='mb-4 flex flex-1 items-end justify-between gap-2'>
            {Array.from({ length: 12 }).map((_, i) => {
              const heights = [
                'h-16',
                'h-20',
                'h-24',
                'h-32',
                'h-40',
                'h-48',
                'h-56',
                'h-16',
                'h-12',
                'h-8',
                'h-20',
                'h-28'
              ]
              return <Skeleton key={i} className={`w-6 ${heights[i]} rounded-t`} />
            })}
          </div>
          <div className='flex justify-between'>
            {['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'].map((month) => (
              <Skeleton key={month} className='h-3 w-6' />
            ))}
          </div>
        </div>
      )
    }

    const chartData: OverviewDataItem[] = overviewData || []

    if (chartData.length === 0) {
      return (
        <div className='flex h-[350px] items-center justify-center'>
          <p className='text-muted-foreground text-center'>Không có dữ liệu tổng quan.</p>
        </div>
      )
    }

    // Component Recharts được tải lười
    return <Chart data={chartData} />
  }

  return (
    <Card className='col-span-1 lg:col-span-4'>
      <CardHeader>
        <CardTitle>Tổng quan</CardTitle>
      </CardHeader>
      <CardContent className='ps-2'>{renderChartContent()}</CardContent>
    </Card>
  )
}
