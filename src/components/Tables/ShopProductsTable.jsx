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
import {
  CREATE_SHOP_PRODUCTS,
  EDIT_PRODUCTS_DATA,
  GET_PRODUCTS_DATA,
  REMOVE_PRODUCT,
} from "@/constants/routes";
import { useToast } from "@/hooks/use-toast";
import { setUserDetails } from "@/redux/reducers/userDetailsSlice";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import { useRef, useState } from "react";
import { IoEllipsisVertical } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import Loader from "../Loader/Loader";
import { useGlobalVariables } from "@/utils/useContext";

// eslint-disable-next-line react/prop-types
const ShopProductsTable = ({ ShopProductData, forceUpdate }) => {
  const imagesRef = useRef();
  const editImagesRef = useRef();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const {shopChartForceUpdate} = useGlobalVariables()
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [addProductDialog, setAddProductDialog] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const userData = useSelector((state) => state.userDetailReducer.userData);

  //   STATES
  const [productName, setProductName] = useState("");
  const [productSummary, setProductSummary] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [petAge, setPetAge] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [petType, setPetType] = useState("");
  const [productMaterial, setProductMaterial] = useState("");
  const [availableSizes, setavailableSizes] = useState([]);
  const [productCategory, setProductCategory] = useState("");
  //   const [inStock, setInStock] = useState(true);
  const [productQuantity, setProductQuantity] = useState("");

  const [initialImages, setInitialImages] = useState([]);
  const [addedImages, setAddedImages] = useState([]);
  const [addedImageFiles, setAddedImageFiles] = useState([]);
  const [removedImagePublicIds, setRemovedImagePublicIds] = useState([]);
  const [imageLimitError, setImageLimitError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fetchingEditPetData, setFetchingEditProductData] = useState(false);
  const [editProductData, setEditProductData] = useState();
  const [openEditDialog, setOpenEditDialog] = useState(false);

  // EDIT PET DATA STATES
  const [editProductName, setEditProductName] = useState("");
  const [editProductSummary, setEditProductSummary] = useState("");
  const [editProductDescription, setEditProductDescription] = useState("");
  const [editPetAge, setEditPetAge] = useState("");
  const [editProductPrice, setEditProductPrice] = useState("");
  const [editPetType, setEditPetType] = useState("");
  const [editProductMaterial, setEditProductMaterial] = useState("");
  const [editAvailableSizes, setEditAvailableSizes] = useState([]);
  const [editProductCategory, setEditProductCategory] = useState("");
  const [editProductQuantity, setEditProductQuantity] = useState("");
  const [editPetDescription, setEditPetDescription] = useState("");

  const [editInitialImages, seteditInitialImages] = useState([]);
  const [editAddedImages, seteditAddedImages] = useState([]);
  const [editAddedImageFiles, seteditAddedImageFiles] = useState([]);
  const [editRemovedImagePublicIds, seteditRemovedImagePublicIds] = useState(
    []
  );
  const [editImageLimitError, setEditImageLimitError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState("");

  const fetchEditProductData = async (productId) => {
    try {
      setFetchingEditProductData(true);
      setOpenEditDialog(true);

      const { data } = await axios.get(`${GET_PRODUCTS_DATA}/${productId}`);
      if (data) {
        setEditProductData(data.data);
        setEditProductName(data.data?.productName);
        setEditProductDescription(data.data?.productDescription);
        setEditPetAge(data.data?.petAge);
        setEditProductSummary(data.data?.productSummary);
        setEditProductPrice(data.data?.productPrice);
        setEditPetType(data.data?.petType);
        setEditProductMaterial(data.data?.productMaterial);
        setEditAvailableSizes(data.data?.availableSizes);
        setEditProductCategory(data.data?.productCategory);
        setEditProductQuantity(data.data?.productQuantity);
        setEditPetDescription(data.data?.productDescription);
        seteditInitialImages(data.data?.productImages);
      }
    } catch (error) {
      if (axios.isCancel(error)) return setFetchingEditProductData(false);
      console.log(error);
      setFetchingEditProductData(false);
    } finally {
      setFetchingEditProductData(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (productName === "") {
      return toast({
        variant: "destructive",
        title: "Please enter product name",
      });
    } else if (productSummary === "") {
      return toast({
        variant: "destructive",
        title: "Please enter product summary",
      });
    } else if (productDescription === "") {
      return toast({
        variant: "destructive",
        title: "Please enter product description",
      });
    } else if (productPrice === "") {
      return toast({
        variant: "destructive",
        title: "Please enter product price",
      });
    } else if (petAge === "") {
      return toast({
        variant: "destructive",
        title: "Please select pet age",
      });
    } else if (productCategory === "") {
      return toast({
        variant: "destructive",
        title: "Please select product category",
      });
    } else if (petType === "") {
      return toast({ variant: "destructive", title: "Please select pet type" });
    } else if (productQuantity === "") {
      return toast({
        variant: "destructive",
        title: "Please enter product in stock",
      });
    } else if (productMaterial === "") {
      return toast({
        variant: "destructive",
        title: "Please select product material",
      });
    } else if (productCategory === "clothing" && availableSizes.length === 0) {
      return toast({
        variant: "destructive",
        title: "Please select available sizes",
      });
    } else {
      setIsSubmitting(true);
      let dataToSend;
      if (addedImages.length > 0 || removedImagePublicIds.length > 0) {
        dataToSend = new FormData();
        // Append original files (not blobs) to FormData
        addedImageFiles.forEach((file) => {
          dataToSend.append("files", file);
        });

        // Append removed image public_ids
        removedImagePublicIds.forEach((public_id) => {
          dataToSend.append("removedImagePublicIds[]", public_id);
        });
        dataToSend.append("productName", productName);
        dataToSend.append("productDescription", productDescription);
        dataToSend.append("petAge", petAge);
        dataToSend.append("productPrice", productPrice);
        dataToSend.append("petType", petType);
        dataToSend.append("productMaterial", productMaterial);
        availableSizes.forEach((size) => {
          dataToSend.append("availableSizes[]", size);
        });
        dataToSend.append("productCategory", productCategory);
        dataToSend.append("productQuantity", Number(productQuantity));
        dataToSend.append("shopOwnerId", userData?._id);
        dataToSend.append("shopName", userData?.shopName);
        dataToSend.append("productSummary", productSummary);
      } else {
        dataToSend = {
          productName,
          productDescription,
          petAge,
          productPrice,
          petType,
          productMaterial,
          availableSizes,
          productCategory,
          productQuantity: Number(productQuantity),
          shopOwnerId: userData?._id,
          shopName: userData?.shopName,
          productSummary,
        };
      }

      try {
        const cancelToken = axios.CancelToken.source();
        const response = await axios.post(CREATE_SHOP_PRODUCTS, dataToSend, {
          cancelToken: cancelToken.token,
        });
        if (response) {
          toast({
            title: "Product added Successfully",
          });
          dispatch(setUserDetails(response.data.data));
          setIsSubmitting(false);
          setAddProductDialog(false);
          shopChartForceUpdate()
        }
      } catch (error) {
        if (axios.isCancel(error)) return setIsSubmitting(false);
        console.error(error);
        setIsSubmitting(false);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleEditPet = async (e) => {
    e.preventDefault();
    setIsEditing(true);
    let dataToSend;
    if (editAddedImages.length > 0 || editRemovedImagePublicIds.length > 0) {
      dataToSend = new FormData();
      // Append original files (not blobs) to FormData
      editAddedImageFiles.forEach((file) => {
        dataToSend.append("files", file);
      });

      // Append removed image public_ids
      editRemovedImagePublicIds.forEach((public_id) => {
        dataToSend.append("removedImagePublicIds[]", public_id);
      });
      dataToSend.append("productName", editProductName);
      dataToSend.append("productDescription", editProductDescription);
      dataToSend.append("petAge", editPetAge);
      dataToSend.append("productPrice", editProductPrice);
      dataToSend.append("petType", editPetType);
      dataToSend.append("productMaterial", editProductMaterial);
      editAvailableSizes.forEach((size) => {
        dataToSend.append("availableSizes[]", size);
      });
      dataToSend.append("productCategory", editProductCategory);
      dataToSend.append("productQuantity", Number(editProductQuantity));
      dataToSend.append("productSummary", editProductSummary);
    } else {
      dataToSend = {
        productName: editProductName,
        productDescription: editProductDescription,
        petAge: editPetAge,
        productPrice: editProductPrice,
        petType: editPetType,
        productMaterial: editProductMaterial,
        availableSizes: editAvailableSizes,
        productCategory: editProductCategory,
        productQuantity: Number(editProductQuantity),
        productSummary:editProductSummary,
      };
    }

    try {
      const cancelToken = axios.CancelToken.source();
      console.log(userData?._id, editProductData?._id);
      const response = await axios.put(
        `${EDIT_PRODUCTS_DATA}?shopOwnerId=${userData?._id}&productId=${editProductData?._id}`,
        dataToSend,
        {
          cancelToken: cancelToken.token,
        }
      );
      if (response) {
        toast({
          title: "Pet edited Successfully",
        });
        dispatch(setUserDetails(response.data.data));
        forceUpdate();
        setIsEditing(false);
        setOpenEditDialog(false);
      }
    } catch (error) {
      if (axios.isCancel(error)) return setIsEditing(false);
      console.error(error);
      setIsEditing(false);
    } finally {
      setIsEditing(false);
    }
  };

  const handleSelectShopImages = async () => {
    setImageLimitError(false);
    const files = Array.from(imagesRef.current.files);

    if (files.length > 10) return setImageLimitError(true);

    if (files.length > 0) {
      const newPreviews = files.map((file) => URL.createObjectURL(file)); // Create preview URL for each file
      setAddedImages((prevImages) => [...prevImages, ...newPreviews]); // Store blob URL for previews
      setAddedImageFiles((prevFiles) => [...prevFiles, ...files]); // Store actual files for submission
    }
  };

  const handleEditProductImages = async () => {
    setEditImageLimitError(false);
    const files = Array.from(editImagesRef.current.files);

    if (files.length > 10) return setEditImageLimitError(true);

    if (files.length > 0) {
      const newPreviews = files.map((file) => URL.createObjectURL(file)); // Create preview URL for each file
      seteditAddedImages((prevImages) => [...prevImages, ...newPreviews]); // Store blob URL for previews
      seteditAddedImageFiles((prevFiles) => [...prevFiles, ...files]); // Store actual files for submission
    }
  };

  const removeImage = (image, type) => {
    if (type === "initial") {
      // Remove image from initialImages and add its public_id to removedImagePublicIds
      setInitialImages(initialImages.filter((img) => img.url !== image.url));
      setRemovedImagePublicIds((prev) => [...prev, image.public_id]); // Store only public_id
    } else if (type === "added") {
      // Remove image from addedImages and addedImageFiles
      const imageIndex = addedImages.indexOf(image);
      setAddedImages(addedImages.filter((img) => img !== image));
      setAddedImageFiles(
        addedImageFiles.filter((_, index) => index !== imageIndex)
      ); // Remove corresponding file
    }
  };

  const removeEditImage = (image, type) => {
    if (type === "initial") {
      // Remove image from initialImages and add its public_id to removedImagePublicIds
      seteditInitialImages(
        editInitialImages.filter((img) => img.url !== image.url)
      );
      seteditRemovedImagePublicIds((prev) => [...prev, image.public_id]); // Store only public_id
    } else if (type === "added") {
      // Remove image from addedImages and addedImageFiles
      const imageIndex = editAddedImages.indexOf(image);
      seteditAddedImages(addedImages.filter((img) => img !== image));
      seteditAddedImageFiles(
        editAddedImageFiles.filter((_, index) => index !== imageIndex)
      ); // Remove corresponding file
    }
  };

  const removeProduct = async (e) => {
    try {
      e.preventDefault();
      setIsDeleting(true);
      const cancelToken = axios.CancelToken.source();
      const { data } = await axios.delete(
        `${REMOVE_PRODUCT}?productId=${deleteProductId}&shopId=${userData?._id}`,
        { cancelToken: cancelToken.token }
      );
      if (data) {
        toast({
          title: "Pet Removed Successfully",
        });
        setIsDeleting(false);
        setOpenDeleteDialog(close);
        forceUpdate();
        dispatch(setUserDetails(data.data));
      }
    } catch (error) {
      if (axios.isCancel(error)) return setOpenDeleteDialog(close);
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSizeChange = (size) => {
    setavailableSizes((prev) => {
      if (prev.includes(size)) {
        return prev.filter((g) => g !== size);
      } else {
        return [...prev, size];
      }
    });
  };

  const handleEditSizeChange = (size) => {
    setEditAvailableSizes((prev) => {
      if (prev.includes(size)) {
        return prev.filter((g) => g !== size);
      } else {
        return [...prev, size];
      }
    });
  };

  const columns = [
    {
      accessorKey: "id",
      header: "Id",
      id: "id", // Explicit id added here
    },
    {
      accessorKey: "productImg",
      header: "Product Image",
      cell: ({ row }) => (
        <img
          src={row.getValue("productImg")}
          alt="Pet"
          className="h-[3rem] w-[5rem] object-cover rounded-sm"
        />
      ),
    },
    {
      accessorKey: "productName",
      header: "Product Name",
      id: "productName", // Explicit id added
    },
    {
      accessorKey: "productCategory",
      header: "Product Category",
      id: "productCategory", // Explicit id added
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
      accessorKey: "stock",
      header: "Stock",
      id: "stock", // Explicit id added
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
                className="text-center cursor-pointer"
                onClick={() => fetchEditProductData(row.original?.productId)}
              >
                Edit
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <span
                className="text-center cursor-pointer"
                onClick={() => {
                  setOpenDeleteDialog(true);
                  setDeleteProductId(row.original?.productId);
                }}
              >
                Remove
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data: ShopProductData,
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
            <Button
              variant="primary"
              className="px-8"
              onClick={() => {
                setAddProductDialog(true);
              }}
            >
              Add Product
            </Button>
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
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

      {/* Edit pet */}
      <Sheet open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <SheetContent className="overflow-scroll hidden-scrollbar">
          {fetchingEditPetData ? (
            <Loader />
          ) : (
            <>
              <SheetHeader>
                <SheetTitle>Edit Product</SheetTitle>
                <SheetDescription>
                  Edit the details of the product.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col">
                  <div className="flex w-full justify-between items-center">
                    <Label className="text-right text-[1.05rem]">
                      Add images
                    </Label>
                    <Button
                      variant="primary"
                      disabled={
                        editInitialImages.length + editAddedImageFiles.length >
                          9 || editImageLimitError
                      }
                      onClick={() => editImagesRef.current.click()}
                    >
                      Add Images
                    </Button>
                  </div>
                  {editInitialImages.length + editAddedImageFiles.length > 9 ||
                  editImageLimitError ? (
                    <p className="text-[0.78rem] text-red-500">
                      Maximum image limit is 10 images
                    </p>
                  ) : (
                    <p className="text-[0.78rem]">Select upto 10 images</p>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    maxLength={10}
                    onChange={handleEditProductImages}
                    ref={editImagesRef}
                  />
                  <div className="w-full grid grid-cols-3 gap-4 border-2 border-dashed p-2 rounded-[5px] border-black h-[15rem] overflow-scroll hidden-scrollbar">
                    {editInitialImages.length > 0 &&
                      editInitialImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img src={image.url} alt="" />
                          <button
                            className="absolute top-0 right-0 p-1 text-white bg-red-600 rounded-full"
                            onClick={() => removeEditImage(image, "initial")}
                          >
                            <RxCross1 />
                          </button>
                        </div>
                      ))}

                    {editAddedImages.length > 0 &&
                      editAddedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img src={image} alt="" />
                          <button
                            className="absolute top-0 right-0 p-1 text-white bg-red-600 rounded-full"
                            onClick={() => removeEditImage(image, "added")}
                          >
                            <RxCross1 />
                          </button>
                        </div>
                      ))}

                    {editInitialImages.length === 0 &&
                      editAddedImages.length === 0 && <div>No Image</div>}
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Product Name
                  </Label>
                  <Input
                    id="name"
                    value={editProductName}
                    onChange={(e) => setEditProductName(e.target.value)}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right self-start">
                    Short Summary
                  </Label>
                  <Textarea
                    id="name"
                    value={editProductSummary}
                    onChange={(e) => setEditProductSummary(e.target.value)}
                    className="col-span-3"
                    placeholder="Short summary of product"
                    maxLength={200}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right self-start">
                    Product Description
                  </Label>
                  <Textarea
                    id="name"
                    value={editPetDescription}
                    onChange={(e) => setEditPetDescription(e.target.value)}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Product Price
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={editProductPrice}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Only update state if the value is a positive number or an empty string
                      if (value === "" || Number(value) > 0) {
                        setEditProductPrice(value);
                      }
                    }}
                    min="0"
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    For Pet Ages
                  </Label>
                  <Select
                    value={editPetAge}
                    onValueChange={(value) => setEditPetAge(value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select pet age" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="child">child</SelectItem>
                        <SelectItem value="adult">Adult</SelectItem>
                        <SelectItem value="senior">Senior</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Product Category
                  </Label>
                  <Select
                    value={editProductCategory}
                    onValueChange={(value) => setEditProductCategory(value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="petFood">Pet Food</SelectItem>
                        <SelectItem value="grooming">Grooming</SelectItem>
                        <SelectItem value="toys">Toys</SelectItem>
                        <SelectItem value="bedding">Bedding</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Pet Type
                  </Label>
                  <Select
                    value={editPetType}
                    onValueChange={(value) => setEditPetType(value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select pet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="dogs">Dogs</SelectItem>
                        <SelectItem value="cats">Cats</SelectItem>
                        <SelectItem value="birds">Birds</SelectItem>
                        <SelectItem value="fish">Fish</SelectItem>
                        <SelectItem value="samllAnimals">
                          Small Animals
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Stock
                  </Label>
                  <Input
                    type="number"
                    id="username"
                    className="col-span-3"
                    value={editProductQuantity}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Only update state if the value is a positive number or an empty string
                      if (value === "" || Number(value) > 0) {
                        setEditProductQuantity(value);
                      }
                    }}
                    min="0"
                    placeholder="Products in stock"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Product Material
                  </Label>
                  <Select
                    value={editProductMaterial}
                    onValueChange={(value) => setEditProductMaterial(value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="plastic">Plastic</SelectItem>
                        <SelectItem value="rubber">Rubber</SelectItem>
                        <SelectItem value="cotton">Cotton</SelectItem>
                        <SelectItem value="metal">Metal</SelectItem>
                        <SelectItem value="leather">Leather</SelectItem>
                        <SelectItem value="others">Others</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {editProductCategory === "clothing" && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right self-start">
                      Available Sizes
                    </Label>
                    <div className="w-full flex flex-wrap gap-4">
                      <div className="flex items-center space-x-2 ml-6 mb-4">
                        <Checkbox
                          id="XS"
                          checked={editAvailableSizes.includes("XS")}
                          onCheckedChange={() => handleEditSizeChange("XS")}
                        />
                        <label
                          htmlFor="XS"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          XS
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 ml-6 mb-4">
                        <Checkbox
                          id="S"
                          checked={editAvailableSizes.includes("S")}
                          onCheckedChange={() => handleEditSizeChange("S")}
                        />
                        <label
                          htmlFor="S"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          S
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 ml-6 mb-4">
                        <Checkbox
                          id="M"
                          checked={editAvailableSizes.includes("M")}
                          onCheckedChange={() => handleEditSizeChange("M")}
                        />
                        <label
                          htmlFor="M"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          M
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 ml-6 mb-4">
                        <Checkbox
                          id="L"
                          checked={editAvailableSizes.includes("L")}
                          onCheckedChange={() => handleEditSizeChange("L")}
                        />
                        <label
                          htmlFor="L"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          L
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 ml-6 mb-4">
                        <Checkbox
                          id="XL"
                          checked={editAvailableSizes.includes("XL")}
                          onCheckedChange={() => handleEditSizeChange("XL")}
                        />
                        <label
                          htmlFor="XL"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          XL
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button
                    variant="primary"
                    disabled={isEditing}
                    className="w-full mt-4"
                    onClick={handleEditPet}
                  >
                    Edit Pet
                  </Button>
                </SheetClose>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Product Dialog */}
      <AlertDialog open={addProductDialog} onOpenChange={setAddProductDialog}>
        <AlertDialogContent className="w-[55rem] max-w-full ">
          <AlertDialogHeader>
            <AlertDialogTitle>Add New Product</AlertDialogTitle>
            <AlertDialogDescription className="hidden">
              {" "}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4 grid-cols-2">
            <div className="flex flex-col">
              <div className="flex w-full justify-between items-center mb-4">
                <Label className="text-right text-[1.05rem]">Add images</Label>
                <Button
                  variant="primary"
                  disabled={
                    initialImages.length + addedImageFiles.length > 9 ||
                    imageLimitError
                  }
                  onClick={() => imagesRef.current.click()}
                >
                  Add Images
                </Button>
              </div>

              <input
                type="file"
                className="hidden"
                multiple
                maxLength={10}
                onChange={handleSelectShopImages}
                ref={imagesRef}
              />
              <div className="w-full grid grid-cols-3 gap-4 border-2 border-dashed p-2 rounded-[5px] border-black h-[15rem] overflow-scroll hidden-scrollbar mb-2">
                {initialImages.length > 0 &&
                  initialImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img src={image.url} alt="" />
                      <button
                        className="absolute top-0 right-0 p-1 text-white bg-red-600 rounded-full"
                        onClick={() => removeImage(image, "initial")}
                      >
                        <RxCross1 />
                      </button>
                    </div>
                  ))}

                {addedImages.length > 0 &&
                  addedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img src={image} alt="" />
                      <button
                        className="absolute top-0 right-0 p-1 text-white bg-red-600 rounded-full"
                        onClick={() => removeImage(image, "added")}
                      >
                        <RxCross1 />
                      </button>
                    </div>
                  ))}

                {initialImages.length === 0 && addedImages.length === 0 && (
                  <div>No Image</div>
                )}
              </div>
              {initialImages.length + addedImageFiles.length > 9 ||
              imageLimitError ? (
                <p className="text-[0.78rem] text-red-500">
                  Maximum image limit is 10 images
                </p>
              ) : (
                <p className="text-[0.78rem]">Select upto 10 images</p>
              )}
            </div>

            <form className="flex flex-col w-full h-[20rem] overflow-auto gap-4 pl-4 custom-scrollbar pr-[5px]">
              <Label className=" text-[1.05rem]">Enter Product Details</Label>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Product Name
                </Label>
                <Input
                  id="name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="col-span-3"
                  placeholder="Pet name"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right self-start">
                  Short Summary
                </Label>
                <Textarea
                  id="name"
                  value={productSummary}
                  onChange={(e) => setProductSummary(e.target.value)}
                  className="col-span-3"
                  placeholder="Short summary of product"
                  maxLength={200}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4 ">
                <Label htmlFor="description" className="text-right self-start">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  className="col-span-3"
                  placeholder="Description"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={productPrice}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only update state if the value is a positive number or an empty string
                    if (value === "" || Number(value) > 0) {
                      setProductPrice(value);
                    }
                  }}
                  min="0"
                  className="col-span-3"
                  placeholder="Pet price"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  For Pet Ages
                </Label>
                <Select
                  value={petAge}
                  onValueChange={(value) => setPetAge(value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select pet age" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="child">child</SelectItem>
                      <SelectItem value="adult">Adult</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Product Category
                </Label>
                <Select
                  value={productCategory}
                  onValueChange={(value) => setProductCategory(value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="petFood">Pet Food</SelectItem>
                      <SelectItem value="grooming">Grooming</SelectItem>
                      <SelectItem value="toys">Toys</SelectItem>
                      <SelectItem value="bedding">Bedding</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Pet Type
                </Label>
                <Select
                  value={petType}
                  onValueChange={(value) => setPetType(value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select pet type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="dogs">Dogs</SelectItem>
                      <SelectItem value="cats">Cats</SelectItem>
                      <SelectItem value="birds">Birds</SelectItem>
                      <SelectItem value="fish">Fish</SelectItem>
                      <SelectItem value="samllAnimals">
                        Small Animals
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Stock
                </Label>
                <Input
                  type="number"
                  id="username"
                  className="col-span-3"
                  value={productQuantity}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only update state if the value is a positive number or an empty string
                    if (value === "" || Number(value) > 0) {
                      setProductQuantity(value);
                    }
                  }}
                  min="0"
                  placeholder="Products in stock"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Product Material
                </Label>
                <Select
                  value={productMaterial}
                  onValueChange={(value) => setProductMaterial(value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="plastic">Plastic</SelectItem>
                      <SelectItem value="rubber">Rubber</SelectItem>
                      <SelectItem value="cotton">Cotton</SelectItem>
                      <SelectItem value="metal">Metal</SelectItem>
                      <SelectItem value="leather">Leather</SelectItem>
                      <SelectItem value="others">Others</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {productCategory === "clothing" && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right self-start">
                    Available Sizes
                  </Label>
                  <div className="w-full flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2 ml-6 mb-4">
                      <Checkbox
                        id="XS"
                        checked={availableSizes.includes("XS")}
                        onCheckedChange={() => handleSizeChange("XS")}
                      />
                      <label
                        htmlFor="XS"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        XS
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 ml-6 mb-4">
                      <Checkbox
                        id="S"
                        checked={availableSizes.includes("S")}
                        onCheckedChange={() => handleSizeChange("S")}
                      />
                      <label
                        htmlFor="S"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        S
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 ml-6 mb-4">
                      <Checkbox
                        id="M"
                        checked={availableSizes.includes("M")}
                        onCheckedChange={() => handleSizeChange("M")}
                      />
                      <label
                        htmlFor="M"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        M
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 ml-6 mb-4">
                      <Checkbox
                        id="L"
                        checked={availableSizes.includes("L")}
                        onCheckedChange={() => handleSizeChange("L")}
                      />
                      <label
                        htmlFor="L"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        L
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 ml-6 mb-4">
                      <Checkbox
                        id="XL"
                        checked={availableSizes.includes("XL")}
                        onCheckedChange={() => handleSizeChange("XL")}
                      />
                      <label
                        htmlFor="XL"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        XL
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
          <AlertDialogFooter className="w-full justify-center flex-row">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isSubmitting}
              onClick={(e) => handleAddProduct(e)}
            >
              Add Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete product dialog */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent className="w-[55rem] max-w-full ">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Pet From Shop</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this pet from the shop? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="w-full justify-center flex-row">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={(e) => removeProduct(e)}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ShopProductsTable;
