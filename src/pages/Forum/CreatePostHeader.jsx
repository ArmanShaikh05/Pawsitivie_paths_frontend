import CircularProgress from "@/components/CircularProgress/CircularProgress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { CREATE_NEW_POST } from "@/constants/routes";
import { toast } from "@/hooks/use-toast";
import { useGlobalVariables } from "@/utils/useContext";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import { useRef, useState } from "react";
import { FaRegSmile } from "react-icons/fa";
import { GoFileMedia } from "react-icons/go";
import { IoIosSend } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";
import { useSelector } from "react-redux";

const CreatePostHeader = () => {
  const userId = useSelector((state) => state.userDetailReducer.userData._id);
  const userData = useSelector((state) => state.userDetailReducer.userData);
  const { forceUpdateFetchPost } = useGlobalVariables();

  const [postContent, setPostContent] = useState("");
  const [showEmogiPicker, setShowEmogiPicker] = useState(false);
  const editImagesRef = useRef(null);
  const [imagesBlob, setImagesBlob] = useState([]);
  const [imagesFiles, setImagesFiles] = useState([]);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [tags, setTags] = useState([]);

  const handleInputChange = (e) => {
    const inputText = e.target.value;
    setPostContent(inputText);

    // Extract words starting with #
    const extractedTags = inputText.match(/#\w+/g) || [];
    setTags(extractedTags);
  };

  const addPostImages = async () => {
    const files = Array.from(editImagesRef.current.files);

    if (imagesBlob.length + files.length > 10)
      return toast({
        title: "Images cannot be more than 10",
        variant: "destructive",
      });

    if (files.length > 0) {
      const newPreviews = files.map((file) => URL.createObjectURL(file)); // Create preview URL for each file
      setImagesBlob((prevImages) => [...prevImages, ...newPreviews]); // Store blob URL for previews
      setImagesFiles((prevFiles) => [...prevFiles, ...files]); // Store actual files for submission
    }
  };

  const removePostImage = (index) => {
    setImagesBlob((prevImages) => prevImages.filter((_, i) => i !== index));
    setImagesFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const creatingPost = async () => {
    if (imagesFiles.length > 10)
      return toast({
        title: "Images cannot be more than 10",
        variant: "destructive",
      });

      if (imagesFiles.length === 0)
        return toast({
          title: "Please select atleast 1 image",
          variant: "destructive",
        });

    try {
      setIsCreatingPost(true);

      const dataToSend = new FormData();

      dataToSend.append("postContent", postContent);
      tags.length > 0 &&
        tags.forEach((tag) => dataToSend.append("tags[]", tag));
      imagesFiles.length > 0 &&
        imagesFiles.forEach((file) => dataToSend.append("files", file));
      dataToSend.append("userId", userId);

      const response = await axios.post(CREATE_NEW_POST, dataToSend);

      if (response.status === 200) {
        setImagesBlob([]);
        setImagesFiles([]);
        setTags([]);
        setPostContent("");
        forceUpdateFetchPost();
        return toast({
          title: "Post created successfully",
        });
      }
    } catch (error) {
      if (axios.isCancel(error)) return;
      if (error.status === 400 && error.response.data?.message) {
        return toast({
          title: error.response.data.message,
          variant: "destructive",
        });
      }
      console.log(error);
    } finally {
      setIsCreatingPost(false);
    }
  };

  return (
    <div className="w-full mb-4 pb-9 relative flex flex-col gap-2 border px-4 py-2 justify-center rounded-lg shadow-lg">
      <div className="w-full flex gap-2 ">
        <Avatar>
          <AvatarImage
            src={userData?.profilePic?.url}
            className="object-cover"
            alt="@shadcn"
          />
          <AvatarFallback>
            {userData?.userName
              ?.split(" ")
              .map((word) => word.charAt(0))
              .join("")}
          </AvatarFallback>
        </Avatar>
        <input
          type="file"
          className="hidden"
          multiple
          maxLength={10}
          name="files"
          accept="image/png, image/jpeg, image/jpg, image/gif, image/webp, image/svg+xml"
          onChange={addPostImages}
          ref={editImagesRef}
        />

        <div className="w-[80%] flex flex-col gap-2">
          {imagesBlob && imagesBlob.length > 0 && (
            <ScrollArea className="w-full whitespace-nowrap border p-2">
              <div className="flex gap-2">
                {imagesBlob.map((image, index) => (
                  <div
                    key={index}
                    className="relative w-36 h-24 rounded-md overflow-hidden border p-2"
                  >
                    <img
                      src={image}
                      alt=""
                      className="h-full w-full object-contain rounded-md "
                    />
                    <button
                      className="absolute top-0 right-0 p-1 text-white bg-red-600 rounded-full"
                      onClick={() => removePostImage(index)}
                    >
                      <RxCross1 size={10} />
                    </button>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}

          <Textarea
            value={postContent}
            onChange={(e) => handleInputChange(e)}
            placeholder="Whats on your mind?"
            className="max-h-[12rem] border-none text-xs sm:text-sm outline-none hidden-scrollbar focus-visible:ring-0"
            maxLength={500}
          />
        </div>
        <div className="w-full flex gap-2 pl-12 pr-16 absolute bottom-2">
          <div className="flex flex-1 gap-2">
            <GoFileMedia
              className="h-5 w-5 cursor-pointer"
              onClick={() => {
                if (imagesBlob.length > 10)
                  return toast({
                    title: "Images cannot be more than 10",
                    variant: "destructive",
                  });
                editImagesRef.current.click();
              }}
            />
            <FaRegSmile
              className="h-5 w-5 cursor-pointer"
              onClick={() => setShowEmogiPicker(!showEmogiPicker)}
            />
          </div>
          {postContent.length > 0 && (
            <CircularProgress progress={postContent.length} maxValue={500} />
          )}
        </div>
        <Button
          variant={"primary"}
          className="rounded-full w-15 aspect-square p-0 mt-2"
          disabled={postContent.trim() === "" || isCreatingPost ? true : false}
          onClick={() => creatingPost()}
        >
          <IoIosSend size={20} />
        </Button>
      </div>

      <EmojiPicker
        open={showEmogiPicker}
        onEmojiClick={(data) => setPostContent((prev) => prev + data.emoji)}
        lazyLoadEmojis={true}
        style={{
          position: "absolute",
          top: "105%",
          left: "0%",
          zIndex: 1000,
        }}
      />
    </div>
  );
};

export default CreatePostHeader;
