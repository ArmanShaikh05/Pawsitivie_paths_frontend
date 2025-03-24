import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { MdEditSquare } from "react-icons/md";
import "./editprofile.scss";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { convertToBase64 } from "@/utils/features";
import axios from "axios";
import { CHECK_USERID_AVAILALE, EDIT_USER_DETAILS } from "@/constants/routes";
import { setUserDetails } from "@/redux/reducers/userDetailsSlice";
import { useGlobalVariables } from "@/utils/useContext";
import { useCallback } from "react";

const EditProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const profilePicRef = useRef();
  const { forceUpdate } = useGlobalVariables();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userDetailReducer.userData);
  const fallbackText = userData?.userName
    .split(" ")
    .map((name) => name[0])
    .join("");

  // STATES
  const [profilePicBlob, setProfilePicBlob] = useState(null);
  const [name, setName] = useState(userData?.userName);
  const [address, setAddress] = useState(userData?.address);
  const [bio, setBio] = useState(userData?.bio);
  const [favouritePets, setFavouritePets] = useState(
    userData?.favouritePets || []
  );
  const [DOB, setDOB] = useState(userData?.DOB);
  const [userId, setUserId] = useState(userData?.userId);
  const [userIdErrorState, setUserIdErrorState] = useState(false);
  const [showuserIdError, setShowUserIdError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [mobileNumber, setMobileNumber] = useState(userData?.phone);

  // CHECKBOX OPTIONS
  const options = [
    { id: "dogs", label: "Dogs" },
    { id: "cats", label: "Cats" },
    { id: "birds", label: "Birds" },
    { id: "rabbits", label: "Rabbits" },
    { id: "fish", label: "Fishes" },
    { id: "turtle", label: "Turtles" },
  ];

  const handleSubmitChanges = async (e) => {
    e.preventDefault();
    // TO DO: implement the logic to update the user's profile

    let formData;
    if (profilePicRef.current.files[0]) {
      formData = new FormData();
      formData.append("file", profilePicRef.current.files[0]);
      formData.append("userId", userId);
      formData.append("name", name);
      formData.append("DOB", DOB);
      formData.append("bio", bio);
      formData.append("address", address);
      favouritePets.forEach((item) => {
        formData.append("favouritePets[]", item);
      });
      formData.append("mobileNumber", mobileNumber);
    } else {
      formData = {
        name,
        DOB,
        address,
        bio,
        favouritePets,
        mobileNumber,
        userId,
      };
    }

    try {
      setIsEditing(true);
      const cancelToken = axios.CancelToken.source();
      // console.log(userData?._id)
      const { data } = await axios.post(
        `${EDIT_USER_DETAILS}?id=${userData?._id}`,
        formData,
        {
          cancelToken: cancelToken.token,
        }
      );
      if (data) {
        setIsEditing(false);
        dispatch(setUserDetails(data.data));
        forceUpdate();
        toast({
          variant: "success",
          title: "Profile Updated Successfully",
          description: "Your profile details have been successfully edited",
        });
        navigate(`/home`);
      }
    } catch (error) {
      if (axios.isCancel(error)) return setIsEditing(false);
      console.log(error);
    } finally {
      setIsEditing(false);
    }
  };

  const profilePicChange = () => {
    convertToBase64(profilePicRef.current.files[0])
      .then((res) => {
        setProfilePicBlob(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCheckboxChange = (optionId, isChecked) => {
    if (isChecked) {
      // Add to the array when checked
      setFavouritePets((prev) => [...prev, optionId]);
    } else {
      // Remove from the array when unchecked
      setFavouritePets((prev) => prev.filter((id) => id !== optionId));
    }
  };

  // Checking whether changing userid already exists and implementing debounce
  const checkUserIdAvailable = async (query) => {
    try {
      if(query === userId) return setShowUserIdError(false)
      const response = await axios.get(`${CHECK_USERID_AVAILALE}?userId=${query}`)
      if(response.data.success === true){
        setShowUserIdError(true)
        setUserIdErrorState(false)
      }else{
        setShowUserIdError(true)
        setUserIdErrorState(true)
      }
    } catch (error) {
      console.log(error)
    }
  };

  const debounceSearch = (cb, delay) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => cb(...args), delay);
    };
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const deb = useCallback(
    debounceSearch((searchquery) => checkUserIdAvailable(searchquery), 500),
    []
  );

  const handleUsernameSearch = (query) => {
    setUserId(query);
    deb(query);
  };

  return (
    <div className="edit-profile-container hidden-scrollbar">
      <form action="" className="edit-profile">
        <div className="profile-image-container">
          <Avatar className="profile-image">
            <AvatarImage
              className="object-cover"
              src={profilePicBlob || userData?.profilePic?.url}
            />
            <AvatarFallback className="text-[3rem]">
              {fallbackText}
            </AvatarFallback>
          </Avatar>
          <MdEditSquare onClick={() => profilePicRef.current.click()} />
          <input
            type="file"
            onChange={profilePicChange}
            className="hidden"
            ref={profilePicRef}
            accept="image/png, image/jpeg, image/jpg, image/gif, image/webp, image/svg+xml"
          />
          <div className="grid w-[80%] max-[900px]:w-full max-[900px]:px-[2rem] max-[600px]:px-[0.5rem] mx-auto items-center gap-1.5">
            <Label htmlFor="firstName">UserId</Label>
            <Input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => handleUsernameSearch(e.target.value)}
              placeholder="User Id"
            />
          </div>
          {showuserIdError === true ? !userIdErrorState ? (
            <p className="text-green-500 text-sm">{`${userId} is available`}</p>
          ) : (
            <p className="text-red-500 text-sm">{`${userId} is already taken`}</p>
          ) : <div></div>}
        </div>

        <div className="form-group">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name"
              placeholder="Name"
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Date of Birth</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !DOB && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {DOB ? format(DOB, "PPP") : <span>DOB</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={DOB}
                  onSelect={(date) => setDOB(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              placeholder="Type your bio here."
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="address">Address</Label>
            <Textarea
              placeholder="Type your address here."
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="grid w-full gap-1.5 mb-4">
            <Label htmlFor="address">Favourite pets</Label>
            <div className="w-full flex gap-8 mt-4 flex-wrap">
              {options.map((option, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Checkbox
                    id={option.id}
                    checked={favouritePets.includes(option.id)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(option.id, checked)
                    }
                  />
                  <label
                    htmlFor={option.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="mobileNumber">Mobile Number*</Label>
            <Input
              type="number"
              id="mobileNumber"
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
          </div>

          <div className="buttons-container">
            <Button
              disabled={isEditing}
              variant="primary"
              onClick={handleSubmitChanges}
            >
              Save Changes
            </Button>
            <Button
              variant="destructive"
              onClick={() => navigate(`/profile/${userData?.userId}`)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
