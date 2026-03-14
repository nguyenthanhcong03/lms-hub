import { LIST_PER_PAGES } from "@/shared/constants";
import CustomSelect from "../form/custom-select";

type SelectPerPageProps = {
  limit: number | string;
  onchange: (value: string) => void;
};

const SelectPerPage = ({ limit, onchange }: SelectPerPageProps) => {
  return (
    <CustomSelect
      selectedKeys={[limit.toString()]}
      onChange={(e) => onchange(e.target.value)}
      placeholder=""
      classNames={{
        trigger: "h-10 w-[70px]",
      }}
      items={LIST_PER_PAGES}
      disallowEmptySelection
    />
  );
};

export default SelectPerPage;
