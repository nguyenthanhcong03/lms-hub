import { Switch, SwitchProps } from "@heroui/react";
import React from "react";
interface CustomSwitchProps extends Partial<SwitchProps> {
  label?: string;
}
const CustomSwitch = ({ label, ...rests }: CustomSwitchProps) => {
  return (
    <Switch
      classNames={{
        label: "text-sm font-bold",
      }}
      {...rests}
    >
      {label}
    </Switch>
  );
};

export default CustomSwitch;
