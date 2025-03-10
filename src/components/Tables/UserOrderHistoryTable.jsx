/* eslint-disable react/prop-types */
import { StatusBadge } from "@/hooks/get-status-badge";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { DatePickerWithRange } from "../DateRange/SelectDateRange";
import { Input } from "../ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const UserOrderHistoryTable = ({ noOrder, ordersData }) => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });

  const columns = [
    {
      accessorKey: "SNo",
      header: "S.No",
      id: "S.No",
      cell: ({ row }) => (
        <div className="w-15">
          <span>{row.getValue("S.No")}</span>
        </div>
      ),
    },
    {
      accessorKey: "Product",
      header: "Product",
      id: "Product",
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.ProductImage} alt="@shadcn" />
            <AvatarFallback className="bg-gray-300">
              {row.original.ProfileFallback}
            </AvatarFallback>
          </Avatar>
          <span>{row.getValue("Product")}</span>
        </div>
      ),
    },
    {
      accessorKey: "Date",
      header: "Date",
      cell: ({ row }) => (
        <div>
          <span>{row.getValue("Date")}</span>
        </div>
      ),
    },

    {
      accessorKey: "Payment",
      header: "Payment",
      id: "Payment",
      cell: () => {
        return (
          <div>
            <StatusBadge status={"success"} />
          </div>
        );
      },
    },
    {
      accessorKey: "Price",
      header: "Price",
      id: "Price",
      cell: ({ row }) => {
        const amount = parseInt(row.getValue("Price"));
        const formatted = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(amount);

        return <div>{formatted}</div>;
      },
    },
    {
      accessorKey: "Qty",
      header: "Qty",
      id: "Qty",
    },
    {
      accessorKey: "Status",
      header: "Status",
      id: "Status",
      cell: ({ row }) => {
        return (
          <div>
            <StatusBadge status={row.getValue("Status")} />
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: ordersData,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
  });

  return (
    <div className="  p-4 rounded-lg shadow-lg border-2 min-h-[78.5vh] flex flex-col justify-between">
      <div className="flex flex-col">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
          <Input
            type="text"
            placeholder="Search Orders..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
          <DatePickerWithRange />
        </div>

        {/* ShadCN Table */}
        {noOrder ? (
          <div>No Order</div>
        ) : (
          <Table className="w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="p-2 border-b border-gray-700 cursor-pointer bg-[#3a0751] text-white text-center"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() ? (
                        header.column.getIsSorted() === "asc" ? (
                          <span>🔼</span>
                        ) : (
                          <span>🔽</span>
                        )
                      ) : null}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-gray-100 cursor-pointer h-20 "
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="p-2 border-b border-gray-700 text-center"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* ShadCN Pagination Controls */}
      <div className="flex items-center mt-4 w-full ">
        <p className="w-[20rem] hidden md:block">
          Page <b>{table.getState().pagination.pageIndex + 1}</b> of{" "}
          <b>{table.getPageCount()}</b>
        </p>
        <Pagination className={"max-[426px]:p-0"}>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  table.setPageIndex(table.getState().pagination.pageIndex - 1);
                }}
                disabled={!table.getCanPreviousPage()}
              />
            </PaginationItem>
            {table.getPageCount() > 0 && (
              <div className="flex w-28  overflow-x-auto hidden-scrollbar">
                {Array.from({ length: table.getPageCount() }).map(
                  (_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        href="#"
                        isActive={
                          index === table.getState().pagination.pageIndex
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          table.setPageIndex(index);
                        }}
                        className={"border-2"}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
              </div>
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (
                    !(
                      table.getState().pagination.pageIndex + 1 >=
                      table.getPageCount()
                    )
                  ) {
                    table.setPageIndex(
                      table.getState().pagination.pageIndex + 1
                    );
                  }
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default UserOrderHistoryTable;
