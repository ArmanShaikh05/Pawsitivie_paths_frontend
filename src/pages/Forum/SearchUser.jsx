import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CREATE_CONVERSATION,
  GET_ALL_FRIENDS,
  GET_USER_FROM_SEARCH,
  REMOVE_FRIEND,
} from "@/constants/routes";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { Search, X } from "lucide-react";
import { useCallback, useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Friends from "./Friends";

export default function SearchUser() {
  const userId = useSelector((state) => state.userDetailReducer.userData._id);
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResultArray, setSearchResultArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatingConversation, setCreatingConversation] = useState(false);

  const [isRemovingFriend, setIsRemovingFriend] = useState(false);
  const [friendsArray, setFriendsArray] = useState([]);

  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    axios
      .get(`${GET_ALL_FRIENDS}?userId=${userId}`)
      .then(({ data }) => setFriendsArray(data.data.friends))
      .catch((err) => console.log(err));
  }, [userId, reducerValue]);

  const searchUsers = async (query) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${GET_USER_FROM_SEARCH}?username=${query}`
      );
      const formattedResultData = data.data
        ?.filter((user) => user?._id.toString() !== userId.toString())
        .map((user) => {
          return {
            id: user?._id,
            name: user?.userName,
            img: user?.profilePic?.url,
          };
        });

      setSearchResultArray(formattedResultData);
    } catch (error) {
      if (axios.isCancel(error)) return;
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const debounceSearch = (cb, delay) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => cb(...args), delay);
    };
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const deb = useCallback(
    debounceSearch((searchquery) => searchUsers(searchquery), 500),
    []
  );

  const handleUsernameSearch = (query) => {
    setQuery(query);
    deb(query);
  };

  const removeFriend = async (friendId) => {
    try {
      if (!friendId)
        return toast({
          title: "Friend Id not found",
          variant: "destructive",
        });
      setIsRemovingFriend(true);
      const response = await axios.post(REMOVE_FRIEND, {
        friendId: friendId,
        userId: userId,
      });

      if (response.status === 200) {
        forceUpdate();
        return toast({
          title: "Friend Removed Successfully",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsRemovingFriend(false);
    }
  };

  const createConversation = async (id) => {
    try {
      setCreatingConversation(true);
      const response = await axios.post(CREATE_CONVERSATION, {
        userIds: [userId, id],
      });
      if (response.status === 201) {
        return navigate(`/forum?chatid=${response.data?.data?._id}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCreatingConversation(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center bg-white border rounded-full px-3 py-2 my-2 shadow-sm">
        <Search className="w-5 h-5 text-gray-400" />
        <Input
          className="flex-1 bg-transparent border-none outline-none px-2 focus-visible:ring-0"
          placeholder="Search user"
          value={query}
          onChange={(e) => {
            handleUsernameSearch(e.target.value);
            setShowDropdown(e.target.value.length > 0);
          }}
        />
        {query && (
          <X
            className="w-5 h-5 text-gray-400 cursor-pointer"
            onClick={() => {
              setQuery("");
              setShowDropdown(false);
            }}
          />
        )}
      </div>
      {!showDropdown && (
        <>
          <Label className="p-4">Friends</Label>
          <Card className="max-w-md mx-auto bg-white rounded-lg shadow-md border-none max-h-[23rem] overflow-y-auto hidden-scrollbar">
            <div className="border-t">
              {friendsArray.map((user, index) => (
                <ContextMenu key={index}>
                  <ContextMenuTrigger>
                    <div
                      key={index}
                      className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                    >
                      <Avatar className="w-10 h-10 rounded-full mr-3">
                        <AvatarImage
                          src={user?.profilePic?.url}
                          alt={user?.userName}
                          className="object-cover"
                        />
                        <AvatarFallback>
                          {user?.userName
                            .split(" ")
                            .map((word) => word.charAt(0))
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900 flex items-center">
                          {user?.userName}
                        </p>
                      </div>
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem
                      onClick={() => {
                        removeFriend(user?._id);
                      }}
                      disabled={isRemovingFriend}
                    >
                      Remove Friend
                    </ContextMenuItem>
                    <ContextMenuItem
                      disabled={creatingConversation}
                      onClick={() => createConversation(user?._id)}
                    >
                      Start Chat
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))}
            </div>
          </Card>
        </>
      )}

      {showDropdown && (
        <Friends loading={loading} searchResultArray={searchResultArray} />
      )}
    </div>
  );
}
