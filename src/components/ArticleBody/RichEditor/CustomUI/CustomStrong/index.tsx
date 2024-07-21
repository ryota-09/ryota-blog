import { ComponentProps } from "react";

type CustomStrongProps = ComponentProps<'strong'>;

const CustomStrong = ({ children, ...restProps }: CustomStrongProps) => {
  return (
    <strong {...restProps} className="font-sans font-[1000] text-black">{children}</strong>
  )
}
export default CustomStrong;