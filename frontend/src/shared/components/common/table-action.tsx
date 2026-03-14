import React from "react";

const TableAction = ({children}: {children: React.ReactNode}) => {
	return <div className="flex gap-3 justify-center">{children}</div>;
};

export default TableAction;
