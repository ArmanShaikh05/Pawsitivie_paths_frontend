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
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { View } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import moment from "moment";
import { Card, CardContent } from "../ui/card";
import Invoice from "../InvoiceTemplate/InvoiceTemplate";

const UserOrderHistoryTable = ({ noOrder, updatedData }) => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false);
  const [singleOrderData, setSingleOrderData] = useState(null);

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
      accessorKey: "Products",
      header: "Products",
      id: "Products",
      cell: ({ row }) => (
        <div className="flex items-center justify-start relative">
          {row.original.Products.map((product, index) => (
            <Avatar
              key={index}
              className={`h-8 w-8 absolute border-2 border-gray-500 ${index > 1 ? "hidden":""}`}
              style={{ left: `${20 * index}px` }}
            >
              <AvatarImage src={product} alt="@shadcn" />
              <AvatarFallback className="bg-gray-300">
                {row.original.ProductFallback[index]}
              </AvatarFallback>
            </Avatar>
          ))}
          {row.original.ItemsLeft > 0 && (
            <span
              className={cn(
                "h-8 w-8 text-sm relative z-50 bg-white text-gray-500 border-2 border-gray-500 flex items-center justify-center rounded-full",
                row.original.Products.length === 1 ? "ml-[25px]" : "ml-[45px]"
              )}
            >
              {row.original.ItemsLeft}+
            </span>
          )}
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
      accessorKey: "Total",
      header: "Total",
      id: "Total",
      cell: ({ row }) => {
        const amount = parseInt(row.getValue("Total"));
        const formatted = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(amount);

        return <div>{formatted}</div>;
      },
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
    {
      id: "actions", // Explicit id added
      header: "Actions",
      cell: ({ row }) => (
        <Button
          onClick={() => {
            setOpenViewDialog(true);
            setSingleOrderData(row.original.Orderdata);
          }}
          className="flex items-center text-xs gap-1 py-2 px-2.5"
        >
          <View size={14} /> View
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data: updatedData,
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
                  className=" h-20 "
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

      {/* View Order Items Dialog */}
      <AlertDialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
        <AlertDialogContent className="w-[55rem] max-w-full ">
          <AlertDialogHeader>
            <AlertDialogTitle asChild>
              <div className="w-full flex justify-between items-center">
                <h1 className="text-xl font-bold ">{`Order ID: #${singleOrderData?._id
                  .toString()
                  .slice(18)}`}</h1>
                <div className="flex flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setOpenViewDialog(false)}
                  >
                    Go Back
                  </Button>
                </div>
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div></div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="p-2 w-full mx-auto bg-gray-50 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-500">{`Order date: ${moment(
                singleOrderData?.createdAt
              ).format("MMMM Do YYYY")}`}</p>
            </div>

            <div className="flex gap-2 mb-6">
                <Button variant="primary" onClick={() => setOpenInvoiceDialog(true)}>View Invoice</Button>
              </div>

            <Card className="divide-y divide-gray-200">
              <CardContent className="overflow-y-auto h-[22rem] max-h-[22rem]">
                {singleOrderData?.products?.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 py-4">
                    <span>{index + 1}</span>
                    <img
                      src={item.productId.productImages?.[0]?.url}
                      alt={item.productId.productName}
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {item.productId.productName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.shopId?.shopName}
                      </p>

                      <p className="text-sm text-gray-500">
                        {item.productId.productCategory +
                          " | " +
                          item.productId.petType}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-800">
                        {item.productId.productPrice}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.productQty}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
                <div>
                  <h2 className="font-medium text-gray-800 mb-2">
                    Customer Details
                  </h2>
                  <p className="text-gray-600">
                    {singleOrderData?.userId.userName}
                  </p>
                  <p className="text-gray-600">
                    {singleOrderData?.userId.email}
                  </p>
                </div>
                <div>
                  <h2 className="font-medium text-gray-800 mb-2">Delivery</h2>
                  <p className="text-gray-600">{`${singleOrderData?.userId.shippingAddress.city} | ${singleOrderData?.userId.shippingAddress.state}`}</p>
                  <p className="text-gray-600">
                    {singleOrderData?.userId.shippingAddress.pincode}
                  </p>
                </div>
              </div> */}
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Show Invoice */}
      <AlertDialog open={openInvoiceDialog} onOpenChange={setOpenInvoiceDialog}>
        <AlertDialogContent className="w-[55rem] max-w-full ">
          <AlertDialogHeader>
            <AlertDialogTitle asChild>
              <div></div>
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div></div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="p-2 w-full h-[80vh] overflow-auto mx-auto bg-gray-50 rounded-lg shadow-md">
            <Invoice setOpenInvoiceDialog={setOpenInvoiceDialog} orderData={singleOrderData}/>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserOrderHistoryTable;
