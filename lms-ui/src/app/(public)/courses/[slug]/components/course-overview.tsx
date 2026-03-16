"use client";

import { useState } from "react";
import {
  CheckCircle,
  BookOpen,
  Target,
  AlertTriangle,
  Lightbulb,
  FileText,
  MessageCircleQuestion,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { IPublicCourse, CourseQA } from "@/types/course";
import { formatDuration } from "@/utils/format";

interface CourseOverviewProps {
  course: IPublicCourse;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "overview", name: "Tổng quan", icon: BookOpen },
  { id: "requirements", name: "Yêu cầu", icon: AlertTriangle },
  { id: "benefits", name: "Lợi ích", icon: Target },
  { id: "techniques", name: "Kỹ thuật", icon: Lightbulb },
  { id: "documents", name: "Tài liệu", icon: FileText },
  { id: "qa", name: "Câu hỏi thường gặp", icon: MessageCircleQuestion },
];

const CourseOverview = ({ course, activeTab, onTabChange }: CourseOverviewProps) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const descriptionLength = course.description?.replace(/<[^>]*>/g, "").length || 0;
  const shouldTruncate = descriptionLength > 500;

  return (
    <div className="bg-background rounded-xs shadow-sm border border-border overflow-hidden">
      {/* Tabs */}
      <div className="border-b border-border overflow-x-auto scrollbar-hide">
        <div className="flex min-w-max sm:grid sm:grid-cols-6">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center justify-center gap-1 p-3 sm:py-4 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary bg-primary/10"
                    : "border-transparent text-muted-foreground hover:text-primary hover:bg-primary/5"
                }`}
              >
                <IconComponent className="h-4 w-4 flex-shrink-0" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4">Tổng quan khóa học</h3>

              <div className="relative">
                <div
                  className={`rich-content text-sm sm:text-base text-muted-foreground leading-relaxed transition-all duration-300 ${
                    !isDescriptionExpanded && shouldTruncate ? "max-h-60 overflow-hidden" : ""
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: course.description,
                  }}
                />

                {!isDescriptionExpanded && shouldTruncate && (
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                )}
              </div>

              {shouldTruncate && (
                <div className="mt-4 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="inline-flex items-center gap-2"
                  >
                    {isDescriptionExpanded ? (
                      <>
                        Show Less
                        <ChevronUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Show More
                        <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Features */}
            <div>
              <h4 className="text-base font-semibold text-foreground mb-3">Khóa học này bao gồm:</h4>

              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  `${formatDuration(course.totalDuration || 0)} video`,
                  `${course.totalLessons || 0} bài học`,
                  "Truy cập trọn đời",
                  "Xem trên mobile và TV",
                  "Chứng chỉ hoàn thành",
                  "Hoàn tiền trong 30 ngày",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* REQUIREMENTS */}
        {activeTab === "requirements" && (
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold text-foreground">Yêu cầu</h3>

            <ul className="space-y-3">
              {(course.info?.requirements?.length
                ? course.info.requirements
                : ["Hiểu biết cơ bản về chủ đề", "Máy tính có kết nối internet"]
              ).map((requirement: string, index: number) => (
                <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* BENEFITS */}
        {activeTab === "benefits" && (
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold text-foreground">Lợi ích</h3>

            <div className="grid sm:grid-cols-2 gap-4">
              {(course.info?.benefits?.length
                ? course.info.benefits
                : ["Nắm vững kiến thức nền tảng", "Xây dựng dự án thực tế", "Trải nghiệm thực hành"]
              ).map((objective: string, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/10 rounded-sm"
                >
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{objective}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TECHNIQUES */}
        {activeTab === "techniques" && (
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold text-foreground">Các kỹ thuật</h3>

            <div className="space-y-3">
              {(course.info?.techniques?.length
                ? course.info.techniques
                : ["Best practices trong ngành", "Kỹ thuật phát triển hiện đại"]
              ).map((technique: string, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 border border-border rounded-lg hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>

                  <span className="text-sm text-muted-foreground">{technique}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DOCUMENTS */}
        {activeTab === "documents" && (
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold text-foreground">Course Documents & Resources</h3>

            <div className="space-y-3">
              {(course.info?.documents?.length
                ? course.info.documents
                : ["Tài liệu sẽ có sau khi đăng ký khóa học"]
              ).map((document: string, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-muted rounded-lg border border-border hover:shadow-sm transition-all"
                >
                  <BookOpen className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />

                  <p className="text-sm text-muted-foreground">{document}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QA */}
        {activeTab === "qa" && (
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold text-foreground">Câu hỏi thường gặp</h3>

            <div className="space-y-4">
              {(course.info?.qa?.length
                ? course.info.qa
                : [
                    {
                      question: "Tôi có thể truy cập khóa học này trong bao lâu?",
                      answer: "Bạn có quyền truy cập trọn đời vào khóa học.",
                    },
                  ]
              ).map((item: CourseQA, index: number) => (
                <div key={index} className="border border-border rounded-lg p-5 hover:border-primary/40 transition-all">
                  <h4 className="text-sm sm:text-base font-semibold text-foreground mb-2 flex items-start">
                    <span className="text-primary mr-2">Q:</span>
                    <span className="flex-1">{item.question}</span>
                  </h4>

                  <p className="text-sm text-muted-foreground ml-6">
                    <span className="text-primary/70 font-semibold mr-2">A:</span>
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseOverview;
