"use client";
import {Card, Skeleton} from "@heroui/react";
import React from "react";

const CardSkeleton = () => {
	return (
		<Card className="w-full  space-y-5 p-4" radius="lg">
			<Skeleton className="rounded-lg">
				<div className="h-48 rounded-lg bg-default-300" />
			</Skeleton>
			<div className="space-y-4">
				<Skeleton className="w-3/5 rounded-lg">
					<div className="h-3 w-3/5 rounded-lg bg-default-200" />
				</Skeleton>
				<Skeleton className="w-4/5 rounded-lg">
					<div className="h-3 w-4/5 rounded-lg bg-default-200" />
				</Skeleton>
				<div className="w-full flex items-center justify-between ">
					<Skeleton className="h-3 w-1/5 rounded-lg" />
					<Skeleton className="h-3 w-1/5 rounded-lg" />
					<Skeleton className="h-3 w-1/5 rounded-lg" />
				</div>
			</div>
			<Skeleton className="w-full rounded-lg">
				<div className="h-10 rounded-lg bg-default-300" />
			</Skeleton>
		</Card>
	);
};

export default CardSkeleton;
