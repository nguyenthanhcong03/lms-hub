// Kieu du lieu bai hoc

import type {QuestionType} from "@/types/quiz";

export type ContentType = "video" | "quiz" | "article";

// Interface tai nguyen bai hoc
export interface ILessonResource {
	_id?: string;
	title?: string;
	description?: string;
	url?: string; // for video
	totalAttemptsAllowed?: number; // for quiz
	passingScorePercentage?: number; // for quiz
	questions?: QuizQuestionForm[]; // for quiz
}

// Quiz question interface for form management
export interface QuizQuestionForm {
	id?: string;
	question: string;
	explanation: string;
	type: QuestionType;
	options: string[];
	correctAnswers: number[];
	point: number;
}

// Interface bai hoc chinh (API response)
export interface ILesson {
	_id: string;
	title: string;
	chapterId: string;
	courseId: string;
	resourceId?: string;
	contentType: ContentType;
	order: number;
	preview: boolean;
	isPublished: boolean;
	duration?: number; // in minutes
	course?: {
		_id: string;
		title: string;
		slug: string;
	};
	resource?: {
		_id?: string;
		title?: string;
		description?: string;
		duration?: number;
		url?: string;
		totalAttemptsAllowed?: number;
		passingScorePercentage?: number;
	};
	createdAt: string;
	updatedAt: string;
}

// Interface hien thi bai hoc (cho UI components)
export interface DisplayLesson {
	_id: string;
	title: string;
	contentType: ContentType;
	resourceId: string;
	isPublished: boolean;
	preview: boolean;
	order: number;
	duration?: number;
	resource?: {
		description?: string;
		url?: string;
		totalAttemptsAllowed?: number;
		passingScorePercentage?: number;
	};
}

// Interface du lieu form bai hoc
export interface LessonFormData {
	_id?: string;
	title: string;
	chapterId: string;
	courseId: string;
	resourceId?: string;
	contentType: ContentType;
	order: number;
	preview: boolean;
	isPublished: boolean;
	duration?: number; // in seconds
	resource?: ILessonResource;
}

// Kieu request bai hoc
export type CreateLessonRequest = LessonFormData;

export interface UpdateLessonRequest extends Partial<LessonFormData> {
	id: string;
}

export interface ReorderLessonsRequest {
	lessons: Array<{id: string; order: number}>;
}

export interface LessonsFilterParams {
	chapterId?: string;
	courseId?: string;
	isPublished?: boolean;
	contentType?: ContentType;
	search?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
	page?: number;
	limit?: number;
	[key: string]: unknown;
}

// Response danh sach bai hoc (dong bo voi cac service khac)
export interface LessonsListResponse {
	lessons: ILesson[];
	pagination?: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNextPage?: boolean;
		hasPrevPage?: boolean;
	};
}

// Keep BackendLessonData and ApiLesson as aliases for backward compatibility
export type BackendLessonData = LessonFormData;
