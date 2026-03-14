"use client";
import { getRevenueByMonth } from "@/shared/services/report";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const MonthlySalesChart = () => {
  const [months, setMonths] = useState<number[]>([]);
  const [revenues, setRevenues] = useState<(number | null)[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getRevenueByMonth();
        const rawData: { month: number; total: number }[] = result?.data || [];

        setMonths(rawData.map((item) => item.month));

        setRevenues(
          rawData.map((item) =>
            item.total === 0 ? null : Number(item.total.toFixed(2)),
          ),
        );
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    };

    fetchData();
  }, []);

  const options: ApexOptions = {
    colors: ["#7367F0"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        // columnWidth: "59%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: months,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: {
        text: undefined,
      },
      labels: {
        formatter: (val: number) =>
          val
            ? new Intl.NumberFormat("en-US", {
                maximumFractionDigits: 2,
              }).format(val)
            : "0",
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) =>
          val
            ? new Intl.NumberFormat("en-US", {
                maximumFractionDigits: 2,
              }).format(val)
            : "0",
      },
    },
  };

  const series = [
    {
      name: "Sales",
      data: revenues,
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Monthly Sales
        </h3>
      </div>

      <div className="custom-scrollbar max-w-full overflow-x-auto">
        <div className="-ml-5 min-w-[650px] pl-2 xl:min-w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={180}
          />
        </div>
      </div>
    </div>
  );
};

export default MonthlySalesChart;
