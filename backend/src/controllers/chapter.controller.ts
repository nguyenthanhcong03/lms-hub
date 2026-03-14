import { Request, Response } from 'express'
import { OK } from '~/core/success.response'
import ChapterService from '~/services/chapter.service'
const ChapterController = {
  getAllChapters: async (req: Request, res: Response) => {
    const queryParams = req.query

    const result = await ChapterService.getAllChapters(queryParams)

    return new OK({
      message: 'All chapters retrieved successfully',
      data: result
    }).send(res)
  },

  getChapter: async (req: Request, res: Response) => {
    const { id: chapterId } = req.params
    const result = await ChapterService.getChapter(chapterId)
    return new OK({
      message: 'Chapter retrieved successfully',
      data: result
    }).send(res)
  },

  createChapter: async (req: Request, res: Response) => {
    const result = await ChapterService.createChapter(req.body)
    return new OK({
      message: 'Chapter created successfully',
      data: result
    }).send(res)
  },

  updateChapter: async (req: Request, res: Response) => {
    const { id: chapterId } = req.params
    const result = await ChapterService.updateChapter(chapterId, req.body)
    return new OK({
      message: 'Chapter updated successfully',
      data: result
    }).send(res)
  },

  deleteChapter: async (req: Request, res: Response) => {
    const { id: chapterId } = req.params
    const result = await ChapterService.deleteChapter(chapterId)
    return new OK({
      message: 'Chapter deleted successfully',
      data: result
    }).send(res)
  }
}

export default ChapterController
