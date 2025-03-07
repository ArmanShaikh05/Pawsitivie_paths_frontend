import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import ChatComponent from "./ChatComponent";
import { useState } from "react";

import FriendRequests from "./FriendRequests";
import SearchUser from "./SearchUser";
import { useSearchParams } from "react-router-dom";
import Messages from "./Messages";
import { useGlobalVariables } from "@/utils/useContext";
import { useEffect } from "react";
import axios from "axios";
import { GET_ALL_RECIEVED_REQUESTS } from "@/constants/routes";
import { useSelector } from "react-redux";

const ForumMessages = () => {
  const userId = useSelector((state) => state.userDetailReducer.userData._id);
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get("chatid");
  const { friendRequestCount, setFriendRequestCount } = useGlobalVariables();

  const [selectTab, setSelectedTab] = useState("messages");

  useEffect(() => {
    axios
      .get(`${GET_ALL_RECIEVED_REQUESTS}?userId=${userId}`)
      .then(({ data }) => {
        setFriendRequestCount(data.data.length);
      })
      .catch((err) => console.log(err));
  }, [userId]);

  return (
    <div className="page-container hidden-scrollbar">
      {chatId ? (
        <div className="rounded-xl shadow-md bg-white h-[69vh] w-full">
          <ChatComponent chatId={chatId} />
        </div>
      ) : (
        <Card className="p-4 rounded-xl shadow-md bg-white h-[69vh] w-full">
          {/* Message Categories */}
          <div className="flex justify-between text-sm text-gray-500 border-b">
            <h6
              className={`flex-1 text-center pb-2 border-b-4 ${
                selectTab === "messages"
                  ? "border-black font-semibold "
                  : "border-transparent"
              } cursor-pointer`}
              onClick={() => setSelectedTab("messages")}
            >
              Messages
            </h6>
            <h6
              className={`flex-1 text-center pb-2 border-b-4  ${
                selectTab === "search-user"
                  ? "border-black font-semibold "
                  : "border-transparent"
              } cursor-pointer`}
              onClick={() => setSelectedTab("search-user")}
            >
              Search User
            </h6>
            <h6
              className={`flex-1 text-center pb-2 border-b-4 ${
                selectTab === "requests"
                  ? "border-black font-semibold "
                  : "border-transparent"
              } cursor-pointer`}
              onClick={() => setSelectedTab("requests")}
            >
              {`Requests (${friendRequestCount})`}
            </h6>
          </div>

          {/* Messages */}
          <ScrollArea className="h-[93%]">
            {selectTab === "messages" ? (
              <Messages />
            ) : selectTab === "requests" ? (
              <FriendRequests />
            ) : (
              <SearchUser />
            )}
          </ScrollArea>
        </Card>
      )}
    </div>
  );
};

export default ForumMessages;
