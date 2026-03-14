import { FilterQuery } from 'mongoose'
import { BadRequestError } from '~/core/error.response'
import ChapterModel from '~/models/chapter.model'
import CourseModel from '~/models/course.model'
import LessonModel from '~/models/lesson.model'
import { ChapterQueryParams, CreateChapterParams } from '~/types/chapter.type'

const ChapterService = {
  getAllChapters: async (queryParams: ChapterQueryParams) => {
    const limit = +(queryParams?.limit ?? 10)
    const search = queryParams?.search || ''
    const page = +(queryParams?.page ?? 1)

    const query: FilterQuery<typeof ChapterModel> = {
      course: queryParams?.courseId
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' }
    }

    const skip = (page - 1) * limit

    if (page === -1 && limit === -1) {
      const chapters = await ChapterModel.find(query).sort({ order: 1 }).populate('course').populate({
        path: 'lessons',
        select: 'title slug duration course chapter type'
      })

      return { chapters, pagination: { page: 1, total_pages: 1, total_count: chapters.length || 0 } }
    }

    const [chapters, total_count] = await Promise.all([
      ChapterModel.find(query).skip(skip).limit(limit).sort({ order: 1 }).populate('course').populate({
        path: 'lessons',
        select: 'title'
      }),
      ChapterModel.countDocuments(query)
    ])
    const total_pages = Math.ceil(total_count / limit)
    return { chapters, pagination: { page, per_page: limit, total_pages, total_count } }
  },

  getChapter: async (chapterId: string) => {
    const chapter = await ChapterModel.findById(chapterId).select('title order')

    return chapter
  },

  createChapter: async (chapterData: CreateChapterParams) => {
    const findCourse = await CourseModel.findById(chapterData.course)

    if (!findCourse) {
      throw new BadRequestError('Khóa học không tồn tại')
    }

    const newChapter = await ChapterModel.create(chapterData)

    findCourse.chapters.push(newChapter._id)

    findCourse.save()

    return newChapter
  },

  updateChapter: async (chapterId: string, updateData: Partial<CreateChapterParams>) => {
    const chapter = await ChapterModel.findByIdAndUpdate(chapterId, updateData, { new: true, runValidators: true })

    if (!chapter) {
      throw new BadRequestError('Chương không tồn tại')
    }

    return chapter
  },

  deleteChapter: async (chapterId: string) => {
    const chapter = await ChapterModel.findByIdAndDelete(chapterId)

    if (!chapter) {
      throw new BadRequestError('Chương không tồn tại')
    }

    // find course and remove chapter from it
    const course = await CourseModel.findById(chapter.course)
    if (!course) {
      throw new BadRequestError('Khóa học không tồn tại')
    }

    course.chapters = course.chapters.filter((chapter) => chapter.toString() !== chapterId)
    await course.save()

    // delete all lessons in this chapter
    await LessonModel.deleteMany({ chapter: chapterId })

    return chapter
  }
}

export default ChapterService
