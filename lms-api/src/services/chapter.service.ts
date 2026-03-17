import mongoose from 'mongoose'
import { Chapter, Course, type IChapter } from '../models'
import { ValidationError, NotFoundError, ConflictError, ErrorCodes } from '../utils/errors'
import type { CreateChapterInput, UpdateChapterInput, GetChaptersQuery, ReorderChaptersInput } from '../schemas'

export interface PopulatedChapter {
  _id: string
  title: string
  description?: string
  courseId: string
  lessonIds: string[]
  order: number
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
  course: {
    _id: string
    title: string
    slug: string
    description: string
    isPublished: boolean
  }
  lessons: Array<{
    _id: string
    title: string
    contentType: string
    order: number
    preview: boolean
    isPublished: boolean
    duration?: number
  }>
}

export class ChapterService {
  /**
   * Tạo chương mới
   */
  static async createChapter(chapterData: CreateChapterInput): Promise<IChapter> {
    // Kiểm tra khóa học có tồn tại
    const courseExists = await Course.exists({ _id: chapterData.courseId })
    if (!courseExists) {
      throw new NotFoundError('Không tìm thấy khóa học', ErrorCodes.COURSE_NOT_FOUND)
    }

    // Lấy số thứ tự lớn nhất của khóa học này và tăng thêm 1
    const lastChapter = await Chapter.findOne({ courseId: chapterData.courseId }).sort({ order: -1 })
    const nextOrder = lastChapter ? lastChapter.order + 1 : 1

    const chapter = await Chapter.create({
      title: chapterData.title,
      description: chapterData.description,
      courseId: chapterData.courseId,
      order: nextOrder,
      isPublished: chapterData.isPublished ?? false,
      lessonIds: []
    })

    // Thêm ID chương mới vào mảng chapterIds của khóa học
    await Course.updateOne({ _id: chapterData.courseId }, { $push: { chapterIds: chapter._id } })

    return chapter
  }

  /**
   * Lấy danh sách chương theo khóa học, kèm dữ liệu bài học
   */
  static async getChapters(options: GetChaptersQuery): Promise<IChapter[]> {
    const { courseId } = options

    // Kiểm tra khóa học có tồn tại
    const courseExists = await Course.exists({ _id: courseId })
    if (!courseExists) {
      throw new NotFoundError('Không tìm thấy khóa học', ErrorCodes.COURSE_NOT_FOUND)
    }

    // Dùng pipeline aggregate để lấy chương kèm bài học
    const chapters = await Chapter.aggregate([
      {
        $match: { courseId: new mongoose.Types.ObjectId(courseId) }
      },
      {
        $lookup: {
          from: 'lessons',
          localField: 'lessonIds',
          foreignField: '_id',
          as: 'lessons',
          pipeline: [
            {
              $project: {
                title: 1,
                contentType: 1,
                resourceId: 1,
                order: 1,
                preview: 1,
                isPublished: 1,
                duration: 1
              }
            },
            {
              $sort: { order: 1 }
            }
          ]
        }
      },
      {
        $sort: { order: 1 }
      }
    ])

    return chapters
  }

