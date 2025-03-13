import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  BOOKMARK_POST,
  GET_ALL_POSTS,
  LIKE_UNLIKE_POST,
} from "@/constants/routes";
import { useGlobalVariables } from "@/utils/useContext";
import axios from "axios";
import moment from "moment";
import {
  FaHeart,
  FaRegBookmark,
  FaRegHeart,
  FaShareNodes,
} from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CreatePostHeader from "./CreatePostHeader";

const ForumBlogs = () => {
  const [allPosts, setAllPosts] = useState([]);
  const userId = useSelector((state) => state.userDetailReducer.userData._id);
  const userData = useSelector((state) => state.userDetailReducer.userData);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { fetchPostreducer, forceUpdateFetchPost, forceUpdate } =
    useGlobalVariables();

  useEffect(() => {
    setLoading(true);
    axios
      .get(GET_ALL_POSTS)
      .then(({ data }) => {
        setAllPosts(data.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [fetchPostreducer]);

  const likeUnlikePost = async (postId) => {
    try {
      const cancelToken = axios.CancelToken.source();
      const response = await axios.post(
        LIKE_UNLIKE_POST,
        { postId, userId },
        { cancelToken: cancelToken.token }
      );
      if (response.status === 200) {
        forceUpdateFetchPost();
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

  const viewProfile = (personId) => {
    if (personId === userData?.userId) return;
    navigate(`/profile/view/${personId}`);
  };

  return (
    <div className="page-container hidden-scrollbar ">
      <div className="max-[450px]:w-[95%] w-[85%] mx-auto lg:hidden">
        <CreatePostHeader />
      </div>
      <div className=" border max-[450px]:w-[95%] w-[85%] mx-auto pt-4 rounded-xl shadow-md">
        {/* Forum Blogs */}
        <div className=" h-[80vh] overflow-y-auto hidden-scrollbar">
          {allPosts.length > 0 ? (
            allPosts.map((post, index) => (
              <div
                key={index}
                className="bg-white max-[450px]:p-0 max-[450px]:pb-4 p-4 max-[450px]:rounded-none max-[450px]:shadow-none max-[450px]:border-b-2 rounded-lg shadow-md text-sm my-4 w-[90%] mx-auto"
              >
                {/* Header */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <div
                      className="w-10 h-10 rounded-full overflow-hidden cursor-pointer"
                      onClick={() => viewProfile(post?.userId?.userId)}
                    >
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
                    </div>
                    <div>
                      <h3 className="font-bold">{post?.userId?.userName}</h3>
                      <small className="text-gray-500">
                        {moment(post.createdAt).fromNow()}
                      </small>
                    </div>
                  </div>
                </div>

                {/* Feed Photo */}
                <div className="rounded-lg overflow-hidden my-4">
                  {post?.postImages?.length === 1 ? (
                    <img
                      src={post?.postImages?.[0]?.url}
                      alt="Feed"
                      className="w-full h-[25rem] object-contain"
                    />
                  ) : (
                    <Carousel className="w-full h-[15rem] sm:h-[25rem]">
                      <CarouselContent>
                        {post?.postImages?.map((img, index) => (
                          <CarouselItem key={index} className="w-full h-full">
                            <img
                              src={img.url}
                              alt="Feed"
                              className="w-full h-full object-contain"
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  )}
                </div>
                {/* Action Buttons */}
                <div className="flex justify-between items-center text-xl my-2">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => likeUnlikePost(post?._id)}
                        className="transition-all duration-300"
                      >
                        {post?.likedBy?.some(
                          (user) => user._id.toString() === userId.toString()
                        ) ? (
                          <FaHeart className="text-red-500" />
                        ) : (
                          <FaRegHeart />
                        )}
                      </button>
                      {post?.likedBy?.length > 0 && (
                        <p className="text-sm font-bold">
                          {post?.likedBy?.length}
                        </p>
                      )}
                    </div>
                    <FaShareNodes />
                  </div>
                  {userData?.bookmarkedPosts?.some(
                    (item) => item._id === post?._id
                  ) ? (
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

                {/* Liked By */}
                {post?.likedBy?.length > 0 && (
                  <div className="flex items-center ml-2 my-2">
                    {post?.likedBy?.length > 3 && (
                      <div className="flex ml-4 relative">
                        {post?.likedBy
                          ?.slice(-4) // ✅ Show only the last 4 users (reversed order)
                          .reverse() // ✅ Reverse AFTER slicing for correct order
                          .map((user, index) => (
                            <span
                              key={user._id} // ✅ Use user._id as a unique key
                              className="w-6 h-6 rounded-full overflow-hidden border-2 border-white absolute top-[-12px]"
                              style={{ right: `${index * -18}px` }} // ✅ Correct inline positioning
                            >
                              <img
                                src={user?.profilePic?.url}
                                alt={user.userName || "User"}
                                className="w-full h-full object-cover"
                              />
                            </span>
                          ))}
                      </div>
                    )}
                    {post?.likedBy?.length > 3 && (
                      <p className={`ml-12 text-sm`}>
                        Liked by <b>{post?.likedBy?.at(-1)?.userName}</b> and{" "}
                        <b>{post?.likedBy?.length - 1} others</b>
                      </p>
                    )}
                  </div>
                )}

                {/* Caption */}
                <div className="text-sm max-[450px]:ml-0 ml-2">
                  <div className="mt-4">
                    <span>
                      <b>{post?.userId?.userName + " "}</b>
                    </span>
                    {post?.postContent
                      ?.split(/\s+/)
                      .map((word, index) =>
                        post?.tags?.includes(word) ? (
                          <span key={index}></span>
                        ) : (
                          <span key={index}>{word} </span>
                        )
                      )}
                  </div>

                  {post?.tags && post?.tags?.length > 0 && (
                    <div className="mt-2">
                      <strong>Tags:</strong>{" "}
                      {post?.tags?.map((word, index) => (
                        <span key={index} className="text-blue-500 ">
                          {word}{" "}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-full">
              No Posts
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumBlogs;
