import { LessonType, UserRole } from '~/constants/enums'
import { BadRequestError, NotFoundError } from '~/core/error.response'
import ChapterModel from '~/models/chapter.model'
import CourseModel from '~/models/course.model'
import LessonModel from '~/models/lesson.model'
import VideoModel from '~/models/video.model'
import { CreateLessonParams, LessonQueryParams } from '~/types/lesson.type'
import QuizService from './quiz.service'
import UserModel from '~/models/user.model'
import { User } from '~/types/user.type'

const LessonService = {
  createLesson: async (userId: string, lessonData: CreateLessonParams) => {
    const {
      slug,
      order,
      type,
      duration,
      content,
      courseId,
      chapterId,
      video_url,
      title,
      description,
      questions,
      limit,
      passing_grade
    } = lessonData
    let resource = null
    let resourceType = 'Video'

    const findCourse = await CourseModel.findById(courseId)
    if (!findCourse) {
      throw new BadRequestError('Khóa học không tồn tại')
    }

    const findChapter = await ChapterModel.findById(chapterId)
    if (!findChapter) {
      throw new BadRequestError('Chương không tồn tại')
    }

    if (type === LessonType.VIDEO) {
      resource = await VideoModel.create({
        video_url,
        content
      })
      resourceType = 'Video'
    } else if (type === LessonType.QUIZ) {
      resource = await QuizService.createQuiz(userId, {
        title,
        limit,
        duration,
        passing_grade,
        description,
        questions
      })
      resourceType = 'Quiz'
    }
    const newLesson = await LessonModel.create({
      title,
      slug,
      order,
      duration,
      type,
      course: courseId,
      chapter: chapterId,
      resourceType,
      resource: resource ? resource._id : null,
      created_by: userId
    })
    findChapter.lessons.push(newLesson._id)
    await findChapter.save()

    return newLesson
  },
  getLesson: async (user: User, lessonId: string) => {
    const lesson = await LessonModel.findById(lessonId)
      .populate('chapter', 'title')
      .populate('course', 'title slug')
      .populate('resource')

    if (!lesson) {
      throw new NotFoundError('Lesson not found')
    }

    // Admins can access all lessons
    if (user.role === UserRole.ADMIN) return lesson

    const userData = await UserModel.findById(user._id).select('courses')
    if (!userData || !userData.courses?.length) {
      throw new BadRequestError('Bạn không có quyền truy cập vào bài học này')
    }

    const isEnrolled = userData.courses.some(
      (courseId) => courseId.toString() === (lesson.course as any)?._id.toString()
    )

    if (!isEnrolled) {
      throw new BadRequestError('Bạn không có quyền truy cập vào bài học này')
    }

    return lesson
  },

  getLessonByAdmin: async (lessonId: string) => {
    const lesson = await LessonModel.findById(lessonId)
      .populate('chapter', 'title')
      .populate('course', 'title slug')
      .populate({
        path: 'resource',
        populate: {
          path: 'questions',
          model: 'Question'
        }
      })

    return lesson
  },

  getLessonBySlug: async ({ course, slug }: { slug: string; course: string }) => {
    const foundCourse = await CourseModel.findOne({ slug: course })

    if (!foundCourse) {
      throw new BadRequestError('Khóa học không tồn tại')
    }

    const lesson = await LessonModel.findOne({
      slug,
      course: foundCourse._id
    }).populate('chapter', 'title')

    if (!lesson) {
      throw new BadRequestError('Bài học không tồn tại')
    }

    return lesson
  },

  getAllLessons: async (queryParams: LessonQueryParams) => {
    const { course } = queryParams
    const lessons = await LessonModel.find({ course }).select('title video_url content slug')

    return lessons
  },

  updateLesson: async (lessonId: string, updateData: Partial<CreateLessonParams>) => {
    const {
      slug,
      order,
      type,
      duration,
      content,
      courseId,
      chapterId,
      video_url,
      title,
      description,
      questions,
      limit,
      passing_grade
    } = updateData

    const findCourse = await CourseModel.findById(courseId)
    if (!findCourse) {
      throw new BadRequestError('Khóa học không tồn tại')
    }

    const findChapter = await ChapterModel.findById(chapterId)
    if (!findChapter) {
      throw new BadRequestError('Chương không tồn tại')
    }

    const lesson = await LessonModel.findByIdAndUpdate(
      lessonId,
      {
        title,
        slug,
        order,
        duration,
        course: courseId,
        chapter: chapterId
      },
      { new: true, runValidators: true }
    )

    if (!lesson) {
      throw new NotFoundError('Bài học không tồn tại')
    }

    if (type === LessonType.VIDEO) {
      await VideoModel.findByIdAndUpdate(
        lesson.resource,
        {
          video_url,
          content
        },
        { new: true, runValidators: true }
      )
    } else if (type === LessonType.QUIZ) {
      await QuizService.updateQuiz(lesson.resource.toString(), {
        title,
        limit,
        duration,
        passing_grade,
        description,
        questions
      })
    }

    return lesson
  },

  deleteLesson: async (lessonId: string) => {
    const lesson = await LessonModel.findByIdAndDelete(lessonId)

    if (!lesson) {
      throw new NotFoundError('Bài học không tồn tại')
    }

    const findChapter = await ChapterModel.findById(lesson.chapter)
    if (findChapter) {
      findChapter.lessons = findChapter.lessons.filter((id) => id.toString() !== lesson._id.toString())
      await findChapter.save()
    }

    return lesson
  }
}

export default LessonService
