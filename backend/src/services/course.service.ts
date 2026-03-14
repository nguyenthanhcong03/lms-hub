import { FilterQuery } from 'mongoose'
import { CourseStatus } from '~/constants/enums'
import { BadRequestError, NotFoundError } from '~/core/error.response'
import CourseModel from '~/models/course.model'
import UserModel from '~/models/user.model'
import { CourseQueryParams, CreateCourseParams } from '~/types/course.type'
import { toObjectId } from '~/utils'

const CourseService = {
  createCourse: async (userId: string, courseData: CreateCourseParams) => {
    const findCourse = await CourseModel.findOne({ slug: courseData.slug })

    if (findCourse) {
      throw new BadRequestError('Khóa học đã tồn tại')
    }

    const newCourse = await CourseModel.create({
      ...courseData,
      author: userId
    })

    return newCourse
  },

  getAllMyCourses: async (userId: string) => {
    const findUser = await UserModel.findById(userId)

    const myCourses = await CourseModel.aggregate([
      {
        $match: {
          _id: { $in: findUser?.courses }
        }
      },
      {
        $lookup: {
          from: 'lessons',
          let: {
            courseId: '$_id'
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$course', '$$courseId']
                }
              }
            },
            {
              $count: 'total_lesson'
            }
          ],
          as: 'lessonData'
        }
      },
      {
        $lookup: {
          from: 'tracks',
          let: {
            courseId: '$_id'
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$course', '$$courseId']
                    },
                    {
                      $eq: ['$user', toObjectId(userId)]
                    }
                  ]
                }
              }
            },
            {
              $count: 'total_completed'
            }
          ],
          as: 'trackData'
        }
      },
      {
        $lookup: {
          from: 'reviews',
          // Name of the users collection
          let: {
            courseId: '$_id'
          },
          // Pass the review ID to the lookup pipeline
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$course', '$$courseId'] // Match lessons with the given course ID
                }
              }
            },
            {
              $group: {
                _id: null,
                average_star: {
                  $avg: '$star'
                }
              }
            }
          ],
          as: 'reviewData' // Name of the resulting field
        }
      },
      {
        $addFields: {
          total_lesson: {
            $ifNull: [
              {
                $arrayElemAt: ['$lessonData.total_lesson', 0]
              },
              0
            ]
          }
        }
      },
      {
        $addFields: {
          total_completed: {
            $ifNull: [
              {
                $arrayElemAt: ['$trackData.total_completed', 0]
              },
              0
            ]
          }
        }
      },
      {
        $addFields: {
          average_star: {
            $ifNull: [
              {
                $arrayElemAt: ['$reviewData.average_star', 0]
              },
              0
            ]
          }
        }
      },
      {
        $project: {
          title: 1,
          slug: 1,
          image: 1,
          total_completed: 1,
          average_star: 1,
          total_duration: 1,
          total_lesson: 1
        }
      }
    ])
    return myCourses
  },

  getDetailsCourse: async (courseId: string) => {
    const course = await CourseModel.findById(courseId)

    if (!course) {
      throw new NotFoundError('Khóa học không tồn tại')
    }

    return course
  },

  searchCourses: async (queryParams: { search?: string }) => {
    const searchQuery = queryParams?.search || ''

    if (!searchQuery) {
      return []
    }

    const courses = await CourseModel.find({
      title: { $regex: searchQuery, $options: 'i' }
    }).sort({ createdAt: -1 })

    return courses
  },

  getCourseBySlug: async (slug: string) => {
    const [course] = await CourseModel.aggregate([
      {
        $match: {
          slug
        }
      },
      {
        $lookup: {
          from: 'chapters',
          let: { courseId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$course', '$$courseId'] }
              }
            },
            {
              $lookup: {
                from: 'lessons',
                let: { chapterId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ['$chapter', '$$chapterId'] }
                    }
                  },
                  {
                    $project: {
                      title: 1,
                      slug: 1,
                      duration: 1,
                      type: 1
                    }
                  }
                ],
                as: 'lessons'
              }
            }
          ],
          as: 'chapters'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author'
        }
      },
      {
        $unwind: {
          path: '$author',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'users',
          let: { courseId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $in: ['$$courseId', '$courses'] }
              }
            },
            {
              $count: 'total_user'
            }
          ],
          as: 'userData'
        }
      },
      {
        $lookup: {
          from: 'lessons',
          let: { courseId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$course', '$$courseId'] }
              }
            },
            {
              $group: {
                _id: null,
                total_duration: { $sum: '$duration' },
                total_lesson: { $sum: 1 }
              }
            }
          ],
          as: 'lessonData'
        }
      },

      {
        $addFields: {
          total_duration: {
            $ifNull: [{ $arrayElemAt: ['$lessonData.total_duration', 0] }, 0]
          },
          total_lesson: {
            $ifNull: [{ $arrayElemAt: ['$lessonData.total_lesson', 0] }, 0]
          },
          total_user: {
            $ifNull: [{ $arrayElemAt: ['$userData.total_user', 0] }, 0]
          }
        }
      },
      {
        $project: {
          title: 1,
          slug: 1,
          image: 1,
          level: 1,
          price: 1,
          old_price: 1,
          description: 1,
          chapters: 1,
          intro_url: 1,
          author: {
            username: '$author.username',
            avatar: '$author.avatar'
          },
          type: 1,
          info: 1,
          category: {
            name: '$category.name'
          },
          total_duration: 1,
          total_lesson: 1,
          total_user: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ])

    return course
  },

  getAllCourses: async (params: CourseQueryParams) => {
    const limit = +(params?.limit ?? 10)
    const search = params?.search || ''
    const page = +(params?.page ?? 1)
    const statusFilter = params?.status
    const level = params?.level
    const skip = (page - 1) * limit

    const query: FilterQuery<typeof CourseModel> = {}
    if (statusFilter) {
      query.status = statusFilter
    }

    if (level) {
      query.level = level
    }

    if (search) {
      query.$or = [{ title: { $regex: search, $options: 'i' } }]
    }
    const [courses, total_count] = await Promise.all([
      CourseModel.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .select('price old_price title slug image level view sold createdAt type status category ')
        .populate('category', 'name'),
      CourseModel.countDocuments(query)
    ])

    const total_pages = Math.ceil(total_count / limit)
    return { courses, pagination: { page, per_page: limit, total_pages, total_count } }
  },
  getAllCoursesPublic: async (params: CourseQueryParams) => {
    const limit = +(params?.limit ?? 10)
    const search = params?.search || ''
    const level = params?.level || ''
    const page = +(params?.page ?? 1)
    const min_star = +(params?.min_star ?? 0)
    const max_star = +(params?.max_star ?? 5)
    const min_price = +(params?.min_price ?? 0)
    const max_price = +(params?.max_price ?? Number.MAX_SAFE_INTEGER)
    const sort_by = params?.sort_by || 'ctime'
    const order = params?.order || 'desc'
    const category = params?.category || ''
    const query: FilterQuery<typeof CourseModel> = {}

    if (search) {
      query.$or = [{ title: { $regex: search, $options: 'i' } }]
    }
    if (category) {
      query.category = toObjectId(category)
    }
    if (level) {
      if (Array.isArray(level)) {
        query.level = { $in: level }
      } else {
        query.level = level
      }
    }
    let sortOptions = {}
    if (sort_by === 'price') {
      sortOptions = { price: order === 'asc' ? 1 : -1 }
    } else if (sort_by === 'ctime') {
      sortOptions = { createdAt: -1 }
    } else if (sort_by === 'view') {
      sortOptions = { view: -1 }
    } else if (sort_by === 'sold') {
      sortOptions = { sold: -1 }
    }

    query.price = { $gte: min_price, $lte: max_price }
    query.status = CourseStatus.APPROVED

    const skip = (page - 1) * limit

    const [total_count, courses] = await Promise.all([
      CourseModel.countDocuments(query),
      CourseModel.aggregate([
        {
          $match: query
        },
        { $sort: sortOptions },
        {
          $lookup: {
            from: 'lessons',
            // Name of the lessons collection
            let: {
              courseId: '$_id'
            },
            // Pass the course ID to the lookup pipeline
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$course', '$$courseId'] // Match lessons with the given course ID
                  }
                }
              },
              {
                $group: {
                  _id: null,
                  // Group by null to calculate a total sum
                  total_duration: {
                    $sum: '$duration'
                  } // Sum the duration field
                }
              }
            ],

            as: 'lessonData' // Name of the resulting field
          }
        },
        {
          $lookup: {
            from: 'users',
            // Name of the users collection
            let: {
              courseId: '$_id'
            },
            // Pass the course ID to the lookup pipeline
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ['$$courseId', '$courses'] // Check if the course ID exists in the user's courses array
                  }
                }
              },
              {
                $count: 'total_user' // Count the number of matching users
              }
            ],

            as: 'userData' // Name of the resulting field
          }
        },
        {
          $lookup: {
            from: 'reviews',
            // Name of the users collection
            let: {
              courseId: '$_id'
            },
            // Pass the review ID to the lookup pipeline
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$course', '$$courseId'] // Match lessons with the given course ID
                  }
                }
              },
              {
                $group: {
                  _id: null,
                  average_star: {
                    $avg: '$star'
                  },
                  // Calculate average star rating
                  total_review: {
                    $count: {}
                  } // Count total reviews
                }
              }
            ],

            as: 'reviewData' // Name of the resulting field
          }
        },
        {
          $addFields: {
            total_duration: {
              $ifNull: [
                {
                  $arrayElemAt: ['$lessonData.total_duration', 0]
                },
                0
              ]
            }
          }
        },
        {
          $addFields: {
            total_user: {
              $ifNull: [
                {
                  $arrayElemAt: ['$userData.total_user', 0]
                },
                0
              ]
            } // Extract userCount or set 0 if no users
          }
        },
        {
          $addFields: {
            total_review: {
              $ifNull: [
                {
                  $arrayElemAt: ['$reviewData.total_review', 0]
                },
                0
              ]
            },
            average_star: {
              $ifNull: [
                {
                  $arrayElemAt: ['$reviewData.average_star', 0]
                },
                0
              ]
            }
          }
        },
        {
          $match: {
            average_star: { $gte: min_star, $lte: max_star }
          }
        },

        {
          $skip: skip
        },
        {
          $limit: limit
        },
        {
          $project: {
            title: 1,
            slug: 1,
            image: 1,
            level: 1,
            view: 1,
            sold: 1,
            price: 1,
            old_price: 1,
            total_duration: 1,
            total_review: 1,
            total_user: 1,
            createdAt: 1,
            updatedAt: 1
          }
        }
      ])
    ])

    const total_pages = Math.ceil(total_count / limit)
    return { courses, pagination: { page, per_page: limit, total_pages, total_count } }
  },

  updateCourse: async (id: string, body: Partial<CreateCourseParams>) => {
    const result = await CourseModel.findByIdAndUpdate(id, body, { new: true })

    if (!result) {
      throw new NotFoundError('Khóa học không tồn tại')
    }

    return result
  },
  updateCourseView: async (slug: string) => {
    const course = await CourseModel.findOneAndUpdate({ slug }, { $inc: { view: 1 } }, { new: true })

    return course
  },

  deleteCourse: async (id: string) => {
    const course = await CourseModel.findByIdAndDelete(id)

    if (!course) {
      throw new NotFoundError('Khóa học không tồn tại')
    }

    return course
  },

  deleteMultipleCourses: async (ids: string[]) => {
    const result = await CourseModel.deleteMany({ _id: { $in: ids } })

    if (result.deletedCount === 0) {
      throw new BadRequestError('Không có khóa học nào được tìm thấy')
    }

    return result
  },

  getCourseMetrics: async () => {
    const result = await CourseModel.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$view' },
          totalSales: { $sum: '$sold' },
          totalCourses: { $sum: 1 }
        }
      }
    ])

    return {
      views: {
        total: result[0].totalViews
      },
      sales: {
        total: result[0].totalSales
      },
      courses: {
        total: result[0].totalCourses
      }
    }
  }
}

export default CourseService
