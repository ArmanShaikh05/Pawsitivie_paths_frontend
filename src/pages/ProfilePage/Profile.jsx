import ManagePetCard from "@/components/Cards/ManageOwnedPetCard/ManagePetCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GET_USER_DETAILS } from "@/constants/routes";
import { useAuth, useGlobalVariables } from "@/utils/useContext";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "./profile.scss";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PostModal from "./PostModal";
import NoBookmarks from "@/components/NoDataPages/NoBookmarks";
import NoOwnedPets from "@/components/NoDataPages/NoOwnedPets";
import NoPostsYet from "@/components/NoDataPages/NoPosts";

const Profile = () => {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const { reducerValue } = useGlobalVariables();
  const navigate = useNavigate();

  const posts = useSelector((state) => state.userDetailReducer.userData?.posts);
  const bookmarks = useSelector((state) => state.userDetailReducer.userData?.bookmarkedPosts);

  const [userData, setUserData] = useState();
  const [followingCount, setFollowingCount] = useState(0);
  const fallbackText = userData?.userName
    .split(" ")
    .map((name) => name[0])
    .join("");

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();
    axios
      .get(`${GET_USER_DETAILS}/${currentUser.uid}`, {
        cancelToken: cancelToken.token,
      })
      .then(({ data }) => {
        setUserData(data.data);
        setFollowingCount(data.followingCount);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        console.log(err);
      });
  }, [currentUser.uid, reducerValue]);

  return (
    <div className="profile-container-area hidden-scrollbar">
      <div className="profile-section-1">
        <div className="basic-details-box">
          <Avatar className="profile-image">
            <AvatarImage
              className="object-cover"
              src={userData?.profilePic?.url}
            />
            <AvatarFallback className="text-[3rem]">
              {fallbackText}
            </AvatarFallback>
          </Avatar>
          <h2>{userData?.userName}</h2>
          <p className="text-sm">{`#${userId}`}</p>
          <div className="sub-detail-box">
            <div className="detail">
              <h2>{userData?.posts?.length || 0}</h2>
              <p>Posts</p>
            </div>

            <div className="detail md">
              <h2>{followingCount}</h2>
              <p>Followers</p>
            </div>

            <div className="detail">
              <h2>{userData?.friends?.length || 0}</h2>
              <p>Following</p>
            </div>
          </div>
          <div className="profile-btns">
            <Button variant="primary" onClick={() => navigate("edit")}>
              <FaEdit />
              <p>Edit Profile</p>
            </Button>
          </div>
        </div>

        <div className="more-details-box">
          {userData?.bio && userData?.bio !== "" && (
            <div className="detail">
              <Badge className="detail-badge" variant="default">
                Bio
              </Badge>
              <p>{userData?.bio}</p>
            </div>
          )}

          <div className="detail">
            <Badge className="detail-badge" variant="default">
              Email
            </Badge>
            <p>{userData?.email}</p>
          </div>

          {userData?.DOB && userData?.DOB !== "" && (
            <div className="detail">
              <Badge className="detail-badge" variant="default">
                DOB
              </Badge>
              <p>{moment(userData?.DOB).format("Do MMM YYYY")}</p>
            </div>
          )}

          {userData?.favouritePets && userData?.favouritePets.length !== 0 && (
            <div className="detail">
              <Badge className="detail-badge" variant="default">
                Favourite Pets
              </Badge>
              <p>
                {userData?.favouritePets.toString().split(",").join(" | ")}s
              </p>
            </div>
          )}

          {userData?.address && userData?.address !== "" && (
            <div className="detail">
              <Badge className="detail-badge" variant="default">
                Address
              </Badge>
              <p>{userData?.address}</p>
            </div>
          )}
        </div>
      </div>

      <Tabs
        defaultValue="posts"
        className="mt-6 mx-auto w-full flex items-center flex-col"
      >
        <TabsList className="grid w-max h-[2.5rem] ml-8 grid-cols-3 gap-x-8">
          <TabsTrigger className={"h-full"} value="posts">
            Posts
          </TabsTrigger>
          <TabsTrigger className={"h-full"} value="pets">
            Owned Pets
          </TabsTrigger>
          <TabsTrigger className={"h-full"} value="saved">
            Bookmarked
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <div className="owned-pets">
            <div className="owned-pets-header">
              <h2>Your Posts</h2>
            </div>
            {
              posts?.length > 0 ? (
                <div className="w-full grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-1 gap-y-4 px-[2rem] place-items-center">
              {posts.slice().reverse().map((item, index) => (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <img
                      className="w-[95%] aspect-square object-cover border-2 p-2 rounded-[10px] overflow-hidden"
                      src={item?.postImages?.[0]?.url}
                    />
                  </DialogTrigger>
                  <DialogContent className="max-w-max">
                    <DialogHeader>
                      <DialogTitle>
                        <div></div>
                      </DialogTitle>
                      <DialogDescription>
                        <div></div>
                      </DialogDescription>
                    </DialogHeader>
                    <PostModal post={item} />
                  </DialogContent>
                </Dialog>
              ))}
            </div>
              ):(
                <div className="w-[80vw]">
                  <NoPostsYet />
                </div>
              )
            }
          </div>
        </TabsContent>
        <TabsContent value="pets">
          <div className="owned-pets">
            <div className="owned-pets-header">
              <h2>Owned Pets</h2>
              <Button
                variant="primary"
                onClick={() => navigate("manage-owned-pets")}
              >
                Manage
              </Button>
            </div>
            <div className="owned-pets-container">
            {userData?.ownedPets && userData?.ownedPets?.length > 0 ? (
              <div className="owned-pets-container">
                {userData?.ownedPets?.map((pet, index) => (
                  <ManagePetCard key={index} petData={pet} />
                ))}
              </div>
            ) : (
              <div className="w-[80vw]">
                <NoOwnedPets />
              </div>
            )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="saved">
          <div className="owned-pets">
            <div className="owned-pets-header">
              <h2>Bookmarked Posts</h2>
            </div>

            {
              bookmarks.length > 0 ? (
                <div className="w-full grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-1 gap-y-4 px-[2rem] place-items-center">
              { bookmarks.slice().reverse().map((item, index) => (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <img
                      className="w-[95%] aspect-square object-cover border-2 p-2 rounded-[10px] overflow-hidden"
                      src={item?.postImages?.[0]?.url}
                    />
                  </DialogTrigger>
                  <DialogContent className="max-w-max">
                    <DialogHeader>
                      <DialogTitle>
                        <div></div>
                      </DialogTitle>
                      <DialogDescription>
                        <div></div>
                      </DialogDescription>
                    </DialogHeader>
                    <PostModal post={item} isEditable={false}/>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
              ) : (
                <div className="w-[85vw]">
                  <NoBookmarks />
                </div>
              )
            }
          </div>
        </TabsContent>
      </Tabs>

      {/* {showPostModal && <PostModal post={activePost} />} */}
    </div>
  );
};

export default Profile;
