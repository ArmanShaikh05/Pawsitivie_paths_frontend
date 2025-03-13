import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  GET_DOCTOR_DETAILS,
  GET_SHOP_DETAILS,
  GET_USER_DETAILS,
} from "@/constants/routes";
import { useToast } from "@/hooks/use-toast";
import NotificationComponent from "@/pages/Notifications/Notifications";
import {
  clearNotifications,
  setNotificationData,
} from "@/redux/reducers/notificationsSlice";
import {
  setCartItems,
  setUserDetails,
} from "@/redux/reducers/userDetailsSlice";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { CiLogout } from "react-icons/ci";
import { FaBell, FaCartShopping } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth, useGlobalVariables } from "../../utils/useContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import "./navbar.scss";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState();
  const { reducerValue } = useGlobalVariables();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const cartItems = useSelector((state) => state.userDetailReducer.cartItems);
  const role = window.localStorage.getItem("pet-role");
  const fallbackText = useRef();

  const notificationCount = useSelector(
    (state) => state.notificationReducer.notificationCount
  );

  const handleLogout = () => {
    logout()
      .then(() => {
        navigate("/");
        window.localStorage.removeItem("pet-role");
        toast({
          title: "Logged out successfully",
        });
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: err.message,
        });
      });
  };

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();
    axios
      .get(
        `${
          role === "user"
            ? GET_USER_DETAILS
            : role === "petDoctor"
            ? GET_DOCTOR_DETAILS
            : GET_SHOP_DETAILS
        }/${currentUser.uid}`,
        {
          cancelToken: cancelToken.token,
        }
      )
      .then(({ data }) => {
        if (data.data?.notifications) {
          dispatch(setNotificationData(data.data?.notifications || []));
        }
        dispatch(setUserDetails(data.data));
        role === "user" && dispatch(setCartItems(data.data?.cartItems || []));

        setUserData(data.data);
        fallbackText.current = data.data?.userName
          ?.split(" ")
          .map((name) => name[0])
          .join("");
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        console.log(err);
      });
  }, [currentUser.uid, reducerValue, role]);

  return (
    <nav>
      <div className="logo" onClick={() => navigate("/home")}>
        <h2>
          <span className="text-red-500">Pawsitive</span> Paths
        </h2>
      </div>
      <div className="flex gap-2 items-center justify-between w-22">
        {/* Notification sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <div
              className="nav-noti"
              onClick={() => dispatch(clearNotifications())}
            >
              <FaBell className="noti-icon" />
              <span className="icon">
                <i className="fa-solid fa-bell">
                  {notificationCount > 0 && (
                    <small id="Notifications_count">
                      {notificationCount < 10 ? notificationCount : "9+"}
                    </small>
                  )}
                </i>
              </span>
            </div>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle asChild>
                <div className="h-6"></div>
              </SheetTitle>
              <SheetDescription asChild>
                <div></div>
              </SheetDescription>
            </SheetHeader>
            <NotificationComponent />
          </SheetContent>
        </Sheet>

        {role && role === "user" && (
          <div className="relative">
            <FaCartShopping
              onClick={() => navigate("/cart")}
              className="noti-icon mr-5"
            />
            {cartItems.length > 0 && ( // Show badge only if there are items in the cart
              <span className="absolute top-[-2.5px] right-[18.5px] bg-red-500 text-white text-[0.6rem] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="profile-container">
              <Avatar className="profile-image">
                <AvatarImage
                  className="object-cover"
                  src={
                    role === "shopOwner"
                      ? userData?.shopImages[0]?.url
                      : userData?.profilePic?.url
                  }
                />
                <AvatarFallback className="text-black">
                  {fallbackText.current}
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <div
                className="dialog-item flex gap-2 h-[3rem] cursor-pointer"
                onClick={() => navigate(`/profile/${userData?.userId}`)}
              >
                <CgProfile className="w-5 h-5" />
                <p>Profile</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <div
                className="dialog-item flex gap-2 h-[3rem] cursor-pointer"
                onClick={() => setShowLogoutDialog(true)}
              >
                <CiLogout className="w-5 h-5" />
                <p>Logout</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>
                Log Out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </nav>
  );
};

export default Navbar;
