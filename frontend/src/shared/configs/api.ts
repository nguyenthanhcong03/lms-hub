export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const API_ENDPOINT = {
  AUTH: {
    INDEX: `${BASE_URL}/auth`,
    AUTH_ME: `${BASE_URL}/auth/me`,
  },
  SYSTEM: {
    ROLE: {
      INDEX: `${BASE_URL}/roles`,
    },
    USER: {
      INDEX: `${BASE_URL}/users`,
    },
    REPORT: {
      INDEX: `${BASE_URL}/reports`,
    },
  },
  MANAGE_COURSE: {
    COURSE: {
      INDEX: `${BASE_URL}/courses`,
    },
    CATEGORY: {
      INDEX: `${BASE_URL}/categories`,
    },
    TRACK: {
      INDEX: `${BASE_URL}/tracks`,
    },
    REVIEW: {
      INDEX: `${BASE_URL}/reviews`,
    },
  },
  MANAGE_CHAPTER: {
    CHAPTER: {
      INDEX: `${BASE_URL}/chapters`,
    },
  },
  MANAGE_LESSON: {
    LESSON: {
      INDEX: `${BASE_URL}/lessons`,
    },
    COMMENT: {
      INDEX: `${BASE_URL}/comments`,
    },
    REACTION: {
      INDEX: `${BASE_URL}/reactions`,
    },
    QUIZ: {
      INDEX: `${BASE_URL}/quizzes`,
    },
    QUIZ_ATTEMPT: {
      INDEX: `${BASE_URL}/quiz-attempts`,
    },
    QUESTION: {
      INDEX: `${BASE_URL}/questions`,
    },
  },
  MANAGE_ORDER: {
    ORDER: {
      INDEX: `${BASE_URL}/orders`,
    },
  },
  MANAGE_COUPON: {
    COUPON: {
      INDEX: `${BASE_URL}/coupons`,
    },
  },
  MANAGE_CART: {
    CART: {
      INDEX: `${BASE_URL}/cart`,
    },
  },
};
