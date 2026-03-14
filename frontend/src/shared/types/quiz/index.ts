export type TParamsGetQuizzes = {
  limit?: number | string;
  page?: number | string;
  search?: string;
};

export type TParamsCreateQuiz = {
  name: string;
  slug: string;
};

export interface TParamsEditQuiz extends Partial<TParamsCreateQuiz> {
  id: string;
}

export type TParamsDeleteQuiz = {
  id: string;
  name: string;
};

export type TParamsDeleteMultipleQuiz = {
  QuizIds: string[];
};

export type TQuizItem = {
  _id: string;
  name: string;
  slug: string;
  createdBy: {
    _id: string;
    username: string;
    avatar: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
};
