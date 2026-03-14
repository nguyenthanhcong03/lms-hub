"use client";
import { getAllMyCourses } from "@/shared/services/course";
import { TCourseItem } from "@/shared/types/course";
import { useEffect, useState } from "react";
import { FaUserGraduate } from "react-icons/fa";
import { GiTrophyCup } from "react-icons/gi";
import { IoIosBook } from "react-icons/io";
import CourseItem from "./components/course-item";
import CardItem from "./components/card-item";

const MyCoursePage = () => {
  const [courses, setCourses] = useState<TCourseItem[]>([]);

  const fetchMyCourses = async () => {
    const res = await getAllMyCourses();

    setCourses(res.data || []);
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);
  const totalCoursesCompleted = courses.filter(
    (course) =>
      course.total_completed === course.total_lesson &&
      course.total_lesson !== 0,
  ).length;

  const items = [
    {
      icon: <IoIosBook size={20} className="text-primary" />,
      qty: courses.length || 0,
      description: "Các khóa học của bạn",
    },
    {
      icon: <FaUserGraduate size={20} className="text-primary" />,
      qty: courses.length - totalCoursesCompleted,
      description: "Đang học",
    },
    {
      icon: <GiTrophyCup size={20} className="text-primary" />,
      qty: totalCoursesCompleted,
      description: "Đã hoàn thành",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-5">
        {items.map((item, index) => (
          <CardItem key={index} item={item} />
        ))}
      </div>

      <div className="space-y-8">
        <p className="text-lg font-medium">Các khóa học đang diễn ra</p>
        {courses.map((course, index) => (
          <CourseItem course={course} key={index} />
        ))}
      </div>
    </div>
  );
};

export default MyCoursePage;
