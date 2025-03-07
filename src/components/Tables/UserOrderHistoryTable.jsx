/* eslint-disable react/prop-types */
// import {
//     GET_SINGLE_ORDER_DETAILS
// } from "@/constants/routes";
import { StatusBadge } from "@/hooks/get-status-badge";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
// import axios from "axios";
// import moment from "moment";
import { useState } from "react";
// import { IoEllipsisVertical } from "react-icons/io5";
import { DatePickerWithRange } from "../DateRange/SelectDateRange";
// import Loader from "../Loader/Loader";
// import {
//     AlertDialog,
//     AlertDialogContent,
//     AlertDialogDescription,
//     AlertDialogHeader,
//     AlertDialogTitle,
// } from "../ui/alert-dialog";
// import { Button } from "../ui/button";
// import { Card, CardContent } from "../ui/card";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
// } from "../ui/dropdown-menu";
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

const UserOrderHistoryTable = ({noOrder,ordersData}) => {
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
    // const [openViewDialog, setOpenViewDialog] = useState(false);
    // const [singleOrderData, setSingleOrderData] = useState();
    // const [loadingOrderData, setLoadingOrderData] = useState(false);
  
    // const OpenViewOrder = async (orderId) => {
    //   setOpenViewDialog(true);
    //   setLoadingOrderData(true);
    //   try {
    //     const cancelToken = axios.CancelToken.source();
    //     const { data } = await axios.get(
    //       `${GET_SINGLE_ORDER_DETAILS}/${orderId}`,
    //       {
    //         cancelToken: cancelToken.token,
    //       }
    //     );
    //     setSingleOrderData(data.data);
    //   } catch (error) {
    //     if (axios.isCancel(error)) return;
    //     console.log(error);
    //   } finally {
    //     setLoadingOrderData(false);
    //   }
    // };

  
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
    //   {
    //     id: "actions",
    //     header: "Actions",
    //     cell: ({ row }) => (
    //       <DropdownMenu>
    //         <DropdownMenuTrigger asChild>
    //           <Button variant="ghost" className="text-gray-500">
    //             <IoEllipsisVertical size={18} />
    //           </Button>
    //         </DropdownMenuTrigger>
    //         <DropdownMenuContent>
    //           <DropdownMenuItem asChild>
    //             <span
    //               className="text-center cursor-pointer"
    //               onClick={() => OpenViewOrder(row.original.orderId)}
    //             >
    //               View
    //             </span>
    //           </DropdownMenuItem>
    //         </DropdownMenuContent>
    //       </DropdownMenu>
    //     ),
    //   },
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
          <div className="flex justify-between mb-4 gap-4">
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
          <p className="w-[20rem]">
            Page <b>{table.getState().pagination.pageIndex + 1}</b> of{" "}
            <b>{table.getPageCount()}</b>
          </p>
          <Pagination>
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
                <>
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
                </>
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
        {/* <AlertDialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
          {loadingOrderData ? (
            <AlertDialogContent className="w-[55rem] max-w-full flex items-center justify-center">
              <AlertDialogHeader>
                <AlertDialogTitle asChild>
                  <div> </div>
                </AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div></div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Loader />
            </AlertDialogContent>
          ) : (
            <AlertDialogContent className="w-[55rem] max-w-full ">
              <AlertDialogHeader>
                <AlertDialogTitle asChild>
                  <div className="w-full flex justify-between items-center">
                    <h1 className="text-xl font-bold mb-4">{`Order ID: #${singleOrderData?._id
                      .toString()
                      .slice(18)}`}</h1>
                    <Button
                      variant="primary"
                      onClick={() => setOpenViewDialog(false)}
                    >
                      Go Back
                    </Button>
                  </div>
                </AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div></div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="p-6 w-full mx-auto bg-gray-50 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-gray-500">{`Order date: ${moment(
                    singleOrderData?.createdAt
                  ).format("MMMM Do YYYY")}`}</p>
                </div>
  
                {/* <div className="flex gap-2 mb-6">
                  <Button variant="outline">Invoice</Button>
                  <Button variant="primary">Track order</Button>
                </div> */}
  
                {/* <Card className="divide-y divide-gray-200">
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
                </Card> */}
  
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
                </div>
              </div>
            </AlertDialogContent>
          )}
        </AlertDialog> */} 
      </div>
    );
}

export default UserOrderHistoryTable