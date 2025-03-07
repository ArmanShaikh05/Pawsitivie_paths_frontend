/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { arrangeArrayByDate } from "@/utils/features";
import { Car } from "lucide-react";
import moment from "moment";
import { useSelector } from "react-redux";
import NoNotifications from "./NoNotifications";
import axios from "axios";
import {
  DELETE_ALL_READ_NOTI,
  READ_ALL_NOTI,
  READ_SINGLE_NOTI,
} from "@/constants/routes";
import { useGlobalVariables } from "@/utils/useContext";
import { useToast } from "@/hooks/use-toast";
import { MdDelete } from "react-icons/md";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NotificationItem = ({ icon: Icon, time, readNotification, notiData }) => (
  <div
    onClick={readNotification}
    className={`flex items-start gap-4 p-4 ${
      !notiData?.isRead ? "bg-blue-50" : ""
    } smooth-transition hover:bg-gray-50 border-b-2 cursor-pointer`}
  >
    <div className="flex-none w-10 h-10 bg-gray-100 flex items-center justify-center rounded-full">
      {notiData?.notiType === "Friend_Request" ||
      notiData?.notiType === "Chat_Deleted" ? (
        <Avatar>
          <AvatarImage
            src={notiData?.avatar}
            alt={notiData?.senderName}
            className="object-cover"
          />
          <AvatarFallback>
            {notiData?.senderName
              .split(" ")
              .map((word) => word.charAt(0))
              .join("")
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      ) : (
        <Icon className="text-gray-500 w-6 h-6" />
      )}
    </div>
    <div className="flex-grow flex flex-col">
      <div>
        <h3 className="text-sm font-medium text-gray-800">{notiData?.title || notiData?.notiTitle}</h3>
        <p className="text-sm text-gray-600 mt-1">{notiData?.message}</p>
      </div>
      <span className="text-xs text-gray-500 mt-1 self-end">{time}</span>
    </div>
  </div>
);

function NotificationComponent() {
  const notifications = useSelector(
    (state) => state.notificationReducer.notificationData
  );
  const userId = useSelector((state) => state.userDetailReducer.userData?._id);
  const { forceUpdate } = useGlobalVariables();
  const { toast } = useToast();
  const [isDeletingNoti, setIsDeletingNoti] = useState(false);
  const role = window.localStorage.getItem("pet-role");

  const reversedData = notifications.slice().reverse();

  let dates = arrangeArrayByDate(reversedData);

  let d = new Date();
  d.setDate(d.getDate() - 1);
  let yesterday = moment(d).format("LL");
  let today = moment().format("LL");

  const readNotification = async (notiId) => {
    const response = await axios.get(`${READ_SINGLE_NOTI}?notiId=${notiId}`);
    if (response.status === 200) {
      forceUpdate();
    }
  };

  const readAllNotifications = async () => {
    const response = await axios.get(`${READ_ALL_NOTI}?userId=${userId}`);
    if (response.status === 200) {
      forceUpdate();
      toast({
        title: "All notifications read successfully",
      });
    }
  };

  const deleteAllReadNotifications = async () => {
    try {
      setIsDeletingNoti(true);
      const response = await axios.delete(
        `${DELETE_ALL_READ_NOTI}?userId=${userId}&userRole=${role}`
      );
      if (response.status === 200) {
        forceUpdate();
        toast({
          title: "All notifications deleted successfully",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeletingNoti(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto border rounded-lg shadow-md">
      <CardHeader className="flex justify-between items-center px-4 py-2 border-b">
        <div className="flex w-full justify-between items-center">
          <h2 className="text-sm font-semibold text-gray-800">Notifications</h2>
          <div className="flex gap-2 items-center">
            <Button
              variant="primary"
              size="sm"
              onClick={() => readAllNotifications()}
            >
              Mark all as read
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <MdDelete className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    all your read notifications.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button
                      disabled={isDeletingNoti}
                      onClick={() => deleteAllReadNotifications()}
                    >
                      Continue
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>

      <ScrollArea className="h-[630px]">
        <CardContent className="p-0">
          {dates.length > 0 ? (
            dates.map((date, index) => (
              <div key={index}>
                <div className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium">
                  {moment(date).format("LL") === today
                    ? "Today"
                    : moment(date).format("LL") === yesterday
                    ? "Yesterday"
                    : moment(date).format("LL")}
                </div>
                {reversedData.map((item, index) => {
                  if (moment(item?.createdAt).format("LL") === date) {
                    return (
                      <NotificationItem
                        key={index}
                        icon={Car}
                        notiData={item}
                        title={item?.notiTitle}
                        description={item?.message}
                        time={moment(item?.createdAt).fromNow()}
                        isRead={item?.isRead}
                        readNotification={() => readNotification(item?._id)}
                      />
                    );
                  }
                })}
                <Separator />
              </div>
            ))
          ) : (
            <NoNotifications />
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}

export default NotificationComponent;
