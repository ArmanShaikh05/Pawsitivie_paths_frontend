import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import ManagePetCard from "@/components/Cards/ManageOwnedPetCard/ManagePetCard";
import Loader from "@/components/Loader/Loader";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CREATE_OWNED_PET, GET_USER_DETAILS } from "@/constants/routes";
import useFetch from "@/hooks/use-fetch";
import { useToast } from "@/hooks/use-toast";
import { setUserDetails } from "@/redux/reducers/userDetailsSlice";
import { convertToBase64 } from "@/utils/features";
import { useAuth } from "@/utils/useContext";
import axios from "axios";
import { useRef, useState } from "react";
import { CiImageOn } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "./manageownedpets.scss";

const ManageOwnedPets = () => {
  const { toast } = useToast();
  const { userId } = useParams();
  const {currentUser} = useAuth()
  const imageRef = useRef();
  const [imgBlob, setImgBlob] = useState("");
  const [imgFile, setImgFile] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  // const userData = useSelector((state) => state.userDetailReducer.userData);
  const { loading, data: userData } = useFetch(`${GET_USER_DETAILS}/${currentUser?.uid}`);
  const dispatch = useDispatch();

  //STATES
  const [petName, setPetName] = useState("");
  const [petAge, setPetAge] = useState("");
  const [aboutPet, setAboutPet] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const petsArray = userData?.ownedPets;
  const [searchPetsArray, setSearchPetsArray] = useState([]);

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

  const handleUpload = async () => {
    if (!petName || !petAge || !aboutPet || !imgFile)
      return toast({
        variant: "destructive",
        title: "Please fill all fields",
      });

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", imgFile);
    formData.append("petName", petName);
    formData.append("petAge", petAge);
    formData.append("aboutPet", aboutPet);

    const cancelToken = axios.CancelToken.source();
    const response = await axios.post(
      `${CREATE_OWNED_PET}?userId=${userId}`,
      formData,
      { cancelToken: cancelToken.token }
    );
    if (response) {
      toast({
        title: "Pet added successfully",
      });
      navigate(`/profile/${userId}`);
      dispatch(setUserDetails(response.data.data));
      setPetName("");
      setPetAge("");
      setAboutPet("");
      setIsOpen(false);
      setImgBlob("");
      setIsUploading(false);
    }
    setIsUploading(false);
  };

  const searchPet = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchPetsArray(
      petsArray.filter((pet) => pet.petName.toLowerCase().includes(searchValue))
    );
    console.log(searchPetsArray);
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="manage-owned-pets-container">
      <div className="owned-pets">
        <div className="owned-pets-header">
          <h2>Owned Pets</h2>
          <div className="flex gap-4">
            <Input
              placeholder="Search pet"
              onChange={searchPet}
              className="w-[20rem]"
            />
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="primary">Add Pet</Button>
              </DialogTrigger>
              <DialogContent className="w-[35rem]">
                <DialogHeader>
                  <DialogTitle>Add a New Pet</DialogTitle>
                  <DialogDescription>
                    Enter the details of your new pet. Click save when done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 w-full">
                  {imgBlob && imgBlob !== "" ? (
                    <img
                      src={imgBlob}
                      alt="pet image"
                      className="w-[90%] h-[15rem] m-auto object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-[90%] h-[15rem] m-auto border-2  border-dashed flex items-center justify-center flex-col gap-5">
                      <CiImageOn className="w-[4rem] h-[4rem]" />
                      <Button
                        variant="primary"
                        onClick={() => imageRef.current.click()}
                      >
                        Upload Image
                      </Button>
                      <input
                        type="file"
                        className="hidden"
                        ref={imageRef}
                        onChange={handleImageUpload}
                      />
                    </div>
                  )}

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
                      value={aboutPet}
                      onChange={(e) => setAboutPet(e.target.value)}
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
                    onClick={handleUpload}
                    disabled={isUploading}
                  >
                    Add Pet
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsOpen(false);
                      setImgBlob("");
                    }}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="owned-pets-container">
          {searchPetsArray && searchPetsArray.length > 0 ? (
            searchPetsArray.map((pet, index) => (
              <ManagePetCard key={index} petData={pet} isEditable={true} />
            ))
          ) : petsArray && petsArray.length > 0 ? (
            petsArray.map((pet, index) => (
              <ManagePetCard key={index} petData={pet} isEditable={true} />
            ))
          ) : (
            <div>No Pet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageOwnedPets;
