import { type HTMLAttributes } from "react";

type CustomparagraphProps = HTMLAttributes<HTMLHeadingElement>


const CustomParagraph = ({ children, ...RestProps }: CustomparagraphProps) => {

  return (
    <p {...RestProps} className="text-sm text-txt-base leading-normal tracking-wider">
      {children}
    </p>
  );
};

export default CustomParagraph;