import React from "react";
import UserLayout from "./user-layout";

interface TLayoutWrapperProps {
	children: React.ReactNode;
	getLayout?: (children: React.ReactNode) => React.ReactNode;
}

const LayoutWrapper = ({children, getLayout}: TLayoutWrapperProps) => {
	return (
		<>{getLayout ? getLayout(children) : <UserLayout>{children}</UserLayout>}</>
	);
};

export default LayoutWrapper;
