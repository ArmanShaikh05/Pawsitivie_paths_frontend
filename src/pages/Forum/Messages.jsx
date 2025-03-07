import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { DELETE_CONVERSATION, GET_ALL_CONVERSATION } from "@/constants/routes";
import {
  clearMessages,
  updateMessageData,
} from "@/redux/reducers/messagesSlice";
import { useSocket } from "@/utils/useContext";
import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

const Messages = () => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.userDetailReducer?.userData?._id);
  const messagesData = useSelector(
    (state) => state.messagesReducer.messagesData
  );
  const dispatch = useDispatch();
  const [isDeletingChat, setIsDeletingChat] = useState(false);

  const [conversations, setConversations] = useState([]);

  const { onlineUsers, socket } = useSocket();
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    axios
      .get(`${GET_ALL_CONVERSATION}?userId=${userId}`)
      .then(({ data }) => {
        let formattedData = data?.data.map((item) => {
          let user = item.users?.filter((u) => u._id !== userId)?.[0];
          return {
            id: item?._id,
            name: user?.userName,
            friendId: user?._id,
            message: messagesData[item?._id]
              ? messagesData[item?._id]?.at(-1)
              : item.messages?.at(-1)?.text,
            img: user?.profilePic?.url,
            active: Object.keys(onlineUsers).some((id) => id === user?._id),
            isBold: messagesData[item?._id] ? true : false,
            realTimeMessageCount: messagesData[item?._id]?.length || 0,
          };
        });
        setConversations(formattedData);
      })
      .catch((err) => console.log(err));
  }, [userId, messagesData, reducerValue]);

  useEffect(() => {
    if (userId) {
      socket.emit("joinRoom", userId); // Ensure user joins their room
    }

    socket.on("receiveMessage", ({ messageData }) => {
      dispatch(
        updateMessageData({
          chatId: messageData.conversationId,
          message: messageData.text,
        })
      );
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [userId]);

  const deleteChat = async (conversationId, friendId) => {
    try {
      setIsDeletingChat(true);
      const response = await axios.post(DELETE_CONVERSATION, {
        conversationId,
        friendId,
        senderId: userId,
      });

      if (response.status === 200) {
        toast({
          title: "Chat deleted successfully",
        });
        dispatch(clearMessages({ chatId: conversationId }));
        forceUpdate();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeletingChat(false);
    }
  };

  return (
    <div className="mt-4 space-y-2">
      {conversations.map(
        ({
          id,
          name,
          message,
          img,
          active,
          isBold,
          realTimeMessageCount,
          friendId,
        }) => (
          <ContextMenu key={id}>
            <ContextMenuTrigger>
              <div
                className="flex gap-3 relative items-start cursor-pointer hover:bg-gray-100 py-2"
                onClick={() => {
                  navigate(`?chatid=${id}`);
                  dispatch(clearMessages({ chatId: id }));
                }}
              >
                {/* Profile Picture */}
                <div className="relative w-10 h-10">
                  <Avatar>
                    <AvatarImage
                      src={img}
                      alt={name}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {name
                        .split(" ")
                        .map((word) => word.charAt(0))
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  {active && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                {/* Message Info */}
                <div>
                  <h5 className="font-semibold text-sm">{name}</h5>
                  <p
                    className={`text-xs text-gray-500 ${
                      isBold ? "font-bold" : "font-normal"
                    }`}
                  >
                    {message}
                  </p>
                </div>
                {isBold && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, ease: "easeIn" }}
                    className="absolute right-4 top-4 text-xs font-bold rounded-full bg-blue-500 text-white p-1 h-5 w-5 flex justify-center items-center"
                  >
                    {realTimeMessageCount > 9 ? "9+" : realTimeMessageCount}
                  </motion.span>
                )}
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem
                disabled={isDeletingChat}
                onClick={() => deleteChat(id, friendId)}
              >
                Delete Chat
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        )
      )}
    </div>
  );
};

export default Messages;
