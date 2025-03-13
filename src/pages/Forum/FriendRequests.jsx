import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ACCEPT_FRIEND_REQUEST,
  GET_ALL_RECIEVED_REQUESTS,
  REJECT_FRIEND_REQUEST,
} from "@/constants/routes";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "@/utils/features";
import { useGlobalVariables } from "@/utils/useContext";
import axios from "axios";
import { Check, X } from "lucide-react";
import moment from "moment";
import { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";



export default function FriendRequests() {
  const userId = useSelector((state) => state.userDetailReducer.userData._id);
  const { setFriendRequestCount } = useGlobalVariables();

  const [requests, setRequests] = useState([]);
  const [acceptingRequests, setAcceptingRequests] = useState(false);
  const [rejectingRequests, setRejectingRequests] = useState(false);
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    axios
      .get(`${GET_ALL_RECIEVED_REQUESTS}?userId=${userId}`)
      .then(({ data }) => {
        setRequests(data.data);
        setFriendRequestCount(data.data.length);
      })
      .catch((err) => console.log(err));
  }, [userId, reducerValue]);

  const groupedRequests = requests.reduce((acc, req) => {
    const formattedDate = formatDate(req.createdAt);
    // console.log(formattedDate)
    if (!acc[formattedDate]) acc[formattedDate] = [];
    acc[formattedDate].push(req);
    return acc;
  }, {});

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

  const rejectFriendRequest = async (senderId) => {
    try {
      setRejectingRequests(true);
      const response = await axios.post(REJECT_FRIEND_REQUEST, {
        senderId: senderId,
        receiverId: userId,
      });

      if (response.status === 200) {
        forceUpdate();
        return toast({
          title: "Friend request rejected successfully",
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
      setRejectingRequests(false);
    }
  };

  return (
    <Card className="w-full bg-white overflow-hidden rounded-none border-none">
      <CardContent className="p-4 rounded-none">
        {Object.keys(groupedRequests).length > 0 ? (
          Object.keys(groupedRequests).map((date) => (
            <div key={date} className="mb-4">
              <h3 className="text-sm text-gray-500 font-semibold mb-2">
                {date}
              </h3>
              {groupedRequests[date].map((req, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10 rounded-full mr-3">
                      <AvatarImage
                        src={req?.senderId?.profilePic?.url}
                        alt={req?.senderId?.userName}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {req?.senderId?.userName
                          .split(" ")
                          .map((word) => word.charAt(0))
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{req?.senderId?.userName}</p>
                      <p className="text-xs text-gray-400">
                        {moment(req.createdAt).fromNow()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="p-1"
                      disabled={rejectingRequests}
                      onClick={() => rejectFriendRequest(req?.senderId?._id)}
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </Button>
                    <Button
                      variant="primary"
                      size="icon"
                      className="p-1"
                      disabled={acceptingRequests}
                      onClick={() => acceptFriendRequest(req?.senderId?._id)}
                    >
                      <Check className="w-5 h-5 text-white" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="text-sm">No requests</div>
        )}
      </CardContent>
    </Card>
  );
}
