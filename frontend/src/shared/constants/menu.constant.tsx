import { ROUTE_CONFIG } from "@/shared/configs/route";
import { AiFillMessage } from "react-icons/ai";
import {
  FaBookOpen,
  FaRegCommentDots,
  FaRegStar,
  FaRegUser,
  FaUserGraduate,
} from "react-icons/fa";
import { FiBook, FiUsers } from "react-icons/fi";
import { IoHome } from "react-icons/io5";
import { LuBookOpen, LuFileText, LuLayoutDashboard } from "react-icons/lu";
import { RiCoupon4Line } from "react-icons/ri";
import { TbFileInvoice } from "react-icons/tb";
export const menuItems = [
  {
    url: ROUTE_CONFIG.MANAGE_SYSTEM.DASHBOARD,
    title: "Dashboard",
    icon: <LuLayoutDashboard size={20} />,
  },

  {
    url: ROUTE_CONFIG.MANAGE_COURSE.COURSE,
    title: "Quản lý khóa học",
    icon: <LuBookOpen size={20} />,
  },
  {
    url: ROUTE_CONFIG.MANAGE_SYSTEM.USER,
    title: "Quản lý thành viên",
    icon: <FiUsers size={20} />,
  },
  {
    url: ROUTE_CONFIG.MANAGE_ORDER.ORDER,
    title: "Quản lý đơn hàng",
    icon: <TbFileInvoice size={20} />,
  },
  {
    url: ROUTE_CONFIG.MANAGE_COURSE.COUPON,
    title: "Quản lý coupon",
    icon: <RiCoupon4Line size={20} />,
  },
  {
    url: ROUTE_CONFIG.MANAGE_COURSE.CATEGORY,
    title: "Quản lý danh mục",
    icon: <RiCoupon4Line size={20} />,
  },
  {
    url: ROUTE_CONFIG.MANAGE_COURSE.REVIEW,
    title: "Quản lý đánh giá",
    icon: <FaRegStar size={20} />,
  },
  {
    url: ROUTE_CONFIG.MANAGE_COURSE.COMMENT,
    title: "Quản lý bình luận",
    icon: <FaRegCommentDots size={20} />,
  },
];
export const menuItemsMyProfile = [
  {
    url: ROUTE_CONFIG.MANAGE_PERSONAL.MY_PROFILE,
    title: "Thông tin tài khoản",
    icon: <FaRegUser size={20} />,
  },
  {
    url: ROUTE_CONFIG.MANAGE_PERSONAL.MY_COURSE,
    title: "Khóa học của tôi",
    icon: <LuBookOpen size={20} />,
  },
  {
    url: ROUTE_CONFIG.MANAGE_PERSONAL.MY_ORDER,
    title: "Đơn hàng của tôi",
    icon: <LuFileText size={20} />,
  },
  {
    url: ROUTE_CONFIG.MANAGE_PERSONAL.MY_BLOG,
    title: "Bài viết của tôi",
    icon: <FiBook size={20} />,
  },
];
export const listMenu = [
  {
    title: "Trang chủ",
    link: ROUTE_CONFIG.HOME,
    icon: <IoHome size={20} />,
  },
  {
    title: "Khóa học",
    link: ROUTE_CONFIG.COURSE,
    icon: <FaUserGraduate size={20} />,
  },
  {
    title: "Blog",
    link: ROUTE_CONFIG.BLOG,
    icon: <FaBookOpen size={20} />,
  },
  {
    title: "Liên hệ",
    link: ROUTE_CONFIG.CONTACT,
    icon: <AiFillMessage size={20} />,
  },
];
