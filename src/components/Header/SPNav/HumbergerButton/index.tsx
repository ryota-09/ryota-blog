"use client"

type HumbergerButtonProps = {
  isOpen: boolean;
  onClick: () => void;
}

const HumbergerButton = ({ isOpen, onClick }: HumbergerButtonProps) => {
  return (
    <button onClick={onClick} type="button" className="z-20 space-y-2">
      <div className={isOpen ? 'w-8 h-0.5 bg-gray-600 translate-y-2.5 rotate-45' : 'w-8 h-0.5 bg-gray-600'} />
      <div className={isOpen ? 'opacity-0' : 'w-8 h-0.5 bg-gray-600'} />
      <div className={isOpen ? 'w-8 h-0.5 bg-gray-600 -rotate-45' : 'w-8 h-0.5 bg-gray-600'} />
    </button>
  )
}

export default HumbergerButton