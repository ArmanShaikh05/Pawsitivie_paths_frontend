/* eslint-disable react/prop-types */

import Loader from "@/components/Loader/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ACCEPT_FRIEND_REQUEST,
  GET_PENDING_FRIEND_REQUESTS,
  SEND_FRIEND_REQUEST,
} from "@/constants/routes";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";

const Friends = ({ loading, searchResultArray }) => {
  const [addedUsers, setAddedUsers] = useState([]);
  const [requestsRecievedUsers, setRequestRecievedUsers] = useState([]);
  const userId = useSelector((state) => state.userDetailReducer.userData._id);
  const friends = useSelector(
    (state) => state.userDetailReducer.userData.friends
  );

  const [acceptingRequests, setAcceptingRequests] = useState(false);

  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    axios
      .get(`${GET_PENDING_FRIEND_REQUESTS}?userId=${userId}`)
      .then(({ data }) => {
        setAddedUsers(data?.requestsSent);
        setRequestRecievedUsers(data?.requestsReceived);
      })
      .catch((err) => console.log(err));
  }, [userId, reducerValue]);

  const handleAdd = async (id) => {
    try {
      const response = await axios.post(SEND_FRIEND_REQUEST, {
        senderId: userId,
        receiverId: id,
      });

      if (response.status === 200) {
        forceUpdate();
        return toast({
          title: "Friend request sent successfully",
        });
      }
    } catch (error) {
      if (error.status === 400) {
        return toast({
          title: error.response.data.message,
          variant: "destructive",
        });
      }
      console.log(error);
    }
  };

  const acceptFriendRequest = async (senderId) => {
    try {
      setAcceptingRequests(true);
      const response = await axios.post(ACCEPT_FRIEND_REQUEST, {
        senderId: senderId,
        receiverId: userId,
      });

      if (response.status === 200) {
        forceUpdate();
        return toast({
          title: "Friend request accepted successfully",
        });
      }
    } catch (error) {
      if (error.status === 400) {
        return toast({
          title: error.response.data.message,
        });
      }

      console.log(error);
    } finally {
      setAcceptingRequests(false);
    }
  };

  return (
    <div className=" w-full bg-white shadow-lg rounded-lg p-4 overflow-hidden border max-h-[24rem] overflow-y-auto hidden-scrollbar">
      {loading ? (
        <Loader position={"top"} />
      ) : searchResultArray?.length > 0 ? (
        searchResultArray.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between py-2 border-b last:border-none"
          >
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src={user.img}
                  alt={user.name}
                  className="object-cover"
                />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((word) => word.charAt(0))
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm text-gray-900">
                  {user.name}
                </p>
              </div>
            </div>
            {requestsRecievedUsers.some((item) => item.senderId === user.id) ? (
              <Button
                onClick={() => acceptFriendRequest(user.id)}
                className={"px-4 bg-blue-500 text-white"}
                disabled={acceptingRequests}
              >
                Follow Back
              </Button>
            ) : addedUsers.some((item) => item.receiverId === user.id) ? (
              <Button
                onClick={() => handleAdd(user.id)}
                className={"px-4 bg-gray-200 text-gray-600"}
                disabled={true}
              >
                Added
              </Button>
            ) : friends.some((id) => id === user.id) ? (
              <div></div>
            ) : (
              <Button
                onClick={() => handleAdd(user.id)}
                className={"px-4 bg-blue-500 text-white"}
                variant={"primary"}
              >
                Add
              </Button>
            )}
          </div>
        ))
      ) : (
        <div>No users found</div>
      )}
    </div>
  );
};

export default Friends;
