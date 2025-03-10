/* eslint-disable react/prop-types */
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  BOOKMARK_POST,
  DELETE_POST,
  EDIT_POST,
  LIKE_UNLIKE_POST,
} from "@/constants/routes";
import { toast } from "@/hooks/use-toast";
import { useGlobalVariables } from "@/utils/useContext";
import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { useSelector } from "react-redux";

const PostModal = ({ post, isEditable = true }) => {
  const [editingMode, setEditingMode] = useState(false);
  const [newContent, setNewContent] = useState(post?.postContent || "");
  const newTags = post?.tags || [];
  const [newExtractedTags, setNewExtractedTags] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);
  const userId = useSelector((state) => state.userDetailReducer.userData._id);
  const userData = useSelector((state) => state.userDetailReducer.userData);
  const { forceUpdate } = useGlobalVariables();

  const handleInputChange = (e) => {
    const inputText = e.target.value;
    setNewContent(inputText);

    // Extract words starting with #
    const extractedTags = inputText.match(/#\w+/g) || [];
    setNewExtractedTags(extractedTags);
  };

  const editPost = async () => {
    const uniqueTags = Array.from(new Set([...newTags, ...newExtractedTags]));

    try {
      setIsEditing(true);
      const response = await axios.post(EDIT_POST, {
        postId: post?._id,
        newContent,
        newTags: uniqueTags,
      });

      if (response.status === 200) {
        toast({
          title: "Post updated successfully",
        });
        setEditingMode(false);
        forceUpdate();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsEditing(false);
    }
  };

  const deletePost = async () => {
    try {
      setIsDeleting(true);
      const response = await axios.post(DELETE_POST, {
        postId: post?._id,
      });

      if (response.status === 200) {
        toast({
          title: "Post deleted successfully",
        });
        forceUpdate();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const likeUnlikePost = async (postId) => {
    try {
      const cancelToken = axios.CancelToken.source();
      const response = await axios.post(
        LIKE_UNLIKE_POST,
        { postId, userId },
        { cancelToken: cancelToken.token }
      );
      if (response.status === 200) {
        forceUpdate();
      }
    } catch (error) {
      if (axios.isCancel(error)) return;
      console.log(error);
    }
  };

  const bookmarkPost = async (postId) => {
    try {
      const cancelToken = axios.CancelToken.source();
      const response = await axios.post(
        BOOKMARK_POST,
        { postId, userId },
        { cancelToken: cancelToken.token }
      );
      if (response.status === 200) {
        forceUpdate();
      }
    } catch (error) {
      if (axios.isCancel(error)) return;
      console.log(error);
    }
  };

  return (
    <Card className="w-[50vw] max-[768px]:w-[65vw] bg-white rounded-lg shadow-md">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src={post?.userId?.profilePic?.url}
                alt={"Profile pic"}
                className="object-cover"
              />
              <AvatarFallback>
                {post?.userId?.userName
                  .split(" ")
                  .map((word) => word.charAt(0))
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold text-sm">
              {post?.userId?.userName}
            </span>
          </div>
          {isEditable && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span className="transition-all ease-in rounded-full p-1 hover:bg-gray-100 cursor-pointer">
                  <MoreHorizontal className="text-gray-500 " />
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setEditingMode(true)}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeletePostModal(true)}
                  className="cursor-pointer"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Image */}
        <div className="relative">
          {post?.postImages?.length === 1 ? (
            <img
              src={post?.postImages?.[0]?.url}
              alt="Feed"
              className="w-full h-[25rem] max-[600px]:h-[18rem] max-[430px]:h-[13rem] object-contain"
            />
          ) : (
            <Carousel className="w-full ">
              <CarouselContent>
                {post?.postImages?.map((img, index) => (
                  <CarouselItem key={index} className="w-[90%] h-[25rem] max-[600px]:h-[18rem] max-[430px]:h-[13rem]">
                    <img
                      src={img.url}
                      alt="Feed"
                      className="w-full h-full object-contain"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </Carousel>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between py-3 items-center">
          <div className="flex gap-3">
            <button
              onClick={() => likeUnlikePost(post?._id)}
              className="transition-all duration-300"
            >
              {post?.likedBy?.some(
                (user) => user?._id.toString() === userId.toString()
              ) ? (
                <FaHeart className="text-red-500 w-5 h-5 " />
              ) : (
                <FaRegHeart className={"w-5 h-5 "} />
              )}
            </button>
            <p className="text-sm font-semibold">
              {post?.likedBy?.length} likes
            </p>
          </div>
          {userData?.bookmarkedPosts?.some((item) => item._id === post?._id) ? (
            <FaBookmark
              onClick={() => bookmarkPost(post?._id)}
              className=" fill-[#149de7] cursor-pointer"
            />
          ) : (
            <FaRegBookmark
              className="cursor-pointer"
              onClick={() => bookmarkPost(post?._id)}
            />
          )}
        </div>

        {/* Likes & Comments */}

        <ScrollArea className=" h-max ">
          {editingMode ? (
            <div>
              <Textarea
                value={newContent}
                onChange={(e) => handleInputChange(e)}
                className={" max-h-[7rem]"}
              />
              <div className="w-full flex justify-end items-center gap-4 mt-2">
                <Button
                  variant={"destructive"}
                  onClick={() => {
                    setEditingMode(false);
                    setNewContent(post?.postContent);
                  }}
                >
                  Cancel
                </Button>
                <Button disabled={isEditing} onClick={() => editPost()}>
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm mt-1 max-h-[7rem]">
              <span className="font-semibold">{post?.userId?.userName}</span>{" "}
              {post?.postContent
                ?.split(/\s+/)
                .map((word, index) =>
                  post?.tags?.includes(word) ? (
                    <span key={index}></span>
                  ) : (
                    <span key={index}>{word} </span>
                  )
                )}
            </p>
          )}

          {!editingMode && post?.tags && post?.tags?.length > 0 && (
            <div className="mt-2">
              <strong className="text-sm">Tags:</strong>{" "}
              {post?.tags?.map((word, index) => (
                <span key={index} className="text-blue-500 text-sm ">
                  {word}{" "}
                </span>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>

      {showDeletePostModal && (
        <AlertDialog
          open={showDeletePostModal}
          onOpenChange={setShowDeletePostModal}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Do you really want to delete this post?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                post from your profile.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={isDeleting}
                onClick={() => deletePost()}
              >
                {" "}
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Card>
  );
};

export default PostModal;
