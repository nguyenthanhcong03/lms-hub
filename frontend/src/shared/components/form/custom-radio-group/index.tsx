import { Radio, RadioGroup, RadioGroupProps } from "@heroui/react";

interface CustomRadioGroupProps extends Partial<RadioGroupProps> {
  items: {
    label: string;
    value: string;
  }[];
}

const CustomRadioGroup = ({ items, ...rests }: CustomRadioGroupProps) => {
  return (
    <RadioGroup
      {...rests}
      orientation="horizontal"
      classNames={{
        label: "font-bold text-sm text-black",
        base: "gap-1.5",
      }}
    >
      {items.map((item) => (
        <Radio key={item.value} value={item.value}>
          <span className="text-sm">{item.label}</span>
        </Radio>
      ))}
    </RadioGroup>
  );
};

export default CustomRadioGroup;
