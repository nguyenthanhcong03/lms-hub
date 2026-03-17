import { Request, Response } from 'express'
import { SearchService } from '../services/search.service'
import { sendSuccess } from '../utils/success'

/**
 * Controller tìm kiếm
 * Xử lý các yêu cầu tìm kiếm cho khóa học và bài viết
 */
export class SearchController {
  /**
   * Tìm kiếm khóa học và bài viết
   * GET /api/v1/search?q=query
   */
  static async search(req: Request, res: Response): Promise<void> {
    const { q } = req.query

    // Thực hiện tìm kiếm
    const results = await SearchService.search(q as string)

    sendSuccess.ok(res, 'Tìm kiếm hoàn tất thành công', results)
  }
}
