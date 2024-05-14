
type ChipProps = {
  label: string;
}

const Chip = ({ label }: ChipProps) => {
  return (
    <p className="bg-gray-200 rounded-full px-3 py-2 text-sm text-txt-base hover:opacity-60">{label}</p>
  )
}
export default Chip;