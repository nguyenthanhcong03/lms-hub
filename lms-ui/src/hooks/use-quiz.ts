import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { QuizService } from '@/services/quiz'
import { QuizQuestion, QuizAttemptsData, QuizAnswerSubmission } from '@/types/quiz'

// Khóa truy vấn
const QUERY_KEYS = {
  QUIZ_BY_LESSON: (lessonId: string) => ['quiz', 'lesson', lessonId],
  QUIZ: (quizId: string) => ['quiz', quizId],
  QUIZ_ATTEMPTS: (quizId: string) => ['quiz', 'attempts', quizId]
} as const

// Hook lấy quiz theo ID bài học
export function useQuizByLesson(lessonId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: QUERY_KEYS.QUIZ_BY_LESSON(lessonId),
    queryFn: () => QuizService.getQuizByLesson(lessonId),
    enabled: !!lessonId && (options?.enabled ?? true)
  })
}

// Hook lấy quiz theo ID
export function useQuiz(quizId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.QUIZ(quizId),
    queryFn: () => QuizService.getQuiz(quizId),
    enabled: !!quizId
  })
}

// Hook lấy lịch sử lượt làm quiz
export function useQuizAttempts(quizId: string) {
  return useQuery<QuizAttemptsData, Error, QuizAttemptsData>({
    queryKey: QUERY_KEYS.QUIZ_ATTEMPTS(quizId),
    queryFn: () => QuizService.getQuizAttempts(quizId),
    enabled: !!quizId
  })
}

// Hook lấy lượt làm quiz theo ID bài học
export function useQuizAttemptsByLesson(lessonId: string) {
  return useQuery({
    queryKey: ['quiz', 'attempts', 'lesson', lessonId],
    queryFn: () => QuizService.getQuizAttemptsByLesson(lessonId),
    enabled: !!lessonId
  })
}

// Hook lấy trạng thái quiz - kiểm tra người dùng có lượt làm đang diễn ra không
export function useQuizStatus(quizId: string) {
  return useQuery({
    queryKey: ['quiz', 'status', quizId],
    queryFn: () => QuizService.getQuizStatus(quizId),
    enabled: !!quizId
  })
}

// Hook lấy câu hỏi cho màn làm quiz
export function useQuizTakingQuestions(quizId: string) {
  return useQuery({
    queryKey: ['quiz', 'taking', 'questions', quizId],
    queryFn: () => QuizService.getQuizTakingQuestions(quizId),
    enabled: !!quizId
  })
}

// Mutation lưu danh sách câu hỏi quiz
export function useSaveQuizQuestions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ questions }: { questions: QuizQuestion[] }) => QuizService.saveQuizQuestions(questions),
    onSuccess: (updatedQuiz) => {
      // Làm mới và tải lại các truy vấn quiz
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.QUIZ_BY_LESSON(updatedQuiz.lessonId)
      })
      queryClient.setQueryData(QUERY_KEYS.QUIZ(updatedQuiz._id!), updatedQuiz)
      toast.success('Các câu hỏi đã được lưu thành công')
    },
    onError: (error) => {
      console.error('Save quiz questions error:', error)
      toast.error('Không lưu được câu hỏi')
    }
  })
}

// Mutation cập nhật câu hỏi quiz
export function useUpdateQuizQuestions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ quizId, questions }: { quizId: string; questions: QuizQuestion[] }) =>
      QuizService.updateQuizQuestions(quizId, questions),
    onSuccess: (updatedQuiz) => {
      // Cập nhật cache
      queryClient.setQueryData(QUERY_KEYS.QUIZ(updatedQuiz._id!), updatedQuiz)
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.QUIZ_BY_LESSON(updatedQuiz.lessonId)
      })
      toast.success('Các câu hỏi đã được cập nhật thành công')
    },
    onError: (error) => {
      console.error('Update quiz questions error:', error)
      toast.error('Không cập nhật được câu hỏi')
    }
  })
}

// Mutation xóa quiz
export function useDeleteQuiz() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (quizId: string) => QuizService.deleteQuiz(quizId),
    onSuccess: (_, quizId) => {
      // Xóa khỏi cache và làm mới truy vấn liên quan
      queryClient.removeQueries({ queryKey: QUERY_KEYS.QUIZ(quizId) })
      queryClient.invalidateQueries({ queryKey: ['quiz', 'lesson'] })
      toast.success('Bài quiz đã được xóa thành công')
    },
    onError: (error) => {
      console.error('Delete quiz error:', error)
      toast.error('Không xóa được bài quiz')
    }
  })
}

