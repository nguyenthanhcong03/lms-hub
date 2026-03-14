import { Switch, SwitchProps } from "@heroui/react";
import React from "react";
interface SwitchFieldProps extends Partial<SwitchProps> {
  label?: string;
}
const SwitchField = ({ label, ...rests }: SwitchFieldProps) => {
  return (
    <Switch
      classNames={{
        label: "text-sm font-semibold ",
      }}
      {...rests}
    >
      {label}
    </Switch>
  );
};

export default SwitchField;
