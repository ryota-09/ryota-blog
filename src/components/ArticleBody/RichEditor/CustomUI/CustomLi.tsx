import { type HTMLAttributes } from "react";

type CustomUlProps = HTMLAttributes<HTMLLIElement>


const CustomLi = ({ children, ...RestProps }: CustomUlProps) => {

  return (
    <li {...RestProps} className="list-disc marker:text-gray-500">
      {children}
    </li>
  );
};

export default CustomLi;