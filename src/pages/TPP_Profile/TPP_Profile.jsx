import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GET_USER_DETAILS_BY_ID } from "@/constants/routes";
import axios from "axios";
import moment from "moment";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import PostModal from "../ProfilePage/PostModal";
import ManagePetCard from "@/components/Cards/ManageOwnedPetCard/ManagePetCard";
import NoOwnedPets from "@/components/NoDataPages/NoOwnedPets";
import NoPostsYet from "@/components/NoDataPages/NoPosts";
import { useGlobalVariables } from "@/utils/useContext";

const TPP_Profile = () => {
  const { userId } = useParams();
  const { reducerValue } = useGlobalVariables();
  const [userData, setUserData] = useState();
  const [followingCount, setFollowingCount] = useState(0);
  const fallbackText = userData?.userName
    .split(" ")
    .map((name) => name[0])
    .join("");

  useEffect(() => {
    console.log(userId);
    const cancelToken = axios.CancelToken.source();
    axios
      .post(
        GET_USER_DETAILS_BY_ID,
        {
          id: userId,
        },
        {
          cancelToken: cancelToken.token,
        }
      )
      .then(({ data }) => {
        console.log(data.data);
        setUserData(data.data);
        setFollowingCount(data.followingCount);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        console.log(err);
      });
  }, [userId,reducerValue]);
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
        <TabsList className="grid w-max h-[2.5rem] ml-8 grid-cols-2 gap-x-8">
          <TabsTrigger className={"h-full"} value="posts">
            Posts
          </TabsTrigger>
          <TabsTrigger className={"h-full"} value="pets">
            Owned Pets
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <div className="owned-pets">
            <div className="owned-pets-header">
              <h2>Your Posts</h2>
            </div>
            {userData?.posts?.length > 0 ? (
              <div className="w-full grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-1 gap-y-4 px-[2rem] place-items-center">
                {userData?.posts
                  .slice()
                  .reverse()
                  .map((item, index) => (
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
                        <PostModal post={item} isEditable={false} />
                      </DialogContent>
                    </Dialog>
                  ))}
              </div>
            ) : (
              <div className="w-[80vw]">
                <NoPostsYet TppMode={true} />
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="pets">
          <div className="owned-pets">
            <div className="owned-pets-header">
              <h2>Owned Pets</h2>
            </div>
            {userData?.ownedPets && userData?.ownedPets?.length > 0 ? (
              <div className="owned-pets-container">
                {userData?.ownedPets?.map((pet, index) => (
                  <ManagePetCard key={index} petData={pet} />
                ))}
              </div>
            ) : (
              <div className="w-[85vw]">
                <NoOwnedPets TppProfile={true} />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TPP_Profile;
