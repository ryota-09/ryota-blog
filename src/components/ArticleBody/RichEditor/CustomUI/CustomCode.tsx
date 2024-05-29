import { type ComponentProps } from "react";

type CustomCodeProps = ComponentProps<"code">

const CustomCode = ({ children, ...restProps }: CustomCodeProps) => {
  return (
    <code {...restProps}>{children}</code>
  );
}
export default CustomCode