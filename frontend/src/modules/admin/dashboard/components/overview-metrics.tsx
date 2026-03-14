"use client";

import { LabelStatus } from "@/shared/components/common/label-status";
import { getReportMetrics } from "@/shared/services/report";
import { useEffect, useState } from "react";
import {
  FaBook,
  FaDollarSign,
  FaEye,
  FaLongArrowAltDown,
  FaLongArrowAltUp,
  FaShoppingCart,
  FaStar,
  FaUser,
} from "react-icons/fa";

type Metric = {
  total: number;
  change?: number;
  trend?: "asc" | "desc" | "neutral";
};

type ReportData = {
  users: Metric;
  orders: Metric;
  reviews: Metric;
  views: Metric;
  sales: Metric;
  courses: Metric;
};

export const ReportOverview = () => {
  const [data, setData] = useState<ReportData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getReportMetrics();
        setData(result?.data);
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    };

    fetchData();
  }, []);

  const cards = [
    {
      title: "Học viên",
      icon: <FaUser size={22} />,
      key: "users",
    },
    {
      title: "Đơn hàng",
      icon: <FaShoppingCart size={22} />,
      key: "orders",
    },
    {
      title: "Đánh giá",
      icon: <FaStar size={22} />,
      key: "reviews",
    },
    {
      title: "Lượt xem",
      icon: <FaEye size={22} />,
      key: "views",
    },
    {
      title: "Bán hàng",
      icon: <FaDollarSign size={22} />,
      key: "sales",
    },
    {
      title: "Khóa học",
      icon: <FaBook size={22} />,
      key: "courses",
    },
  ];

  return (
    <div className="grid grid-cols-12 gap-8 rounded-lg bg-gray-50 p-6 pt-10">
      {data &&
        cards.map((card, i) => {
          const metric = data[card.key as keyof ReportData];

          return (
            <div key={i} className="col-span-12 sm:col-span-6 lg:col-span-4">
              <div className="relative flex flex-col rounded-lg border bg-white p-4 text-gray-700 shadow-md">
                <div className="absolute -top-6 left-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow">
                  {card.icon}
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    {"change" in metric && "trend" in metric && (
                      <div className="font-bold">
                        <LabelStatus
                          color={
                            metric.trend === "asc"
                              ? "success"
                              : metric.trend === "desc"
                                ? "danger"
                                : "default"
                          }
                          startContent={
                            metric.trend === "asc" ? (
                              <FaLongArrowAltUp className="text-xs" />
                            ) : (
                              <FaLongArrowAltDown />
                            )
                          }
                        >
                          {metric.change}%
                        </LabelStatus>
                      </div>
                    )}
                  </div>
                  <div className="pt-6 text-right">
                    <p className="text-sm font-medium capitalize">
                      {card.title}
                    </p>
                    <h3 className="text-2xl font-semibold">{metric.total}</h3>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};
