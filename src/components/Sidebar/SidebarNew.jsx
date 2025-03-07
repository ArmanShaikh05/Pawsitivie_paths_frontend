import { Home } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { FaShoppingCart } from "react-icons/fa";
import { FaHeart, FaUserDoctor } from "react-icons/fa6";
import { MdEventAvailable, MdForum, MdOutlinePets } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CgProfile } from "react-icons/cg";
import { CiLogout } from "react-icons/ci";
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
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { GET_SHOP_DETAILS, GET_USER_DETAILS } from "@/constants/routes";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useGlobalVariables } from "@/utils/useContext";
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import {
  setCartItems,
  setUserDetails,
} from "@/redux/reducers/userDetailsSlice";

// Menu items.
const Useritems = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Pets",
    url: "/pets",
    icon: MdOutlinePets,
  },
  {
    title: "Wishlist",
    url: "/whishlist/pets",
    icon: FaHeart,
  },
  {
    title: "Events",
    url: "#",
    icon: MdEventAvailable,
  },
  {
    title: "Pet Doctor",
    url: "#",
    icon: FaUserDoctor,
  },
  {
    title: "Marketplace",
    url: "/market",
    icon: FaShoppingCart,
  },
  {
    title: "Forum",
    url: "#",
    icon: MdForum,
  },
];

const SidebarNew = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState();
  const { reducerValue } = useGlobalVariables();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const role = window.localStorage.getItem("pet-role");
  const fallbackText = useRef();

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
        `${role === "user" ? GET_USER_DETAILS : GET_SHOP_DETAILS}/${
          currentUser.uid
        }`,
        {
          cancelToken: cancelToken.token,
        }
      )
      .then(({ data }) => {
        dispatch(setUserDetails(data.data));
        dispatch(setCartItems(data.data?.cartItems || []));
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
  }, [currentUser.uid, dispatch, reducerValue, role]);

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarTrigger />
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link className="w-full flex items-center gap-2" to={"/home"}>
                  <img className="h-10 w-10 object-contain" src="/logo.png" />
                  <span>Pawsitive Path</span>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {Useritems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
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
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default SidebarNew;
