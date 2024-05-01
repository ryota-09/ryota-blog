"use client"
import HumbergerButton from "@/components/Header/SPNav/HumbergerButton";

type NavDrowerProps = {
  isOpen: boolean;
  onClick: () => void;
}

const NavDrower = ({ isOpen, onClick }: NavDrowerProps) => {
  return (
    <nav
      className={
        isOpen
          ? 'text-left fixed bg-slate-50 right-0 top-0 w-8/12 h-screen flex flex-col justify-start pt-8 px-3 z-0'
          : 'fixed right-[-100%] z-0'
      }
    >
      <HumbergerButton isOpen={isOpen} onClick={onClick} />
      <ul className="mt-6">
             {/* // 省略 */}
      </ul>
    </nav>
  )
}

export default NavDrower;