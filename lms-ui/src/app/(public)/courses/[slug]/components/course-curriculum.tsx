'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { IPublicChapter } from '@/types/chapter'
import { formatDuration, secondsToDisplayTime } from '@/utils/format'

import { Award, BookOpen, Clock, HelpCircle, Layers, LucideFileText, PlayCircle } from 'lucide-react'

import React from 'react'
import { MdOutlineSlowMotionVideo } from 'react-icons/md'

interface CourseCurriculumProps {
  chapters: IPublicChapter[]
  isLoading: boolean
}

const CourseCurriculum = ({ chapters, isLoading }: CourseCurriculumProps) => {
  if (isLoading) {
    return (
      <div className='bg-background border-border overflow-hidden rounded-xs border shadow-sm'>
        {/* Tiêu đề */}
        <div className='border-border border-b p-6'>
          <div className='flex items-center gap-3'>
            <div className='bg-primary flex h-12 w-12 items-center justify-center rounded-xs'>
              <Layers className='text-primary-foreground h-6 w-6' />
            </div>

            <div className='flex-1'>
              <Skeleton className='mb-2 h-6 w-48' />
              <Skeleton className='h-4 w-64' />
            </div>
          </div>
        </div>

        {/* Đang tải */}
        <div className='space-y-6 p-6'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='border-border rounded-xs border p-6'>
              <div className='mb-4 flex justify-between'>
                <Skeleton className='h-6 w-2/3' />
                <Skeleton className='h-5 w-20' />
              </div>

              <div className='space-y-3'>
                {[1, 2].map((j) => (
                  <div key={j} className='flex items-center gap-3'>
                    <Skeleton className='h-8 w-8 rounded-xs' />

                    <div className='flex-1'>
                      <Skeleton className='mb-1 h-4 w-3/4' />
                      <Skeleton className='h-3 w-1/4' />
                    </div>

                    <Skeleton className='h-8 w-20 rounded-xs' />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (chapters.length === 0) {
    return (
      <div className='bg-background border-border overflow-hidden rounded-xs border shadow-sm'>
        {/* Tiêu đề */}
        <div className='border-border border-b p-6'>
          <div className='flex items-center gap-3'>
            <div className='bg-primary flex h-12 w-12 items-center justify-center rounded-xs'>
              <Layers className='text-primary-foreground h-6 w-6' />
            </div>

            <div>
              <h3 className='text-foreground text-xl font-semibold'>Nội dung khóa học</h3>
              <p className='text-muted-foreground text-sm'>Khám phá các chương và bài học</p>
            </div>
          </div>
        </div>

        {/* Trạng thái rỗng */}
        <div className='p-12 text-center'>
          <div className='bg-muted mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full'>
            <BookOpen className='text-muted-foreground h-10 w-10' />
          </div>

          <h4 className='text-foreground mb-2 text-xl font-semibold'>Chưa có nội dung</h4>

          <p className='text-muted-foreground mx-auto max-w-sm'>
            Khóa học này hiện chưa có nội dung. Vui lòng quay lại sau để xem cập nhật mới.
          </p>
        </div>
      </div>
    )
  }

  const totalLessons = chapters.reduce((total, chapter) => total + (chapter.lessons?.length || 0), 0)

  const totalDuration = chapters.reduce(
    (total, chapter) =>
      total + (chapter.lessons?.reduce((sum: number, lesson) => sum + (lesson.duration || 0), 0) || 0),
    0
  )

  return (
    <div className='bg-background border-border overflow-hidden rounded-xs border shadow-sm'>
      {/* Tiêu đề */}
      <div className='border-border border-b p-6'>
        <div className='mb-6 flex items-center gap-4'>
          <div className='bg-primary flex h-12 w-12 items-center justify-center rounded-xl'>
            <Layers className='text-primary-foreground h-6 w-6' />
          </div>

          <div className='flex-1'>
            <h3 className='text-foreground text-xl font-semibold lg:text-2xl'>Nội dung khóa học</h3>
            <p className='text-muted-foreground text-sm'>Lộ trình học tập đầy đủ của khóa học</p>
          </div>
        </div>

        {/* Thống kê */}
        <div className='grid grid-cols-3 gap-4'>
          <div className='bg-primary/5 border-primary/20 rounded-xs border p-4'>
            <div className='mb-1 flex items-center gap-2'>
              <Award className='text-primary h-4 w-4' />
              <span className='text-muted-foreground text-xs font-medium uppercase'>Chương</span>
            </div>

            <p className='text-foreground text-2xl font-bold'>{chapters.length}</p>
          </div>

          <div className='bg-primary/5 border-primary/20 rounded-xs border p-4'>
            <div className='mb-1 flex items-center gap-2'>
              <PlayCircle className='text-primary h-4 w-4' />
              <span className='text-muted-foreground text-xs font-medium uppercase'>Bài học</span>
            </div>

            <p className='text-foreground text-2xl font-bold'>{totalLessons}</p>
          </div>

          <div className='bg-primary/5 border-primary/20 rounded-xs border p-4'>
            <div className='mb-1 flex items-center gap-2'>
              <Clock className='text-primary h-4 w-4' />
              <span className='text-muted-foreground text-xs font-medium uppercase'>Thời lượng</span>
            </div>

            <p className='text-foreground text-2xl font-bold'>{formatDuration(totalDuration || 0)}</p>
          </div>
        </div>
      </div>

      {/* Chương trình học */}
      <div className='bg-background'>
        <Accordion type='multiple' className='w-full'>
          {chapters.map((chapter, chapterIndex) => (
            <AccordionItem key={chapter._id} value={chapter._id} className='border-border border-b last:border-none'>
              <AccordionTrigger className='hover:bg-primary/5 px-6 py-4 hover:no-underline'>
                <div className='flex w-full justify-between text-left'>
                  <span className='text-sm font-semibold sm:text-base'>
                    {chapterIndex + 1}. {chapter.title}
                  </span>

                  <span className='text-muted-foreground text-sm'>{chapter.lessons?.length || 0} bài học</span>
                </div>
              </AccordionTrigger>

              <AccordionContent className='px-0 pb-0'>
                {chapter.lessons?.map((lesson, lessonIndex) => {
                  const isLastLesson = lessonIndex === (chapter.lessons?.length || 0) - 1

                  return (
                    <React.Fragment key={lesson._id}>
                      <div
                        className={cn('hover:bg-muted flex items-center justify-between px-6 py-4 transition-colors')}
                      >
                        <div className='flex min-w-0 flex-1 items-center gap-3 pr-2'>
                          <div className='flex h-6 w-6 items-center justify-center'>
                            {lesson.contentType === 'video' && (
                              <MdOutlineSlowMotionVideo className='text-muted-foreground h-4 w-4' />
                            )}

                            {lesson.contentType === 'quiz' && <HelpCircle className='text-muted-foreground h-4 w-4' />}

                            {lesson.contentType === 'article' && (
                              <LucideFileText className='text-muted-foreground h-4 w-4' />
                            )}
                          </div>

                          <span className='text-foreground truncate text-sm'>
                            {lessonIndex + 1}. {lesson.title}
                          </span>
                        </div>

                        <span className='text-muted-foreground text-sm'>
                          {secondsToDisplayTime(lesson.duration || 0)}
                        </span>
                      </div>

                      {!isLastLesson && <div className='border-border border-t border-dashed'></div>}
                    </React.Fragment>
                  )
                })}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}

export default CourseCurriculum
