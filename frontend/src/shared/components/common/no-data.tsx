// ** Next.js Imports
import Image from "next/image";

type TProps = {
	widthImage?: string;
	heightImage?: string;
	textNodata?: string;
};

const NoData = (props: TProps) => {
	const {
		widthImage = "w-[120px]",
		heightImage = "h-[120px]",
		textNodata = "Không có dữ liệu",
	} = props;

	return (
		<div className="flex flex-col items-center justify-center h-full w-full">
			<div className={`${widthImage} ${heightImage} relative`}>
				<Image src="/images/no-data.png" alt="No data" fill />
			</div>
			<p className="mt-2 text-center whitespace-nowrap">{textNodata}</p>
		</div>
	);
};

export default NoData;
