"use client";
import {Accordion, AccordionItem, Avatar} from "@heroui/react";
import React from "react";
import {FaCircleCheck} from "react-icons/fa6";
import {MdOutlineSlowMotionVideo} from "react-icons/md";
const SidebarCourse = () => {
	const defaultContent = (
		<div>
			{new Array(5).fill(0).map((_, index) => (
				<div
					key={index}
					className="border-b  cursor-pointer  last:border-b-0 flex items-center justify-between pl-4 p-2  hover:bg-primary/10  hover:border-l-4 hover:border-l-indigo-500 transition-all"
				>
					<div className="flex flex-col gap-1 ">
						<p className="font-semibold text-default-900">1.1 Giới thiệu</p>
						<p className="text-xs text-default-500 flex items-center gap-1">
							<span className="text-primary">
								<MdOutlineSlowMotionVideo size={16} />
							</span>{" "}
							21:39
						</p>
					</div>
					<span className="text-primary">
						<FaCircleCheck size={16} />
					</span>
				</div>
			))}
		</div>
	);
	const itemClasses = {
		title: "text-base font-bold text-default-900",
		base: "p-0",

		trigger:
			"px-2 py-2.5 bg-slate-50 data-[hover=true]:bg-default-100 cursor-pointer ",
		indicator: "text-medium",
		content: "text-small  p-0",
	};
	return (
		<nav className="bg-white shadow-xl  lg:block fixed top-0 right-0 w-[300px]   overflow-y-auto scrollbar-custom">
			<div className="p-4  font-bold text-base fixed top-0 right-0 w-[300px] border-b h-14 bg-white z-10">
				Nội dung khóa học
			</div>

			<div className="h-[calc(100vh-114px)] mt-14 ">
				<Accordion
					className="p-0 "
					itemClasses={itemClasses}
					selectionMode="multiple"
					motionProps={{
						variants: {
							enter: {
								y: 0,
								opacity: 1,
								height: "auto",
								overflowY: "unset",
								transition: {
									height: {
										type: "spring",
										stiffness: 500,
										damping: 30,
										duration: 1,
									},
									opacity: {
										easings: "ease",
										duration: 1,
									},
								},
							},
							exit: {
								y: -10,
								opacity: 0,
								height: 0,
								overflowY: "hidden",
								transition: {
									height: {
										easings: "ease",
										duration: 0.25,
									},
									opacity: {
										easings: "ease",
										duration: 0.3,
									},
								},
							},
						},
					}}
				>
					{new Array(10).fill(0).map((_, index) => (
						<AccordionItem
							key={index}
							aria-label="Chung Miller"
							subtitle={
								<div className="text-xs text-default-500 font-medium">
									<span>5</span>/<span>8</span> | 21:39
								</div>
							}
							title="1. bắt đầu"
						>
							{defaultContent}
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</nav>
	);
};

export default SidebarCourse;
