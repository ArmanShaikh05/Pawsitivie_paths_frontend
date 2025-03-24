import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MdEditSquare } from "react-icons/md";
import "../../EditProfile/editprofile.scss";

import { Button } from "@/components/ui/button";
import { CHECK_PET_DOCTOR_USERID_AVAILALE, EDIT_DOCTOR_DETAILS } from "@/constants/routes";
import { useToast } from "@/hooks/use-toast";
import { setUserDetails } from "@/redux/reducers/userDetailsSlice";
import { convertToBase64 } from "@/utils/features";
import { useGlobalVariables } from "@/utils/useContext";
import axios from "axios";
import { useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { statesArray } from "@/constants/data";

import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const doctorsSpecialists = [
  "Small Animals (Dogs and Cats)",
  "Large Animals (Horses, Cows, etc.)",
  "Exotic Animals (Birds, Reptiles, etc.)",
  "Aquatic Animals (Fish, Amphibians, etc.)",
];

const DoctorProfileEdit = () => {
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
  const [name, setName] = useState(userData?.userName || "");
  const [address, setAddress] = useState(userData?.address || "");
  const [bio, setBio] = useState(userData?.bio || "");
  const [speciality, setSpeciality] = useState(userData?.speciality || "");
  const [state, setState] = useState(userData?.state || "");
  const [city, setCity] = useState(userData?.city || "");
  const [pincode, setPincode] = useState(userData?.pincode || "");
  const [education, setEducation] = useState(userData?.education || "");
  const [experience, setExperience] = useState(userData?.experience || "");
  const [appointmentFee, setAppointmentFee] = useState(Number(userData?.appointmentFee) || 0);
  const [availableForWork, setAvailableForWork] = useState(userData?.availableForWork);

  const [userId, setUserId] = useState(userData?.userId);
  const [userIdErrorState, setUserIdErrorState] = useState(false);
  const [showuserIdError, setShowUserIdError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [mobileNumber, setMobileNumber] = useState(userData?.phone);

  const [facebookLink, setFacebookLink] = useState(
    userData?.socialHandles?.facebook || ""
  );
  const [instagramLink, setInstagramLink] = useState(
    userData?.socialHandles?.instagram || ""
  );
  const [twitterLink, setTwitterLink] = useState(
    userData?.socialHandles?.twitter || ""
  );
  const [whatsappLink, setWhatsappLink] = useState(
    userData?.socialHandles?.whatsapp || ""
  );

  const [weekdayTimings, setWeekdayTimings] = useState(
    userData?.availability?.weekdays || { open: "", close: "" }
  );
  const [weekendTimings, setWeekendTimings] = useState(
    userData?.availability?.weekend || { open: "", close: "" }
  );
  const [isSundayOpen, setIsSundayOpen] = useState(
    userData?.availability?.sundayClosed || false
  );

  const handleSubmitChanges = async (e) => {
    e.preventDefault();
    // TO DO: implement the logic to update the user's profile

    let formData;
    if (profilePicRef.current.files[0]) {
      formData = new FormData();
      formData.append("file", profilePicRef.current.files[0]);
      formData.append("userId", userId);
      formData.append("name", name);
      formData.append("bio", bio);
      formData.append("address", address);
      formData.append("mobileNumber", mobileNumber);
      formData.append("facebookLink", facebookLink);
      formData.append("instagramLink", instagramLink);
      formData.append("twitterLink", twitterLink);
      formData.append("whatsappLink", whatsappLink);
      formData.append("weekdayTimings", JSON.stringify(weekdayTimings));
      formData.append("weekendTimings", JSON.stringify(weekendTimings));
      formData.append("sundayClosed", isSundayOpen);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("pincode", pincode);
      formData.append("appointmentFee", appointmentFee);
      formData.append("availableForWork", availableForWork);
      formData.append("education", education);
      formData.append("speciality", speciality);
      formData.append("experience", experience);
    } else {
      formData = {
        name,
        address,
        bio,
        mobileNumber,
        userId,
        weekdayTimings: JSON.stringify(weekdayTimings),
        weekendTimings: JSON.stringify(weekendTimings),
        sundayClosed: isSundayOpen,
        city,
        state,
        pincode,
        appointmentFee,
        availableForWork,
        education,
        speciality,
        facebookLink,
        instagramLink,
        twitterLink,
        whatsappLink,
        experience,
      };
    }

    try {
      setIsEditing(true);
      const cancelToken = axios.CancelToken.source();

      const { data } = await axios.post(
        `${EDIT_DOCTOR_DETAILS}?id=${userData?._id}`,
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

  const handleWeekdayChange = (e) => {
    const { name, value } = e.target;

    // Convert time to minutes
    let [hours, minutes] = value.split(":").map(Number);

    // Round minutes to the nearest 30-minute interval
    minutes = minutes < 15 ? 0 : minutes < 45 ? 30 : 0;
    if (minutes === 0 && value.split(":")[1] >= 45) hours += 1; // Adjust hour if rounding up

    // Format back to HH:MM
    const newTime = `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}`;

    setWeekdayTimings((prev) => ({
      ...prev,
      [name]: newTime,
    }));
  };

  const handleWeekendChange = (e) => {
    const { name, value } = e.target;

    // Convert time to minutes
    let [hours, minutes] = value.split(":").map(Number);

    // Round minutes to the nearest 30-minute interval
    minutes = minutes < 15 ? 0 : minutes < 45 ? 30 : 0;
    if (minutes === 0 && value.split(":")[1] >= 45) hours += 1; // Adjust hour if rounding up

    // Format back to HH:MM
    const newTime = `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}`;

    // Update state
    setWeekendTimings((prev) => ({
      ...prev,
      [name]: newTime,
    }));
  };

  const checkUserIdAvailable = async (query) => {
    try {
      if (query === userId) return setShowUserIdError(false);
      const response = await axios.get(
        `${CHECK_PET_DOCTOR_USERID_AVAILALE}?userId=${query}`
      );
      if (response.data.success === true) {
        setShowUserIdError(true);
        setUserIdErrorState(false);
      } else {
        setShowUserIdError(true);
        setUserIdErrorState(true);
      }
    } catch (error) {
      console.log(error);
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
    <div className="edit-profile-container hidden-scrollbar p-0">
      <form action="" className="edit-profile ">
        {console.log(availableForWork)}
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
          <div className="flex items-center gap-4 mt-2  w-[80%] justify-start">
            <span className="text-sm font-medium">Available for work?</span>
            <Switch
              checked={availableForWork}
              onCheckedChange={setAvailableForWork}
              className="transition-colors"
            />
          </div>
          <div className="grid w-[80%] mx-auto items-center gap-1.5">
            <Label htmlFor="firstName">UserId</Label>
            <Input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => handleUsernameSearch(e.target.value)}
              placeholder="User Id"
            />
          </div>
          {showuserIdError === true ? (
            !userIdErrorState ? (
              <p className="text-green-500 text-sm">{`${userId} is available`}</p>
            ) : (
              <p className="text-red-500 text-sm">{`${userId} is already taken`}</p>
            )
          ) : (
            <div></div>
          )}
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

          <div className="grid w-full gap-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              placeholder="Type your bio here."
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 w-full gap-2">
            <div>
              <Label htmlFor="education">Education</Label>
              <Input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                id="education"
                placeholder="Enter education"
              />
            </div>

            <div>
              <Label htmlFor="experience">Experience</Label>
              <Input
                type="number"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                id="experience"
                placeholder="Enter experience in years"
              />
            </div>

            <div className="grid w-full gap-1.5">
              <Label htmlFor="appointmentFee">Appointment Fee</Label>
              <Input
                type="number"
                id="appointmentFee"
                placeholder="Appointment fee"
                value={appointmentFee}
                onChange={(e) => setAppointmentFee(e.target.value)}
              />
            </div>
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

          <div className="grid grid-cols-3 w-full gap-2">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                id="city"
                placeholder="Enter city"
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Select id={"state"} onValueChange={(value) => setState(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={state || "Select state"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Indian States</SelectLabel>
                    {statesArray.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="pincode">Pin</Label>
              <Input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                id="pincode"
                placeholder="Enter pincode"
              />
            </div>
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="mobileNumber">Mobile Number</Label>
            <Input
              type="number"
              id="mobileNumber"
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="speciality">Speciality</Label>
            <Select
              id={"speciality"}
              onValueChange={(value) => setSpeciality(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={speciality || "Select speciality"} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Speciality</SelectLabel>
                  {doctorsSpecialists.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 w-full bg-white border rounded-lg shadow">
            <h2 className="text-[1rem]  mb-4">Shop Timings</h2>

            {/* Weekday Timings */}
            <div className="mb-4">
              <h3 className="text-[0.9rem] font-semibold mb-2">Weekdays</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Opening Time
                  </label>
                  <input
                    type="time"
                    name="open"
                    value={weekdayTimings.open}
                    onChange={handleWeekdayChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Closing Time
                  </label>
                  <input
                    type="time"
                    name="close"
                    value={weekdayTimings.close}
                    onChange={handleWeekdayChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
            </div>

            {/* Weekend Timings */}
            <div className="mb-4">
              <h3 className="text-[0.9rem] font-semibold mb-2">Weekends</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Opening Time
                  </label>
                  <input
                    type="time"
                    name="open"
                    step="1800"
                    value={weekendTimings.open}
                    onChange={handleWeekendChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Closing Time
                  </label>
                  <input
                    type="time"
                    name="close"
                    step="1800"
                    value={weekendTimings.close}
                    onChange={handleWeekendChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
            </div>

            {/* Toggle Button for Sunday */}
            <div className="flex items-center gap-4 mt-2 mb-4">
              <span className="text-[1rem] font-medium">
                Is Open on Sunday?
              </span>
              <Switch
                checked={isSundayOpen}
                onCheckedChange={setIsSundayOpen}
                className="transition-colors"
              />
            </div>
          </div>

          <div className="p-4 w-full bg-white border rounded-lg shadow">
            <h2 className="text-[1rem]  mb-4">Social Media Handles</h2>

            <div className="mb-4">
              <div className="grid grid-cols-2 gap-4 ">
                <div>
                  <div className=" flex gap-2 items-center  text-sm font-medium mb-1">
                    <FaFacebook />
                    <p>Facebook</p>
                  </div>
                  <input
                    type="text"
                    value={facebookLink}
                    onChange={(e) => setFacebookLink(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-[0.9rem]"
                    placeholder="facebook link"
                  />
                </div>
                <div>
                  <div className=" flex gap-2 items-center  text-sm font-medium mb-1">
                    <FaInstagram />
                    <p>Instagram</p>
                  </div>
                  <input
                    type="text"
                    value={instagramLink}
                    onChange={(e) => setInstagramLink(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-[0.9rem]"
                    placeholder="instagram link"
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className=" flex gap-2 items-center  text-sm font-medium mb-1">
                    <FaXTwitter />
                    <p>Twitter</p>
                  </div>
                  <input
                    type="text"
                    value={twitterLink}
                    onChange={(e) => setTwitterLink(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-[0.9rem]"
                    placeholder="twitter link"
                  />
                </div>
                <div>
                  <div className=" flex gap-2 items-center  text-sm font-medium mb-1">
                    <FaWhatsapp />
                    <p>WhatsApp</p>
                  </div>
                  <input
                    type="text"
                    value={whatsappLink}
                    onChange={(e) => setWhatsappLink(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-[0.9rem]"
                    placeholder="whatsapp link"
                  />
                </div>
              </div>
            </div>
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

export default DoctorProfileEdit;
