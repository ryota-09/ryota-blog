import { type HTMLAttributes } from "react";

type CustomUlProps = HTMLAttributes<HTMLUListElement>


const CustomUl = ({ children, ...RestProps }: CustomUlProps) => {

  return (
    <ul {...RestProps} className="px-8 my-4">
      {children}
    </ul>
  );
};

export default CustomUl;