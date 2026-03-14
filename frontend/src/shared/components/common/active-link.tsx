"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";

interface ActiveLinkProps {
	url: string;
	children: React.ReactNode;
}
const ActiveLink = ({children, url}: ActiveLinkProps) => {
	const pathname = usePathname();
	const isActive = url === pathname;

	return (
		<Link
			href={url}
			className={`text-base flex items-center gap-3  text-slate-600  hover:border-r-[5px] border-primary  px-8 py-4 transition-all
        
        ${
					isActive
						? " bg-primary/10 font-semibold !text-primary border-r-[5px]"
						: "hover:!bg-primary/10 hover:!text-primary"
				}`}
		>
			{children}
		</Link>
	);
};

export default ActiveLink;
