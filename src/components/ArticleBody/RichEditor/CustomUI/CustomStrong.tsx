import { ComponentProps } from "react";

type CustomStrongProps = ComponentProps<'strong'>;

const CustomStrong = ({ children, ...restProps }: CustomStrongProps) => {
  return (
    <strong {...restProps} className="highlight font-normal">{children}</strong>
  )
}
export default CustomStrong;