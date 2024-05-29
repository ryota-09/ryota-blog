import { type ComponentProps } from "react";

type CustomUlProps = ComponentProps<"ul">


const CustomUl = ({ children, ...RestProps }: CustomUlProps) => {

  return (
    <ul {...RestProps} className="px-8 my-4">
      {children}
    </ul>
  );
};

export default CustomUl;