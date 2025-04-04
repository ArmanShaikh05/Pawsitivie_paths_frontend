import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DISLIKE_PET } from "@/constants/routes";
import { useToast } from "@/hooks/use-toast";
import { setUserDetails } from "@/redux/reducers/userDetailsSlice";
import { useGlobalVariables } from "@/utils/useContext";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import { useState } from "react";
import { IoEllipsisVertical } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

const FavouritePets = () => {
  const { favouritePetsData, favouritePetsForceUpdate } = useGlobalVariables();
  const userData = useSelector((state) => state.userDetailReducer.userData);
  const dispatch = useDispatch();

  const removeFromWishlist = async (petId) => {
    try {
      const cancelToken = axios.CancelToken.source();
      const { data: wishlistData } = await axios.get(
        `${DISLIKE_PET}?userId=${userData?._id}&petId=${petId}`,
        {
          cancelToken: cancelToken.token,
        }
      );
      if (wishlistData) {
        dispatch(setUserDetails(wishlistData.data));
        favouritePetsForceUpdate();
        toast({
          title: "Pet removed from whishlist",
        });
      }
    } catch (error) {
      if (axios.isCancel(error)) return;
    }
  };

  const columns = [
    {
      accessorKey: "id",
      header: "Id",
      id: "id", // Explicit id added here
    },
    {
      accessorKey: "petImg",
      header: "Pet Image",
      cell: ({ row }) => (
        <img
          src={row.getValue("petImg")}
          alt="Pet"
          className="h-[3rem] w-[5rem] object-cover rounded-sm"
        />
      ),
    },
    {
      accessorKey: "petName",
      header: "Pet Name",
      id: "petName", // Explicit id added
    },
    {
      accessorKey: "petAge",
      header: "Pet Age",
      id: "petAge", // Explicit id added
    },
    {
      accessorKey: "price",
      header: "Price",
      id: "price", // Explicit id added
      cell: ({ row }) => {
        const amount = parseInt(row.getValue("price"));
        const formatted = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(amount);

        return <div>{formatted}</div>;
      },
    },
    {
      id: "actions", // Explicit id added
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-gray-500">
              <IoEllipsisVertical size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <span
                className="text-center"
                onClick={() => removeFromWishlist(row.original.petId)}
              >
                Remove
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const { toast } = useToast();
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });

  const table = useReactTable({
    data: favouritePetsData,
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
              placeholder="Search pets..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
            <div className="flex space-x-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Empty</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        toast({
                          description: "Pets whishlist emptied successfully",
                        })
                      }
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* ShadCN Table */}
          <Table className="w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="p-2 border-b border-gray-700 cursor-pointer bg-[#3a0751] text-white"
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
                  className="hover:bg-gray-100 cursor-pointer h-20"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="p-2 border-b border-gray-700"
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
        </div>

        {/* ShadCN Pagination Controls */}
        <div className=" flex items-center mt-4 w-full sticky bottom-0">
          <p className="w-[20rem] max-[426px]:hidden">
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
                    table.setPageIndex(
                      table.getState().pagination.pageIndex - 1
                    );
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

export default FavouritePets;
