
type ChipProps = {
  label: string;
}

const Chip = ({ label }: ChipProps) => {
  return (
    <label className="bg-gray-200 rounded-full px-3 py-2 text-sm text-txt-base">{label}</label>
  )
}
export default Chip;