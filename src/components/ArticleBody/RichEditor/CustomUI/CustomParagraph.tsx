import { type HTMLAttributes } from "react";

type CustomparagraphProps = HTMLAttributes<HTMLParagraphElement>


const CustomParagraph = ({ children, ...RestProps }: CustomparagraphProps) => {

  return (
    <p {...RestProps} className="text-md text-txt-base leading-relaxed tracking-wider">
      {children}
    </p>
  );
};

export default CustomParagraph;