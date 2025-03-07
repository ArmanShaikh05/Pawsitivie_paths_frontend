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
  ADD_SHOP_PETS,
  EDIT_SHOP_PETS,
  GET_SHOP_PETS_DATA,
  REMOVE_SHOP_PET,
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
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Switch } from "../ui/switch";
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
import { Textarea } from "../ui/textarea";
import Loader from "../Loader/Loader";
import { useGlobalVariables } from "@/utils/useContext";

// eslint-disable-next-line react/prop-types
const ShopPetsTable = ({ ShopPetData, forceUpdate }) => {
  const imagesRef = useRef();
  const editImagesRef = useRef();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const {shopChartForceUpdate} = useGlobalVariables()
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [addPetDialog, setAddPetDialog] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const userData = useSelector((state) => state.userDetailReducer.userData);

  //   STATES
  const [petName, setPetName] = useState("");
  const [petGender, setPetGender] = useState("");
  const [petSize, setPetSize] = useState("");
  const [petBreed, setPetBreed] = useState("");
  const [petAge, setPetAge] = useState("");
  const [petColor, setPetColor] = useState("");
  const [petLocation, setPetLocation] = useState("");
  const [isVaccinated, setisVaccinated] = useState(false);
  const [isDewormed, setisDewormed] = useState(false);
  const [petPrice, setPetPrice] = useState("");
  const [petCategory, setPetCategory] = useState("");
  const [petDescription, setPetDescription] = useState("");

  const [initialImages, setInitialImages] = useState([]);
  const [addedImages, setAddedImages] = useState([]);
  const [addedImageFiles, setAddedImageFiles] = useState([]);
  const [removedImagePublicIds, setRemovedImagePublicIds] = useState([]);
  const [imageLimitError, setImageLimitError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fetchingEditPetData, setFetchingEditPetData] = useState(false);
  const [editPetData, setEditPetData] = useState();
  const [openEditDialog, setOpenEditDialog] = useState(false);

  // EDIT PET DATA STATES
  const [editPetName, setEditPetName] = useState("");
  const [editPetGender, setEditPetGender] = useState("");
  const [editPetSize, setEditPetSize] = useState("");
  const [editPetBreed, setEditPetBreed] = useState("");
  const [editpetAge, setEditPetAge] = useState("");
  const [editPetColor, setEditPetColor] = useState("");
  const [editPetLocation, setEditPetLocation] = useState("");
  const [editIsVaccinated, setEditisVaccinated] = useState(false);
  const [editIsDewormed, setEditisDewormed] = useState(false);
  const [editPetPrice, setEditPetPrice] = useState("");
  const [editPetCategory, setEditPetCategory] = useState("");
  const [editPetDescription, setEditPetDescription] = useState("");

  const [editInitialImages, seteditInitialImages] = useState([]);
  const [editAddedImages, seteditAddedImages] = useState([]);
  const [editAddedImageFiles, seteditAddedImageFiles] = useState([]);
  const [editRemovedImagePublicIds, seteditRemovedImagePublicIds] = useState(
    []
  );
  const [editImageLimitError, setEditImageLimitError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [isDeleting,setIsDeleting] = useState(false)
  const[openDeleteDialog,setOpenDeleteDialog] = useState(false)
  const [deletePetId,setDeletePetId] = useState("")

  const fetchEditPetData = async (petId) => {
    try {
      setFetchingEditPetData(true);
      setOpenEditDialog(true);

      const { data } = await axios.get(`${GET_SHOP_PETS_DATA}/${petId}`);
      if (data) {
        setEditPetData(data.data);
        setEditPetName(data.data?.petName);
        setEditPetGender(data.data?.petGender);
        setEditPetSize(data.data?.petSize);
        setEditPetBreed(data.data?.petBreed);
        setEditPetAge(data.data?.petAge);
        setEditPetColor(data.data?.petColor);
        setEditPetLocation(data.data?.petLocation);
        setEditisVaccinated(data.data?.isVaccinated);
        setEditisDewormed(data.data?.isDewormed);
        setEditPetPrice(data.data?.petPrice);
        setEditPetCategory(data.data?.petCategory);
        setEditPetDescription(data.data?.petDescription);
        seteditInitialImages(data.data?.petImages);
      }
    } catch (error) {
      if (axios.isCancel(error)) return setFetchingEditPetData(false);
      console.log(error);
      setFetchingEditPetData(false);
    } finally {
      setFetchingEditPetData(false);
    }
  };

  const handleAddPet = async (e) => {
    e.preventDefault();

    if (petName === "") {
      return toast({ variant: "destructive", title: "Please enter pet name" });
    } else if (petDescription === "") {
      return toast({
        variant: "destructive",
        title: "Please enter pet description",
      });
    } else if (petPrice === "") {
      return toast({ variant: "destructive", title: "Please enter pet price" });
    } else if (petGender === "") {
      return toast({
        variant: "destructive",
        title: "Please enter pet gender",
      });
    } else if (petAge === "") {
      return toast({ variant: "destructive", title: "Please enter pet age" });
    } else if (petBreed === "") {
      return toast({ variant: "destructive", title: "Please enter pet breed" });
    } else if (petSize === "") {
      return toast({ variant: "destructive", title: "Please enter pet size" });
    } else if (petCategory === "") {
      return toast({
        variant: "destructive",
        title: "Please enter pet category",
      });
    } else if (petColor === "") {
      return toast({ variant: "destructive", title: "Please enter pet color" });
    } else if (petLocation === "") {
      return toast({
        variant: "destructive",
        title: "Please enter pet location",
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
        dataToSend.append("petName", petName);
        dataToSend.append("petGender", petGender);
        dataToSend.append("petSize", petSize);
        dataToSend.append("petBreed", petBreed);
        dataToSend.append("petAge", petAge);
        dataToSend.append("petColor", petColor);
        dataToSend.append("petLocation", petLocation);
        dataToSend.append("isVaccinated", isVaccinated);
        dataToSend.append("isDewormed", isDewormed);
        dataToSend.append("petPrice", petPrice);
        dataToSend.append("petCategory", petCategory);
        dataToSend.append("shopOwnerId", userData?._id);
        dataToSend.append("petDescription", petDescription);
      } else {
        dataToSend = {
          petName,
          petGender,
          petSize,
          petBreed,
          petAge,
          petColor,
          petLocation,
          isVaccinated,
          isDewormed,
          petPrice,
          petCategory,
          shopOwnerId: userData?._id,
          petDescription,
        };
      }

      try {
        const cancelToken = axios.CancelToken.source();
        const response = await axios.post(ADD_SHOP_PETS, dataToSend, {
          cancelToken: cancelToken.token,
        });
        if (response) {
          toast({
            title: "Pet added Successfully",
          });
          dispatch(setUserDetails(response.data.data));
          setIsSubmitting(false);
          setAddPetDialog(false);
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
      dataToSend.append("petName", editPetName);
      dataToSend.append("petGender", editPetGender);
      dataToSend.append("petSize", editPetSize);
      dataToSend.append("petBreed", editPetBreed);
      dataToSend.append("petAge", editpetAge);
      dataToSend.append("petColor", editPetColor);
      dataToSend.append("petLocation", editPetLocation);
      dataToSend.append("isVaccinated", editIsVaccinated);
      dataToSend.append("isDewormed", editIsDewormed);
      dataToSend.append("petPrice", editPetPrice);
      dataToSend.append("petCategory", editPetCategory);
      // dataToSend.append("petId", editPetData?._id);
      // dataToSend.append("shopOwnerId", userData?._id);
      dataToSend.append("petDescription", editPetDescription);
    } else {
      dataToSend = {
        petName: editPetName,
        petGender: editPetGender,
        petSize: editPetSize,
        petBreed: editPetBreed,
        petAge: editpetAge,
        petColor: editPetColor,
        petLocation: editPetLocation,
        isVaccinated: editIsVaccinated,
        isDewormed: editIsDewormed,
        petPrice: editPetPrice,
        petCategory: editPetCategory,
        // petId: editPetData?._id,
        // shopOwnerId: userData?._id,
        petDescription: editPetDescription,
      };
    }

    try {
      const cancelToken = axios.CancelToken.source();
      const response = await axios.put(
        `${EDIT_SHOP_PETS}?shopOwnerId=${userData?._id}&&petId=${editPetData?._id}`,
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

  const handleEditShopImages = async () => {
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

  const removePet = async (e) => {
    try {
      e.preventDefault()
      setIsDeleting(true)
      const cancelToken = axios.CancelToken.source()
      const {data} = await axios.delete(`${REMOVE_SHOP_PET}?petId=${deletePetId}&shopId=${userData?._id}`,{cancelToken:cancelToken.token})
      if(data){
        toast({
          title: "Pet Removed Successfully",
        })
        setIsDeleting(false)
        setOpenDeleteDialog(close)
        forceUpdate()
        dispatch(setUserDetails(data.data))
      }
    } catch (error) {
      if (axios.isCancel(error)) return setOpenDeleteDialog(close);
      console.error(error);
    }finally{
      setIsDeleting(false)
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
      accessorKey: "category",
      header: "Category",
      id: "category", // Explicit id added
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
                className="text-center cursor-pointer"
                onClick={() => fetchEditPetData(row.original?.petId)}
              >
                Edit
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <span
                className="text-center cursor-pointer"
                onClick={() =>{setOpenDeleteDialog(true);setDeletePetId(row.original?.petId)}}
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
    data: ShopPetData,
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
                setAddPetDialog(true);
              }}
            >
              Add Pet
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
                <SheetTitle>Edit Pet</SheetTitle>
                <SheetDescription>
                  Edit the details of the pet.
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
                    onChange={handleEditShopImages}
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
                    Pet Name
                  </Label>
                  <Input
                    id="name"
                    value={editPetName}
                    onChange={(e) => setEditPetName(e.target.value)}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="name"
                    value={editPetDescription}
                    onChange={(e) => setEditPetDescription(e.target.value)}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Price
                  </Label>
                  <Input
                    id="price"
                    value={editPetPrice}
                    onChange={(e) => setEditPetPrice(e.target.value)}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Gender
                  </Label>
                  <Select
                    value={editPetGender}
                    onValueChange={(value) => setEditPetGender(value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Age
                  </Label>
                  <Input
                    type="number"
                    id="username"
                    className="col-span-3"
                    value={editpetAge}
                    onChange={(e) => setEditPetAge(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Breed
                  </Label>
                  <Input
                    type="text"
                    id="username"
                    className="col-span-3"
                    value={editPetBreed}
                    onChange={(e) => setEditPetBreed(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Size
                  </Label>
                  <Select
                    value={editPetSize}
                    onValueChange={(value) => setEditPetSize(value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select Size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Category
                  </Label>
                  <Select
                    value={editPetCategory}
                    onValueChange={(value) => setEditPetCategory(value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="dogs">Dogs</SelectItem>
                        <SelectItem value="cats">Cats</SelectItem>
                        <SelectItem value="fishs">Fish</SelectItem>
                        <SelectItem value="birds">Birds</SelectItem>
                        <SelectItem value="turles">Turtle</SelectItem>
                        <SelectItem value="rabbits">Rabbits</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Color
                  </Label>
                  <Select
                    value={editPetColor}
                    onValueChange={(value) => setEditPetColor(value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select Color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="red">Red</SelectItem>
                        <SelectItem value="apricot">Apricot</SelectItem>
                        <SelectItem value="black">Black</SelectItem>
                        <SelectItem value="silver">Silver</SelectItem>
                        <SelectItem value="tan">Tan</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Vaccinated
                  </Label>
                  <Switch
                    checked={editIsVaccinated}
                    onCheckedChange={setEditisVaccinated}
                    className="transition-colors"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Dewormed
                  </Label>
                  <Switch
                    checked={editIsDewormed}
                    onCheckedChange={setEditisDewormed}
                    className="transition-colors"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Location
                  </Label>
                  <Input
                    type="text"
                    id="username"
                    className="col-span-3"
                    value={editPetLocation}
                    onChange={(e) => setEditPetLocation(e.target.value)}
                  />
                </div>
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

          {/* Add pet Dialog */}
      <AlertDialog open={addPetDialog} onOpenChange={setAddPetDialog}>
        <AlertDialogContent className="w-[55rem] max-w-full ">
          <AlertDialogHeader>
            <AlertDialogTitle>Add New Pet</AlertDialogTitle>
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
              <Label className=" text-[1.05rem]">Enter Pet Details</Label>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Pet Name
                </Label>
                <Input
                  id="name"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  className="col-span-3"
                  placeholder="Pet name"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4 ">
                <Label htmlFor="description" className="text-right self-start">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={petDescription}
                  onChange={(e) => setPetDescription(e.target.value)}
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
                  value={petPrice}
                  onChange={(e) => setPetPrice(e.target.value)}
                  className="col-span-3"
                  placeholder="Pet price"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Gender
                </Label>
                <Select
                  value={petGender}
                  onValueChange={(value) => setPetGender(value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent
                    value={petGender}
                    onChange={(e) => setPetGender(e.target.value)}
                  >
                    <SelectGroup>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Age
                </Label>
                <Input
                  type="number"
                  id="username"
                  className="col-span-3"
                  value={petAge}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only update state if the value is a positive number or an empty string
                    if (value === "" || Number(value) > 0) {
                      setPetAge(value);
                    }
                  }}
                  min="0"
                  placeholder="Pet age (in years)"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Breed
                </Label>
                <Input
                  type="text"
                  id="username"
                  className="col-span-3"
                  value={petBreed}
                  onChange={(e) => setPetBreed(e.target.value)}
                  placeholder="Pet breed"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Size
                </Label>
                <Select
                  value={petSize}
                  onValueChange={(value) => setPetSize(value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Category
                </Label>
                <Select
                  value={petCategory}
                  onValueChange={(value) => setPetCategory(value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="dogs">Dogs</SelectItem>
                      <SelectItem value="cats">Cats</SelectItem>
                      <SelectItem value="fishs">Fish</SelectItem>
                      <SelectItem value="birds">Birds</SelectItem>
                      <SelectItem value="turtles">Turtle</SelectItem>
                      <SelectItem value="rabbits">Rabbits</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Color
                </Label>
                <Select
                  value={petColor}
                  onValueChange={(value) => setPetColor(value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="red">Red</SelectItem>
                      <SelectItem value="apricot">Apricot</SelectItem>
                      <SelectItem value="black">Black</SelectItem>
                      <SelectItem value="silver">Silver</SelectItem>
                      <SelectItem value="tan">Tan</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Vaccinated
                </Label>
                <Switch
                  checked={isVaccinated}
                  onCheckedChange={setisVaccinated}
                  className="transition-colors"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Dewormed
                </Label>
                <Switch
                  checked={isDewormed}
                  onCheckedChange={setisDewormed}
                  className="transition-colors"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Location
                </Label>
                <Input
                  type="text"
                  id="username"
                  className="col-span-3"
                  value={petLocation}
                  onChange={(e) => setPetLocation(e.target.value)}
                  placeholder="Address"
                />
              </div>
            </form>
          </div>
          <AlertDialogFooter className="w-full justify-center flex-row">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isSubmitting}
              onClick={(e) => handleAddPet(e)}
            >
              Add pet
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete pet dialog */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent className="w-[55rem] max-w-full ">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Pet From Shop</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this pet from the shop? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="w-full justify-center flex-row">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={(e) => removePet(e)}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ShopPetsTable;
