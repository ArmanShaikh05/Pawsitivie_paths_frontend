/* eslint-disable react/prop-types */
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaEllipsisV } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "../../ui/button";
import "./managepetcard.scss";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { EDIT_OWNED_PET, REMOVE_OWNED_PET } from "@/constants/routes";
import { useGlobalVariables } from "@/utils/useContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { convertToBase64 } from "@/utils/features";
import { useSelector } from "react-redux";

const ManagePetCard = ({ isEditable = false, petData }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const { forceUpdate } = useGlobalVariables();
  const [deleting, setDeleting] = useState(false);
  const { userId } = useParams();
  const ref = useRef(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showEditDIalog, setShowEditDialog] = useState(false);
  const imageRef = useRef();
  const userData = useSelector(state => state.userDetailReducer.userData)

  // STATES FOR EDIT FORM
  const [petName, setPetName] = useState(petData.petName || "");
  const [petAge, setPetAge] = useState(petData.petAge || "");
  const [petAbout, setPetAbout] = useState(petData.petAbout || "");

  const [imgBlob, setImgBlob] = useState(petData?.petImg?.url);
  const [imgFile, setImgFile] = useState();

  const [isUploading, setIsUploading] = useState(false)

  const removePet = async () => {
    setDeleting(true);
    const cancelToken = axios.CancelToken.source();
    const response = await axios.delete(
      `${REMOVE_OWNED_PET}?petId=${petData._id}&userId=${userId}`,
      {
        cancelToken: cancelToken.token,
      }
    );
    if (response) {
      toast({
        variant: "success",
        title: "Pet Removed",
        description: "Your pet has been removed from your account",
      });
      setShowAlertDialog(false);
      setDeleting(false);
      forceUpdate();
      navigate(`/profile/${userId}`);
    }

    setDeleting(false);
  };

  const handleImageUpload = () => {
    setImgFile(imageRef.current.files[0]);
    convertToBase64(imageRef.current.files[0])
      .then((res) => setImgBlob(res))
      .catch((err) =>
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message,
        })
      );
  };

  const uploadEditChanges = async () => {
    try {
      setIsUploading(true)
    let dataToSend
    if (imgFile) {
      dataToSend = new FormData();
      dataToSend.append("file", imgFile);
      dataToSend.append("petName", petName);
      dataToSend.append("petAge", petAge);
      dataToSend.append("petAbout", petAbout);
      dataToSend.append("userName", userData?.userName);
      dataToSend.append("uid", userData?.uid);
    } else {
      dataToSend = {
        petName: petName,
        petAge: petAge,
        petAbout: petAbout,
        userName: userData?.userName,
        uid: userData?.uid,
      }
    }

    // API CALL TO EDIT PET
    const cancelToken = axios.CancelToken.source()
    const response = await axios.post(
      `${EDIT_OWNED_PET}?ownedPetId=${petData?._id}`,
      dataToSend,
      { cancelToken: cancelToken.token }
    );
    if (response) {
      toast({
        title: "Pet added successfully",
      });
      navigate(`/profile/${userId}`);
      setShowEditDialog(false);
      setIsUploading(false);
    }
    setIsUploading(false);
    } catch (error) {
      if (axios.isCancel(error)) return setIsUploading(false)
        setIsUploading(false)
      console.log(error)
      
    }



  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  return (
    <div className="owned-pet-card">
      <img src={petData?.petImg?.url} alt="Dog" />
      <div className="card-details">
        <p>{petData?.petAbout}</p>

        {isEditable && (
          <FaEllipsisV
            className="edit-card-icon"
            onClick={() => setShowDropdown(!showDropdown)}
          />
        )}

        {showDropdown && (
          <div className="dropdown" ref={ref}>
            <div
              className="dropdown-menu"
              onClick={() => setShowEditDialog(true)}
            >
              <CiEdit />
              <p>Edit</p>
            </div>
            <div className="dropdown-menu">
              <div
                onClick={() => setShowAlertDialog(true)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <MdDelete />
                <p>Delete</p>
              </div>
            </div>
          </div>
        )}

        <div className="details-footer flex justify-between flex-wrap gap-2">
          <div className="footer-box flex items-center gap-2">
            <Badge className="detail-badge" variant="primary">
              Name
            </Badge>
            <p className="text-sm uppercase">{petData?.petName}</p>
          </div>

          <div className="footer-box flex items-center gap-2">
            <Badge className="detail-badge" variant="primary">
              Age
            </Badge>
            <p className="text-sm uppercase">{petData?.petAge} years</p>
          </div>
        </div>

        <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                pet information.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowAlertDialog(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  variant="primary"
                  disabled={deleting}
                  onClick={removePet}
                >
                  Delete Pet
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={showEditDIalog} onOpenChange={setShowEditDialog}>
          <DialogContent className="w-[35rem]">
            <DialogHeader>
              <DialogTitle>Edit Pet</DialogTitle>
              <DialogDescription>
                Enter the changes you want to do. Click save when done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 w-full">

              <div className="w-[90%] h-[15rem] m-auto relative">
                <img
                  src={imgBlob}
                  alt="pet image"
                  className="w-full h-full  object-cover rounded-lg"
                />
                <FaCloudUploadAlt
                  size={40}
                  onClick={() => imageRef.current.click()}
                  className="bg-gray-200 absolute right-3 bottom-3 p-[0.5rem] rounded-full cursor-pointer"
                />
                <input
                  type="file"
                  className="hidden"
                  ref={imageRef}
                  onChange={handleImageUpload}
                />
              </div>

              <div className="grid grid-cols-6 items-center gap-4 w-full ">
                <Label htmlFor="name" className="text-left">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter pet's name"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  className="col-span-5"
                />
              </div>
              <div className="grid grid-cols-6 items-start gap-6 w-full ">
                <Label htmlFor="description" className="text-left pt-3">
                  About Pet
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter pet's description"
                  className="col-span-5"
                  value={petAbout}
                  onChange={(e) => setPetAbout(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-6 items-center gap-4 w-full ">
                <Label htmlFor="age" className="text-left">
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter pet's age"
                  className="col-span-5"
                  value={petAge}
                  onChange={(e) => setPetAge(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="primary"
                onClick={uploadEditChanges}
                disabled={isUploading}
              >
                Add Pet
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditDialog(false);
                }}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ManagePetCard;
