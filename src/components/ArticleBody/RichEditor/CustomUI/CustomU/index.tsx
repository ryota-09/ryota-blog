import { ComponentProps } from "react";

type CustomUProps = ComponentProps<'u'>;

const CustomU = ({ children, ...restProps }: CustomUProps) => {
  return (
    <u {...restProps} className="highlight font-normal">{children}</u>
  )
}
export default CustomU