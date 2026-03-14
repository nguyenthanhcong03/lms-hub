import { Application } from 'express'
import courseRouter from './course.router'
import userRouter from './user.router'
import chapterRouter from './chapter.router'
import orderRouter from './order.router'
import lessonRouter from './lesson.router'
import couponRouter from './coupon.router'
import commentRouter from './comment.router'
import trackRouter from './track.router'

import cartRouter from './cart.router'
import reviewRouter from './review.router'
import categoryRouter from './category.router'
import authRouter from './auth.router'
import reactionRouter from './reaction.router'
import quizRouter from './quiz.router'
import questionRouter from './question.router'
import quizAttemptRouter from './quiz-attempt.router'
import reportRouter from './report.router'
const initialRouter = (app: Application) => {
  app.use('/api/v1/auth', authRouter)
  app.use('/api/v1/users', userRouter)
  app.use('/api/v1/courses', courseRouter)
  app.use('/api/v1/chapters', chapterRouter)
  app.use('/api/v1/orders', orderRouter)
  app.use('/api/v1/lessons', lessonRouter)
  app.use('/api/v1/coupons', couponRouter)
  app.use('/api/v1/comments', commentRouter)
  app.use('/api/v1/reviews', reviewRouter)
  app.use('/api/v1/categories', categoryRouter)
  app.use('/api/v1/tracks', trackRouter)
  app.use('/api/v1/cart', cartRouter)
  app.use('/api/v1/reactions', reactionRouter)
  app.use('/api/v1/quizzes', quizRouter)
  app.use('/api/v1/quiz-attempts', quizAttemptRouter)
  app.use('/api/v1/questions', questionRouter)
  app.use('/api/v1/reports', reportRouter)
}
export default initialRouter