// Mutation xuất bản quiz
export function usePublishQuiz() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (quizId: string) => QuizService.publishQuiz(quizId),
    onSuccess: (updatedQuiz) => {
      queryClient.setQueryData(QUERY_KEYS.QUIZ(updatedQuiz._id!), updatedQuiz)
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.QUIZ_BY_LESSON(updatedQuiz.lessonId)
      })
      toast.success('Bài quiz đã được xuất bản thành công')
    },
    onError: (error) => {
      console.error('Publish quiz error:', error)
      toast.error('Không xuất bản được bài quiz')
    }
  })
}

// Mutation hủy xuất bản quiz
export function useUnpublishQuiz() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (quizId: string) => QuizService.unpublishQuiz(quizId),
    onSuccess: (updatedQuiz) => {
      queryClient.setQueryData(QUERY_KEYS.QUIZ(updatedQuiz._id!), updatedQuiz)
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.QUIZ_BY_LESSON(updatedQuiz.lessonId)
      })
      toast.success('Bài quiz đã được hủy xuất bản thành công')
    },
    onError: (error) => {
      console.error('Unpublish quiz error:', error)
      toast.error('Không hủy xuất bản được bài quiz')
    }
  })
}

// Mutation thêm câu hỏi
export function useAddQuestion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ quizId, question }: { quizId: string; question: Omit<QuizQuestion, '_id'> }) =>
      QuizService.addQuestion(quizId, question),
    onSuccess: (_, { quizId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUIZ(quizId) })
      toast.success('Câu hỏi đã được thêm thành công')
    },
    onError: (error) => {
      console.error('Add question error:', error)
      toast.error('Không thêm được câu hỏi')
    }
  })
}

// Mutation cập nhật câu hỏi
export function useUpdateQuestion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      quizId,
      questionId,
      question
    }: {
      quizId: string
      questionId: string
      question: Omit<QuizQuestion, '_id'>
    }) => QuizService.updateQuestion(quizId, questionId, question),
    onSuccess: (_, { quizId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUIZ(quizId) })
      toast.success('Câu hỏi đã được cập nhật thành công')
    },
    onError: (error) => {
      console.error('Update question error:', error)
      toast.error('Không cập nhật được câu hỏi')
    }
  })
}

// Mutation xóa câu hỏi
export function useDeleteQuestion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ quizId, questionId }: { quizId: string; questionId: string }) =>
      QuizService.deleteQuestion(quizId, questionId),
    onSuccess: (_, { quizId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUIZ(quizId) })
      toast.success('Câu hỏi đã được xóa thành công')
    },
    onError: (error) => {
      console.error('Delete question error:', error)
      toast.error('Không xóa được câu hỏi')
    }
  })
}

// Mutation sắp xếp lại câu hỏi
export function useReorderQuestions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ quizId, questionIds }: { quizId: string; questionIds: string[] }) =>
      QuizService.reorderQuestions(quizId, questionIds),
    onSuccess: (updatedQuiz) => {
      queryClient.setQueryData(QUERY_KEYS.QUIZ(updatedQuiz._id!), updatedQuiz)
      toast.success('Các câu hỏi đã được sắp xếp lại thành công')
    },
    onError: (error) => {
      console.error('Reorder questions error:', error)
      toast.error('Không sắp xếp lại được câu hỏi')
    }
  })
}

// Mutation bắt đầu lượt làm quiz
export function useStartQuizAttempt() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (quizId: string) => QuizService.startQuizAttempt(quizId),
    onSuccess: (attempt, quizId) => {
      // Làm mới truy vấn trạng thái quiz và lịch sử lượt làm
      queryClient.invalidateQueries({ queryKey: ['quiz', 'status', quizId] })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.QUIZ_ATTEMPTS(quizId)
      })
    },
    onError: (error) => {
      toast.error(error.message || 'Không bắt đầu được lượt làm quiz')
    }
  })
}

// Mutation nộp bài quiz
export function useSubmitQuizAttempt() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ attemptId, answers }: { attemptId: string; answers: QuizAnswerSubmission[] }) =>
      QuizService.submitQuizAttempt(attemptId, answers),
    onSuccess: () => {
      // Làm mới toàn bộ truy vấn liên quan đến quiz để cập nhật dữ liệu
      queryClient.invalidateQueries({ queryKey: ['quiz', 'attempts'] })
      queryClient.invalidateQueries({ queryKey: ['quiz', 'status'] })
      toast.success('Đã nộp bài quiz thành công!')
    },
    onError: (error) => {
      console.error('Submit quiz attempt error:', error)
      toast.error('Không nộp được bài quiz')
    }
  })
}
