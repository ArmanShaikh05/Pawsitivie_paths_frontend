/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
// import { Feed1, Profile1 } from "@/assets";
import ChatBubble from "@/components/ChatBubble/ChatBubble";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { GET_SINGLE_CONVERSATION, SEND_MESSAGE } from "@/constants/routes";
import { convertToBase64, formatDate } from "@/utils/features";
import { useSocket } from "@/utils/useContext";
import axios from "axios";
import { ArrowLeft, Paperclip, Smile } from "lucide-react";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { IoIosSend } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ChatComponent({mobileMode}) {
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get("chatid");
  const userId = useSelector((state) => state.userDetailReducer.userData?._id);
  const { socket, onlineUsers } = useSocket();

  const navigete = useNavigate();

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [friend, setFriend] = useState();
  const [fileBlob, setFileBlob] = useState("");
  // const [file, setFile] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);

  const mediaRef = useRef();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (userId) {
      socket.emit("joinRoom", userId); // Ensure user joins their room
    }

    socket.on("receiveMessage", ({ messageData }) => {
      if (messageData.conversationId === chatId) {
        setMessages((prev) => [
          ...prev,
          {
            id: messageData?._id,
            text: messageData?.text,
            time: moment(messageData?.createdAt).format("LT"),
            type:
              messageData?.sender.toString() === userId ? "sent" : "received",
            image: messageData?.media?.url, // Replace with actual image path
            date: messageData?.createdAt,
          },
        ]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!chatId) {
      navigete("");
    } else {
      axios
        .get(`${GET_SINGLE_CONVERSATION}?chatId=${chatId}`)
        .then(({ data }) => {
          let user = data?.data?.users?.filter((u) => u._id !== userId)?.[0];
          let formattedData = data?.data?.messages?.map((item) => {
            return {
              id: item?._id,
              text: item?.text,
              time: moment(item?.createdAt).format("LT"),
              type: item?.sender.toString() === userId ? "sent" : "received",
              image: item?.media?.url,
              date: item?.createdAt,
            };
          });
          setMessages(formattedData);
          setFriend(user);
        })
        .catch((err) => console.log(err));
    }
  }, [chatId]);

  const groupedMessages = messages.reduce((acc, msg) => {
    const formattedDate = formatDate(msg.date);
    if (!acc[formattedDate]) acc[formattedDate] = [];
    acc[formattedDate].push(msg);
    return acc;
  }, {});

  const handleFileChange = () => {
    convertToBase64(mediaRef.current.files[0])
      .then((res) => {
        setFileBlob(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const sendMessage = async () => {
    if (message.trim()) {
      try {
        setSendingMessage(true);
        let dataToSend;
        if (mediaRef.current.files) {
          dataToSend = new FormData();
          dataToSend.append("file", mediaRef.current.files[0]);
          dataToSend.append("conversationId", chatId);
          dataToSend.append("senderId", userId);
          dataToSend.append("recieverId", friend?._id);
          dataToSend.append("message", message);
        } else {
          dataToSend = {
            senderId: userId,
            recieverId: friend?._id,
            message,
            conversationId: chatId,
          };
        }

        const response = await axios.post(SEND_MESSAGE, dataToSend);
        if (response.status === 201) {
          setMessage("");
          setFileBlob("");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setSendingMessage(false);
      }
    }
  };

  return (
    <Card className={`w-full h-full mx-auto bg-white ${mobileMode ? "shadow-none rounded-none border-none":"shadow-lg rounded-lg"} overflow-hidden`}>
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center space-x-3">
          <ArrowLeft
            className="w-5 h-5 text-gray-500 cursor-pointer"
            onClick={() => navigete("")}
          />
          <Avatar>
            <AvatarImage
              src={friend?.profilePic?.url}
              alt={friend?.userName}
              className="object-cover w-10 h-10"
            />
            <AvatarFallback>
              {friend?.userName
                .split(" ")
                .map((word) => word.charAt(0))
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{friend?.userName}</p>
            {Object.keys(onlineUsers).some((id) => id === friend?._id) ? (
              <p className="text-xs text-green-500">Online</p>
            ) : (
              <p className="text-xs ">Offline</p>
            )}
          </div>
        </div>
      </div>
      <ScrollArea className={`${mobileMode? "h-[78%]" : "h-[73%]"}`}>
        <CardContent className={`${mobileMode ? "p-0":"p-4"}  overflow-y-auto flex flex-col space-y-3`}>
          {Object.keys(groupedMessages).map((date) => (
            <div key={date} className="space-y-3">
              <div className="text-center text-xs text-gray-500 my-2">
                {date}
              </div>
              {groupedMessages[date].map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
            </div>
          ))}
        </CardContent>
        <div ref={messagesEndRef} />
      </ScrollArea>
      <div className=" px-2 h-max relative flex items-center border-t bg-gray-100 gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="p-1"
            onClick={() => mediaRef.current.click()}
          >
            <Paperclip className="w-5 h-5 text-gray-600" />
          </Button>
          <input
            type="file"
            className="hidden"
            ref={mediaRef}
            onChange={() => handleFileChange()}
          />
          <Button variant="ghost" className="p-1">
            <Smile className="w-5 h-5 text-gray-600" />
          </Button>
        </div>
        {fileBlob && (
          <div className="absolute bottom-[62px] left-[85px] bg-gray-100">
            <div className="relative w-60 h-52 rounded-md overflow-hidden border p-2">
              <img
                src={fileBlob}
                alt=""
                className="h-full w-full object-contain rounded-md "
              />
              <button className="absolute top-0 right-0 p-1 text-white bg-red-600 rounded-full">
                <RxCross1
                  size={10}
                  onClick={() => {
                    setFileBlob("");
                    if (mediaRef.current) {
                      mediaRef.current.value = "";
                    }
                  }}
                />
              </button>
            </div>
          </div>
        )}
        <Textarea
          className="flex-1 p-2 rounded-lg border focus:ring-0 resize-none "
          placeholder="Type something"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <Button
          variant={"primary"}
          className="rounded-full w-15 aspect-square p-0 mt-2"
          onClick={() => sendMessage()}
          disabled={sendingMessage}
        >
          <IoIosSend size={20} />
        </Button>
      </div>
    </Card>
  );
}
