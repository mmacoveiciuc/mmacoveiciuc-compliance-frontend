import { TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "./ui/skeleton";

interface Props {
  rows: number;
  columns: number;
}

export default function SkeletonTableBody({ rows, columns }: Props) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton className="h-[20px]" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
