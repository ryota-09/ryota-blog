import { cltw } from "@/util";

const MAX_LENGTH = 20;

type ChipProps = {
  label: string;
  classes?: string;
}

const Chip = ({ label, classes = "" }: ChipProps) => {
  return (
    <p className={cltw("rounded-full min-w-20 text-center", classes)}>{label.length < MAX_LENGTH ? label : label.slice(0, MAX_LENGTH) + "..."}</p>
  )
}
export default Chip;