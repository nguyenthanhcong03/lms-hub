import React, {useMemo} from "react";
import {Autocomplete, AutocompleteItem} from "@heroui/react";
import {
	Select,
	SelectItem,
	SelectProps as NextUiSelectProps,
} from "@heroui/react";
import {cn} from "@/utils/common";

interface CustomAutoCompleteProps extends Partial<NextUiSelectProps> {
	items?: {label: string; value: string}[];
	classNames?: {
		trigger?: string;
		label?: string;
		[key: string]: string | undefined;
	};
}

const CustomAutoComplete: React.FC<CustomAutoCompleteProps> = ({
	items = [],
	classNames = {},
	...rests
}) => {
	// Merge default classNames with user-provided ones
	const mergedClassNames = useMemo(
		() => ({
			...classNames,
			trigger: cn(
				"h-12 rounded-md border border-gray-200 bg-white px-3 text-sm font-medium outline-none transition-all focus:bg-white",
				classNames.trigger
			),
			label: cn("font-semibold", classNames.label),
		}),
		[classNames]
	);

	return (
		<div className="flex w-full flex-wrap md:flex-nowrap gap-4">
			<Autocomplete className="max-w-xs" label="Select an animal">
				{items.map((item) => (
					<AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
				))}
			</Autocomplete>
		</div>
	);
};

export default CustomAutoComplete;
