import { cltw } from "@/util";
import { CODE_BLOCK_STYLES } from "../constants";

type TooltipProps = {
  text: string;
  isVisible: boolean;
  className?: string;
};

const Tooltip = ({ text, isVisible, className }: TooltipProps) => {
  return (
    <span
      role="tooltip"
      aria-hidden={!isVisible}
      className={cltw(
        CODE_BLOCK_STYLES.tooltip,
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}
    >
      {text}
    </span>
  );
};

export default Tooltip;