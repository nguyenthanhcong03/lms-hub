export type TParamsGetTracks = {
  courseId: string;
};

export type TParamsCreateTrack = {
  courseId: string;
  lessonId: string;
};

export type TParamsEditTrack = {
  id: string;
  title?: string;
  slug?: string;
  price?: number;
  old_price?: number;
  intro_url?: string;
  description?: string;
  image?: string;
  status?: string;
  level?: string;
  views?: number;
  info?: {
    requirements?: string[];
    benefits?: string[];
    qa?: string[];
  };
};

export type TParamsDeleteTrack = {
  id: string;
  name: string;
};

export type TParamsDeleteMultipleTrack = {
  trackIds: string[];
};

export type TTrackItem = {
  _id: string;
  course: string;
  lesson: string;
  user: string;
};
