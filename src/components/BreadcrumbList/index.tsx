import BreadcrumbItem from "@/components/BreadcrumbList/BreadcrumbItem";
import type { BreadcrumbItemType } from "@/types";

type BreadcrumbListProps = {
  items: BreadcrumbItemType[];
}

const BreadcrumbList = ({ items }: BreadcrumbListProps) => {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5">
        {items.map((item, index) => (
          <BreadcrumbItem key={index} href={item.href} label={item.label} isLast={index === items.length - 1} />
        ))}
      </ol>
    </nav>
  )
}
export default BreadcrumbList;