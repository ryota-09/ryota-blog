import { type ComponentProps } from "react";

type CustomUlProps = ComponentProps<"li">

const CustomLi = ({ children, ...RestProps }: CustomUlProps) => {

  return (
    <li {...RestProps} className="list-disc marker:text-gray-500 dark:text-gray-300">
      {children}
    </li>
  );
};

export default CustomLi;