  /**
   * Lấy chương theo ID
   */
  static async getChapterById(chapterId: string): Promise<IChapter> {
    const chapters = await Chapter.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(chapterId) }
      },
      {
        $lookup: {
          from: 'lessons',
          localField: 'lessonIds',
          foreignField: '_id',
          as: 'lessons',
          pipeline: [
            {
              $project: {
                title: 1,
                contentType: 1,
                order: 1,
                preview: 1,
                isPublished: 1,
                duration: 1,
                resourceId: 1
              }
            },
            {
              $sort: { order: 1 }
            }
          ]
        }
      }
    ])

    if (!chapters || chapters.length === 0) {
      throw new NotFoundError('Không tìm thấy chương', ErrorCodes.CHAPTER_NOT_FOUND)
    }

    return chapters[0] as IChapter
  }

  /**
   * Cập nhật chương
   */
  static async updateChapter(chapterId: string, updateData: UpdateChapterInput): Promise<IChapter> {
    const updatedChapter = await Chapter.findByIdAndUpdate(chapterId, updateData, {
      new: true, // Trả về tài liệu sau khi cập nhật
      runValidators: true // Chạy kiểm tra theo schema
    })

    if (!updatedChapter) {
      throw new NotFoundError('Không tìm thấy chương', ErrorCodes.CHAPTER_NOT_FOUND)
    }

    return updatedChapter
  }

  /**
   * Xóa chương
   */
  static async deleteChapter(chapterId: string): Promise<void> {
    const chapter = await Chapter.findById(chapterId)
    if (!chapter) {
      throw new NotFoundError('Không tìm thấy chương', ErrorCodes.CHAPTER_NOT_FOUND)
    }

    // Gỡ chương khỏi mảng chapterIds của khóa học
    await Course.updateOne({ _id: chapter.courseId }, { $pull: { chapterIds: chapterId } })

    await Chapter.findByIdAndDelete(chapterId)
  }

  /**
   * Lấy danh sách chương công khai theo khóa học
   */
  static async getPublicChaptersForCourse(courseId: string): Promise<IChapter[]> {
    // Kiểm tra khóa học có tồn tại
    const courseExists = await Course.exists({ _id: courseId })
    if (!courseExists) {
      throw new NotFoundError('Không tìm thấy khóa học', ErrorCodes.COURSE_NOT_FOUND)
    }

    // Tạo điều kiện lọc - chỉ lấy chương đã xuất bản
    const matchFilter: Record<string, unknown> = {
      courseId: new mongoose.Types.ObjectId(courseId),
      isPublished: true
    }

    // Thực thi pipeline aggregate
    const chapters = await Chapter.aggregate([
      { $match: matchFilter },
      {
        $lookup: {
          from: 'lessons',
          localField: 'lessonIds',
          foreignField: '_id',
          as: 'lessons',
          pipeline: [
            {
              $project: {
                title: 1,
                contentType: 1,
                preview: 1,
                duration: 1,
                order: 1
              }
            },
            { $sort: { order: 1 } }
          ]
        }
      },
      { $sort: { order: 1 } }
    ])

    return chapters as IChapter[]
  }

  /**
   * Sắp xếp lại thứ tự chương trong một khóa học
   */
  static async reorderChapters(reorderData: ReorderChaptersInput): Promise<IChapter[]> {
    const { chapters } = reorderData

    // Lấy danh sách ID chương
    const chapterIds = chapters.map((ch) => ch.id)

    // Kiểm tra tất cả chương có tồn tại và cùng thuộc một khóa học
    const existingChapters = await Chapter.find({ _id: { $in: chapterIds } })

    if (existingChapters.length !== chapterIds.length) {
      throw new NotFoundError('Không tìm thấy một hoặc nhiều chương', ErrorCodes.CHAPTER_NOT_FOUND)
    }

    // Đảm bảo tất cả chương thuộc cùng một khóa học
    const courseIds = [...new Set(existingChapters.map((ch) => ch.courseId.toString()))]
    if (courseIds.length > 1) {
      throw new ValidationError('Tất cả chương phải thuộc cùng một khóa học', ErrorCodes.INVALID_INPUT_FORMAT)
    }

    // Cập nhật thứ tự bằng bulkWrite (không cần transaction cho trường hợp này)
    const bulkOperations = chapters.map(({ id, order }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order } }
      }
    }))

    // Thực thi thao tác bulk write
    await Chapter.bulkWrite(bulkOperations)

    // Trả về danh sách chương đã cập nhật
    const updatedChapters = await Chapter.find({ _id: { $in: chapterIds } }).sort({ order: 1 })

    return updatedChapters
  }

  /**
   * Thêm bài học vào chương
   */
  static async addLessonToChapter(chapterId: string, lessonId: string): Promise<IChapter> {
    const chapter = await Chapter.findById(chapterId)
    if (!chapter) {
      throw new NotFoundError('Không tìm thấy chương', ErrorCodes.CHAPTER_NOT_FOUND)
    }

    // Kiểm tra bài học đã có trong chương chưa
    if (chapter.lessonIds.includes(new mongoose.Types.ObjectId(lessonId))) {
      throw new ConflictError('Bài học đã được thêm vào chương', ErrorCodes.DUPLICATE_ENTRY)
    }

    // Thêm bài học vào chương
    chapter.lessonIds.push(new mongoose.Types.ObjectId(lessonId))
    await chapter.save()

    // Trả về chương kèm danh sách bài học bằng aggregation
    const [updatedChapter] = await Chapter.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(chapterId) }
      },
      {
        $lookup: {
          from: 'lessons',
          localField: 'lessonIds',
          foreignField: '_id',
          as: 'lessons',
          pipeline: [
            {
              $project: {
                title: 1,
                contentType: 1,
                order: 1,
                preview: 1,
                isPublished: 1,
                duration: 1
              }
            },
            { $sort: { order: 1 } }
          ]
        }
      }
    ])

    return updatedChapter as IChapter
  }

  /**
   * Xóa bài học khỏi chương
   */
  static async removeLessonFromChapter(chapterId: string, lessonId: string): Promise<IChapter> {
    const chapter = await Chapter.findById(chapterId)
    if (!chapter) {
      throw new NotFoundError('Không tìm thấy chương', ErrorCodes.CHAPTER_NOT_FOUND)
    }

    // Xóa bài học khỏi chương
    chapter.lessonIds = chapter.lessonIds.filter((lesson) => !lesson.equals(new mongoose.Types.ObjectId(lessonId)))
    await chapter.save()

    // Trả về chương kèm danh sách bài học bằng aggregation
    const [updatedChapter] = await Chapter.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(chapterId) }
      },
      {
        $lookup: {
          from: 'lessons',
          localField: 'lessonIds',
          foreignField: '_id',
          as: 'lessons',
          pipeline: [
            {
              $project: {
                title: 1,
                contentType: 1,
                order: 1,
                preview: 1,
                isPublished: 1,
                duration: 1
              }
            },
            { $sort: { order: 1 } }
          ]
        }
      }
    ])

    return updatedChapter as IChapter
  }
}
