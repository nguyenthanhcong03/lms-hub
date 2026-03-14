import { Request, Response } from 'express'
import { OK } from '~/core/success.response'
import LessonService from '~/services/lesson.service'
import { User } from '~/types/user.type'
const LessonController = {
  createLesson: async (req: Request, res: Response) => {
    const userId = req.user?._id as string
    const result = await LessonService.createLesson(userId, req.body)
    return new OK({
      message: 'Lesson created successfully',
      data: result
    }).send(res)
  },

  getLesson: async (req: Request, res: Response) => {
    const { id: lessonId } = req.params
    const user = req.user as User

    const result = await LessonService.getLesson(user, lessonId)
    return new OK({
      message: 'Lesson retrieved successfully',
      data: result
    }).send(res)
  },

  getLessonByAdmin: async (req: Request, res: Response) => {
    const { id: lessonId } = req.params
    const result = await LessonService.getLessonByAdmin(lessonId)
    return new OK({
      message: 'Lesson retrieved successfully',
      data: result
    }).send(res)
  },

  getLessonBySlug: async (req: Request, res: Response) => {
    const { course, slug } = req.params
    const result = await LessonService.getLessonBySlug({
      course: course as string,
      slug: slug as string
    })
    return new OK({
      message: 'Lesson retrieved successfully',
      data: result
    }).send(res)
  },

  getAllLessons: async (req: Request, res: Response) => {
    const { course } = req.params
    const result = await LessonService.getAllLessons({
      course: course as string
    })
    return new OK({
      message: 'All lessons retrieved successfully',
      data: result
    }).send(res)
  },

  updateLesson: async (req: Request, res: Response) => {
    const { id: lessonId } = req.params
    const result = await LessonService.updateLesson(lessonId, req.body)
    return new OK({
      message: 'Lesson updated successfully',
      data: result
    }).send(res)
  },

  deleteLesson: async (req: Request, res: Response) => {
    const { id: lessonId } = req.params
    const result = await LessonService.deleteLesson(lessonId)
    return new OK({
      message: 'Lesson deleted successfully',
      data: result
    }).send(res)
  }
}

export default LessonController
