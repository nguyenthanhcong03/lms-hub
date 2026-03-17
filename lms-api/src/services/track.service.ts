import { Track, ITrack } from '../models/track'
import { User } from '../models/user'
import { Course } from '../models/course'
import { Lesson } from '../models/lesson'
import { AppError } from '../utils/errors'
import { CreateTrackInput, GetTrackQuery, GetCourseTrackQuery, GetUserTrackQuery } from '../schemas/track.schema'

/**
 * Dịch vụ quản lý theo dõi tiến độ
 * Các thao tác tạo, đọc, cập nhật, xóa cho việc theo dõi bài học
 */

export class TrackService {
  /**
   * Bật/tắt bản ghi theo dõi - chưa có thì tạo, có rồi thì xóa
   */
  static async toggleTrack(trackData: CreateTrackInput, userId: string): Promise<ITrack | null> {
    // Kiểm tra người dùng có tồn tại
    const user = await User.findById(userId)
    if (!user) {
      throw new AppError('Không tìm thấy người dùng', 404)
    }

    // Kiểm tra khóa học có tồn tại
    const course = await Course.findById(trackData.courseId)
    if (!course) {
      throw new AppError('Không tìm thấy khóa học', 404)
    }

    // Kiểm tra bài học tồn tại và thuộc khóa học này
    const lesson = await Lesson.findOne({
      _id: trackData.lessonId,
      courseId: trackData.courseId
    })
    if (!lesson) {
      throw new AppError('Không tìm thấy bài học hoặc bài học không thuộc khóa học này', 404)
    }

    // Kiểm tra bản ghi theo dõi đã tồn tại chưa
    const existingTrack = await Track.findOne({
      userId,
      courseId: trackData.courseId,
      lessonId: trackData.lessonId
    })

    if (existingTrack) {
      // Đã có bản ghi thì xóa
      await Track.findByIdAndDelete(existingTrack._id)
      return null
    } else {
      // Chưa có bản ghi thì tạo mới
      const track = new Track({
        userId,
        courseId: trackData.courseId,
        lessonId: trackData.lessonId
      })

      await track.save()
      return track
    }
  }

  /**
   * Lấy toàn bộ bản ghi theo bộ lọc
   */
  static async getTracks(userId: string, options: Partial<GetTrackQuery> = {}) {
    const { courseId, lessonId, sortBy = 'createdAt', sortOrder = 'desc' } = options

    // Tạo điều kiện lọc
    const filter: Record<string, unknown> = { userId }

    if (courseId) {
      filter.courseId = courseId
    }

    if (lessonId) {
      filter.lessonId = lessonId
    }

    // Tạo điều kiện sắp xếp
    const sort: Record<string, 1 | -1> = {}
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1

    // Thực thi truy vấn
    const tracks = await Track.find(filter).sort(sort).lean()

    return tracks
  }

  /**
   * Lấy bản ghi theo một khóa học cụ thể
   */
  static async getCourseTrack(userId: string, options: GetCourseTrackQuery): Promise<ITrack[]> {
    const { courseId } = options

    // Kiểm tra khóa học có tồn tại
    const course = await Course.findById(courseId)
    if (!course) {
      throw new AppError('Không tìm thấy khóa học', 404)
    }

    const tracks = await Track.find({ userId, courseId })
      .populate('lessonId', 'title contentType duration order')
      .sort({ createdAt: -1 })

    return tracks
  }

  /**
   * Lấy bản ghi của người dùng cho nhiều khóa học
   */
  static async getUserTracks(userId: string, options: Partial<GetUserTrackQuery> = {}) {
    const { courseIds } = options

    // Tạo điều kiện lọc
    const filter: Record<string, unknown> = { userId }

    if (courseIds) {
      const courseIdArray = courseIds.split(',').map((id) => id.trim())
      filter.courseId = { $in: courseIdArray }
    }

    // Thực thi truy vấn
    const tracks = await Track.find(filter).sort({ createdAt: -1 }).lean()

    return tracks
  }

  /**
   * Lấy bản ghi theo ID
   */
  static async getTrackById(trackId: string, userId: string): Promise<ITrack> {
    const track = await Track.findOne({ _id: trackId, userId })
      .populate('courseId', 'title slug')
      .populate('lessonId', 'title contentType duration')
      .populate('userId', 'username email')

    if (!track) {
      throw new AppError('Không tìm thấy bản ghi theo dõi', 404)
    }

    return track
  }

  /**
   * Xóa bản ghi
   */
  static async deleteTrack(trackId: string, userId: string): Promise<void> {
    const track = await Track.findOne({ _id: trackId, userId })
    if (!track) {
      throw new AppError('Không tìm thấy bản ghi theo dõi', 404)
    }

    await Track.findByIdAndDelete(trackId)
  }
}
