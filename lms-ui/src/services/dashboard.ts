import { ApiService } from '@/lib/api-service'
import type { DashboardStatsResponse, OverviewStatsResponse, RecentSalesResponse } from '@/types/dashboard'

// Endpoint API cho bảng điều khiển
const ENDPOINTS = {
  STATS: '/stats/dashboard',
  OVERVIEW: '/stats/overview',
  RECENT_SALES: '/stats/recent-sales'
} as const

// Service bảng điều khiển
export class DashboardService {
  // Lấy thống kê bảng điều khiển
  static async getDashboardStats(): Promise<DashboardStatsResponse> {
    try {
      return await ApiService.get<DashboardStatsResponse>(ENDPOINTS.STATS)
    } catch (error) {
      console.error('Không thể tải thống kê bảng điều khiển:', error)
      // Trả về dữ liệu dự phòng nếu API lỗi
      return {
        totalUsers: {
          count: 0,
          changeFromLastMonth: 0,
          changePercentage: 0
        },
        activeCourses: {
          count: 0,
          changeFromLastMonth: 0,
          changePercentage: 0
        },
        userRoles: {
          count: 0,
          changeFromLastMonth: 0,
          changePercentage: 0
        },
        totalRevenue: {
          count: 0,
          changeFromLastMonth: 0,
          changePercentage: 0
        }
      }
    }
  }

  // Lấy thống kê tổng quan (dữ liệu doanh thu theo tháng)
  static async getOverviewStats(): Promise<OverviewStatsResponse> {
    try {
      return await ApiService.get<OverviewStatsResponse>(ENDPOINTS.OVERVIEW)
    } catch (error) {
      console.error('Không thể tải thống kê tổng quan:', error)
      // Trả về dữ liệu dự phòng nếu API lỗi
      const currentYear = new Date().getFullYear()
      const months = [
        'Thg 1',
        'Thg 2',
        'Thg 3',
        'Thg 4',
        'Thg 5',
        'Thg 6',
        'Thg 7',
        'Thg 8',
        'Thg 9',
        'Thg 10',
        'Thg 11',
        'Thg 12'
      ]

      return months.map((monthName, index) => ({
        year: currentYear,
        month: index + 1,
        monthName,
        totalRevenue: 0,
        salesCount: 0
      }))
    }
  }

  // Lấy dữ liệu bán hàng gần đây
  static async getRecentSales(): Promise<RecentSalesResponse> {
    try {
      return await ApiService.get<RecentSalesResponse>(ENDPOINTS.RECENT_SALES)
    } catch (error) {
      console.error('Không thể tải dữ liệu bán hàng gần đây:', error)
      // Trả về dữ liệu dự phòng nếu API lỗi
      return {
        success: false,
        message: 'Không thể tải dữ liệu bán hàng gần đây',
        statusCode: 500,
        recentSales: [],
        currentMonthSummary: {
          salesCount: 0,
          totalRevenue: 0
        }
      }
    }
  }
}

// Export mặc định để đồng nhất với các service khác
export default DashboardService
