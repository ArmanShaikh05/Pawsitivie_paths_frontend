import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { useNavigate, useParams } from "react-router-dom";
import "./shopprofileedit.scss";
import axios from "axios";
import { useAuth, useGlobalVariables } from "@/utils/useContext";
import { EDIT_SHOP_DETAILS } from "@/constants/routes";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import { setUserDetails } from "@/redux/reducers/userDetailsSlice";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const ShopProfileEdit = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const imagesRef = useRef();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const dispatch = useDispatch();
  const { forceUpdate } = useGlobalVariables();
  const userData = useSelector((state) => state.userDetailReducer.userData);

  // Function to handle pressing Enter and adding a label
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      setLabels([...labels, inputValue]);
      setInputValue("");
    }
  };

  // Function to delete a label
  const deleteLabel = (id) => {
    setLabels(labels.filter((label, index) => index !== id));
  };

  // State variables for timings and Sunday toggle
  const [isEditing, setIsEditing] = useState(false);
  const [weekdayTimings, setWeekdayTimings] = useState(
    userData?.shopTimmings?.weekdays || { open: "", close: "" }
  );
  const [weekendTimings, setWeekendTimings] = useState(
    userData?.shopTimmings?.weekend || { open: "", close: "" }
  );
  const [isSundayOpen, setIsSundayOpen] = useState(
    userData?.shopTimmings?.sundayClosed || false
  );
  const [shopName, setShopName] = useState(userData?.shopName || "");
  const [userName, setUserName] = useState(userData?.userName || "");
  const [shopEmail, setShopEmail] = useState(userData?.shopEmail || "");
  const [newUserId, setNewUserId] = useState(userId || "");
  const [shopDescription, setShopDescription] = useState(
    userData?.shopDescription || ""
  );
  const [shopAddress, setShopAddress] = useState(userData?.shopAddress || "");
  const [shopContact, setShopContact] = useState(userData?.phone || "");
  const [inputValue, setInputValue] = useState("");
  const [labels, setLabels] = useState(userData?.tags || []);

  const [initialImages, setInitialImages] = useState(
    userData?.shopImages || []
  );
  const [addedImages, setAddedImages] = useState([]);
  const [addedImageFiles, setAddedImageFiles] = useState([]);
  const [removedImagePublicIds, setRemovedImagePublicIds] = useState([]);

  const [imageLimitError, setImageLimitError] = useState(false);
  const [facebookLink, setFacebookLink] = useState(userData?.socialHandles?.facebook || "")
  const [instagramLink, setInstagramLink] = useState(userData?.socialHandles?.instagram || "")
  const [twitterLink, setTwitterLink] = useState(userData?.socialHandles?.twitter || "")
  const [whatsappLink, setWhatsappLink] = useState(userData?.socialHandles?.whatsapp || "")

  const handleWeekdayChange = (e) => {
    const { name, value } = e.target;
    setWeekdayTimings((prev) => ({ ...prev, [name]: value }));
  };

  const handleWeekendChange = (e) => {
    const { name, value } = e.target;
  
    // Convert time to minutes
    let [hours, minutes] = value.split(":").map(Number);
  
    // Round minutes to the nearest 30-minute interval
    minutes = minutes < 15 ? 0 : minutes < 45 ? 30 : 0;
    if (minutes === 0 && value.split(":")[1] >= 45) hours += 1; // Adjust hour if rounding up
  
    // Format back to HH:MM
    const newTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  
    // Update state
    setWeekendTimings((prev) => ({
      ...prev,
      [name]: newTime,
    }));
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

  const handleSubmitChanges = async () => {
    setIsEditing(true);
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
      dataToSend.append("shopName", shopName);
      dataToSend.append("shopEmail", shopEmail);
      dataToSend.append("shopDescription", shopDescription);
      dataToSend.append("shopAddress", shopAddress);
      dataToSend.append("userName", userName);
      dataToSend.append("shopContact", shopContact);
      dataToSend.append("userId", newUserId);
      dataToSend.append("uid", currentUser?.uid);
      dataToSend.append("facebookLink", facebookLink);
      dataToSend.append("instagramLink", instagramLink);
      dataToSend.append("twitterLink", twitterLink);
      dataToSend.append("whatsappLink", whatsappLink);
      labels.forEach((tag) => {
        dataToSend.append("shopTags[]", tag);
      });
      dataToSend.append("weekdayTimings", JSON.stringify(weekdayTimings));
      dataToSend.append("weekendTimings", JSON.stringify(weekendTimings));
      dataToSend.append("sundayClosed", isSundayOpen);
    } else {
      dataToSend = {
        shopName,
        shopEmail,
        shopDescription,
        shopAddress,
        shopContact,
        shopTags: labels,
        weekdayTimings: JSON.stringify(weekdayTimings),
        weekendTimings: JSON.stringify(weekendTimings),
        sundayClosed: isSundayOpen,
        userId: newUserId,
        uid: currentUser?.uid,
        userName,
        facebookLink,
        instagramLink,
        twitterLink,
        whatsappLink,
      };
    }

    try {
      const cancelToken = axios.CancelToken.source();
      const response = await axios.put(EDIT_SHOP_DETAILS, dataToSend, {
        cancelToken: cancelToken.token,
      });
      if (response) {
        toast({
          title: "Shop Details Updated Successfully",
        });
        dispatch(setUserDetails(response.data.data));
        forceUpdate();
        navigate(`/profile/${userId}`);
      }
    } catch (error) {
      if (axios.isCancel(error)) return setIsEditing(false);
      console.error(error);
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="shop-profile-edit-container">
      <div className="shop-images-wrapper">
        <div className="images-header">
          <h4 className="font-[500] ">Select Shop Images</h4>
          <div className="w-full flex items-center gap-4">
            <Input
              id="picture"
              className="hidden"
              onChange={handleSelectShopImages}
              type="file"
              multiple
              ref={imagesRef}
            />
            <Button
              disabled={
                initialImages.length + addedImageFiles.length > 9 ||
                imageLimitError
              }
              variant="primary"
              onClick={() => imagesRef.current.click()}
            >
              Add Images
            </Button>
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
        <div className="images-container hidden-scrollbar">
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

          {/* Display Added Images (previews from Blob URL) */}
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
      </div>

      <div className="edit-details-form hidden-scrollbar">
        <div className="grid w-full items-center gap-1.5">
          <Label className="text-[1rem]" htmlFor="shopName">
            Shop Name
          </Label>
          <Input
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            id="shopName"
            placeholder="Shop name"
          />
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label className="text-[1rem]" htmlFor="userName">
            User Name
          </Label>
          <Input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            id="userName"
            placeholder="User Name"
          />
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label className="text-[1rem]" htmlFor="shopName">
            User Id
          </Label>
          <Input
            type="text"
            value={newUserId}
            onChange={(e) => setNewUserId(e.target.value)}
            id="shopName"
            placeholder="Shop name"
          />
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label className="text-[1rem]" htmlFor="email">
            Email
          </Label>
          <Input
            type="email"
            value={shopEmail}
            onChange={(e) => setShopEmail(e.target.value)}
            id="email"
            placeholder="Shop email"
          />
        </div>

        <div className="grid w-full gap-1.5">
          <Label className="text-[1rem]" htmlFor="bio">
            Shop Description
          </Label>
          <Textarea
            placeholder="Write description about your shop."
            id="bio"
            className="h-24"
            value={shopDescription}
            onChange={(e) => setShopDescription(e.target.value)}
          />
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label className="text-[1rem]" htmlFor="shopAddress">
            Shop Address
          </Label>
          <Input
            type="text"
            value={shopAddress}
            onChange={(e) => setShopAddress(e.target.value)}
            id="shopAddress"
            placeholder="Shop address"
          />
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label className="text-[1rem]" htmlFor="shopContact">
            Shop Contact No
          </Label>
          <Input
            type="number"
            value={shopContact}
            onChange={(e) => setShopContact(e.target.value)}
            id="shopContact"
            placeholder="Shop contact no."
          />
        </div>

        <div className="w-full">
          <div className="relative border rounded-lg p-4">
            <Label className="text-[1rem]" htmlFor="address">
              Shop Tags
            </Label>
            {/* Textarea */}
            <input
              className="w-full px-4 h-12 my-4 focus:ring-0 border focus:outline-none resize-none text-[0.95rem]"
              placeholder="Type tag name and press Enter..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={3}
            />

            {/* Labels Display */}
            <div className=" mb-2 flex flex-wrap gap-4 items-center justify-start">
              {labels.map((label, index) => (
                <div
                  key={index}
                  className="flex w-max gap-4 justify-between items-center bg-[#149de7] text-white px-2 py-1 rounded-md"
                >
                  <span>{label}</span>
                  <button
                    onClick={() => deleteLabel(index)}
                    className="bg-red-500 text-sm hover:bg-red-700 w-6 h-6 flex items-center justify-center rounded-full"
                  >
                    <RxCross1 />
                  </button>
                </div>
              ))}
            </div>
          </div>
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
            <span className="text-[1rem] font-medium">Is Open on Sunday?</span>
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
                  onChange={(e)=>setFacebookLink(e.target.value)}
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
                  onChange={(e)=>setInstagramLink(e.target.value)}
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
                  onChange={(e)=>setTwitterLink(e.target.value)}
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
                  onChange={(e)=>setWhatsappLink(e.target.value)}
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
            onClick={() => navigate(`/profile/${userId}`)}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShopProfileEdit;
