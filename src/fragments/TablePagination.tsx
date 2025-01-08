import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { GuruType, RuanganType, SiswaType, Generation } from "@/types/table";
import { memo } from "react";

interface TablePaginationProps {
  table: Table<GuruType | RuanganType | SiswaType | Generation>;
}

export const TablePagination = memo(function TablePagination({
  table,
}: TablePaginationProps) {
  const { pageIndex } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const canPreviousPage = table.getCanPreviousPage();
  const canNextPage = table.getCanNextPage();

  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(0)}
          disabled={!canPreviousPage}
          aria-label="First page"
        >
          <ChevronsLeft className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!canPreviousPage}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!canNextPage}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(pageCount - 1)}
          disabled={!canNextPage}
          aria-label="Last page"
        >
          <ChevronsRight className="size-4" />
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">
          Page {pageIndex + 1} of {pageCount}
        </p>
      </div>
    </div>
  );
});
