import type {
  ColumnDef,
  SortingState} from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { ArrowUpDown, ChevronDown, ChevronUp, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearch } from '../../../store/search';
import { useBlips, type BlipColumn } from '../../../store/blips';
import ActionsMenu from './ActionsMenu';
import { cn } from '../../../utils/cn';

const BlipTable: React.FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const globalFilter = useSearch((state) => state.debouncedValue);
  const data = useBlips((state) => state.blips);

  const columns = useMemo<ColumnDef<BlipColumn>[]>(
    () => [
      {
        id: 'id',
        header: 'ID',
        accessorKey: 'id',
        cell: (info) => (
          <span className="font-mono text-text-tertiary text-xs">#{String(info.getValue()).padStart(3, '0')}</span>
        ),
        enableHiding: false,
        enableGlobalFilter: false,
      },
      {
        id: 'name',
        header: 'Name',
        accessorKey: 'name',
        cell: (info) => <span className="text-text-primary font-medium">{info.getValue() as string}</span>,
        enableHiding: false,
      },
      {
        id: 'zone',
        header: 'Zone',
        accessorKey: 'zone',
        cell: (info) => <span className="text-text-secondary">{info.getValue() as string}</span>,
        enableHiding: false,
      },
      {
        id: 'options-menu',
        cell: (data) => <ActionsMenu data={data} />,
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageSize: 8,
        pageIndex: 0,
      },
    },
    state: {
      sorting,
      globalFilter,
    },
    onGlobalFilterChange: useSearch((state) => state.setValue),
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    table.setPageIndex(currentPage - 1);
  }, [currentPage, data]);

  const pageCount = table.getPageCount();

  return (
    <div className="flex flex-col justify-between items-center h-full pb-4 px-2">
      {table.getFilteredRowModel().rows.length > 0 ? (
        <div className="w-full overflow-hidden">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-border">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="text-left px-4 py-2.5">
                      <button
                        onClick={header.column.getToggleSortingHandler()}
                        className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-text-tertiary hover:text-text-secondary transition-colors"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === 'desc' ? (
                          <ChevronDown size={12} />
                        ) : header.column.getIsSorted() === 'asc' ? (
                          <ChevronUp size={12} />
                        ) : !header.column.getCanHide() ? (
                          <ArrowUpDown size={12} className="opacity-40" />
                        ) : null}
                      </button>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border/50 hover:bg-glass-hover transition-colors group"
                >
                  {row.getAllCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2.5 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-3 text-text-tertiary">
          <Search size={40} strokeWidth={1.5} />
          <span className="text-base font-medium">No results found</span>
        </div>
      )}

      {pageCount > 1 && (
        <div className="flex items-center gap-1 mt-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-glass-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={cn(
                'w-7 h-7 rounded-md text-xs font-medium transition-all',
                page === currentPage
                  ? 'bg-px-600 text-white'
                  : 'text-text-tertiary hover:text-text-primary hover:bg-glass-hover'
              )}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(pageCount, p + 1))}
            disabled={currentPage === pageCount}
            className="p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-glass-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default BlipTable;
