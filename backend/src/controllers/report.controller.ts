import { Request, Response } from 'express'
import { OK } from '~/core/success.response'
import ReportService from '~/services/report.service'

const ReportController = {
  getReportAllRecords: async (req: Request, res: Response) => {
    const result = await ReportService.getReportAllRecords()
    return new OK({
      message: 'Get  successfully',
      data: result
    }).send(res)
  },
  getRevenueByMonth: async (req: Request, res: Response) => {
    const result = await ReportService.getRevenueByMonth()
    return new OK({
      message: 'Revenue fetched successfully',
      data: result
    }).send(res)
  }
}

export default ReportController
