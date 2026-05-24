import { cltw } from "@/util";

const MAX_LENGTH = 20;

type ChipProps = {
  label: string;
  classes?: string;
  // 20文字超のラベルでも省略せずに表示する場合は true
  noTruncate?: boolean;
}

const Chip = ({ label, classes = "", noTruncate = false }: ChipProps) => {
  // noTruncate なら常に元のラベル、それ以外は20文字超で省略
  const displayLabel = noTruncate || label.length < MAX_LENGTH
    ? label
    : label.slice(0, MAX_LENGTH) + "...";
  return (
    <p className={cltw("rounded-full min-w-20 text-center", classes)}>{displayLabel}</p>
  )
}
export default Chip;