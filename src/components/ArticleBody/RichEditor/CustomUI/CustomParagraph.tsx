import { type ComponentProps } from "react";

type CustomparagraphProps = ComponentProps<"p">


const CustomParagraph = ({ children, ...RestProps }: CustomparagraphProps) => {

  return (
    <p {...RestProps} className="text-md text-txt-base dark:text-gray-400 leading-relaxed tracking-wider">
      {children}
    </p>
  );
};

export default CustomParagraph;