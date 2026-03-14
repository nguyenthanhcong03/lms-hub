import { Request, Response } from 'express'
import { CREATED, OK } from '~/core/success.response'
import CourseService from '~/services/course.service'

const CourseController = {
  createCourse: async (req: Request, res: Response) => {
    const userId = req.user?._id as string
    const result = await CourseService.createCourse(userId, req.body)

    return new CREATED({
      message: 'Course created successfully',
      data: result
    }).send(res)
  },

  fetchAllCourses: async (req: Request, res: Response) => {
    const queryParams = req.query

    const result = await CourseService.getAllCourses(queryParams)

    return new OK({
      message: 'Courses retrieved successfully',
      data: result
    }).send(res)
  },

  fetchUserCourses: async (req: Request, res: Response) => {
    const userId = req.user?._id as string

    const result = await CourseService.getAllMyCourses(userId)

    return new OK({
      message: 'User courses retrieved successfully',
      data: result
    }).send(res)
  },

  fetchPublicCourses: async (req: Request, res: Response) => {
    const queryParams = req.query

    const result = await CourseService.getAllCoursesPublic(queryParams)

    return new OK({
      message: 'Public courses retrieved successfully',
      data: result
    }).send(res)
  },

  searchCourses: async (req: Request, res: Response) => {
    const queryParams = req.query

    const result = await CourseService.searchCourses(queryParams)

    return new OK({
      message: 'Courses searched successfully',
      data: result
    }).send(res)
  },

  fetchCourseDetails: async (req: Request, res: Response) => {
    const { id: courseId } = req.params

    const result = await CourseService.getDetailsCourse(courseId)

    return new OK({
      message: 'Course details retrieved successfully',
      data: result
    }).send(res)
  },

  fetchCourseBySlug: async (req: Request, res: Response) => {
    const { slug } = req.params

    const result = await CourseService.getCourseBySlug(slug)

    return new OK({
      message: 'Course retrieved by slug successfully',
      data: result
    }).send(res)
  },

  updateCourse: async (req: Request, res: Response) => {
    const { id: courseId } = req.params
    const updateData = req.body

    const result = await CourseService.updateCourse(courseId, updateData)

    return new OK({
      message: 'Course updated successfully',
      data: result
    }).send(res)
  },

  incrementCourseView: async (req: Request, res: Response) => {
    const { slug } = req.params

    const result = await CourseService.updateCourseView(slug)

    return new OK({
      message: 'Course view incremented successfully',
      data: result
    }).send(res)
  },

  deleteCourse: async (req: Request, res: Response) => {
    const { id: courseId } = req.params

    const result = await CourseService.deleteCourse(courseId)

    return new OK({
      message: 'Course deleted successfully',
      data: result
    }).send(res)
  },

  deleteMultipleCourses: async (req: Request, res: Response) => {
    const { ids: courseIds } = req.body

    const result = await CourseService.deleteMultipleCourses(courseIds)

    return new OK({
      message: 'Multiple courses deleted successfully',
      data: result
    }).send(res)
  }
}

export default CourseController
