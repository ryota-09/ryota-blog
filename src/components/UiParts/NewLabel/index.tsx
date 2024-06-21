import { cltw } from "@/util";

type NewLabelProps = {
  className?: string;
}

const NewLabel = ({ className = "" }: NewLabelProps) => {
  return (
    <span className={cltw("rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#FFA500] px-3 py-1 text-xs tracking-widest text-white", className)} data-testid="pw-new-label">
      New
    </span >
  );
}
export default NewLabel;