import { cltw } from "@/util";

type ChipProps = {
  label: string;
  classes?: string;
}

const Chip = ({ label, classes = "" }: ChipProps) => {
  return (
    <p className={cltw("rounded-full min-w-20 text-center",classes)}>{label}</p>
  )
}
export default Chip;