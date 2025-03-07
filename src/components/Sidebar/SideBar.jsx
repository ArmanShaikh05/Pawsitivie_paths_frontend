import { FaHome, FaShoppingCart } from "react-icons/fa";
import { FaHeart, FaUserDoctor } from "react-icons/fa6";
import { TbShoppingCartDollar } from "react-icons/tb";
import { MdEventAvailable, MdForum, MdOutlinePets } from "react-icons/md";
import { LuCalendarClock } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import "./sidebar.scss";
import { useSelector } from "react-redux";
// import { ScrollArea } from "../ui/scroll-area";

const SideBar = () => {
  const navigate = useNavigate();
  const path = window.location.pathname.split("/")[1];
  const role = useSelector((state) => state.userDetailReducer.userData?.role);
  const userId = useSelector((state) => state.userDetailReducer.userData?._id);

  return (
    // <ScrollArea className="h-full">
    <div className="sidebar-container">
      <div
        className={`sidebar-box ${path === "home" ? "active-sidebar" : ""}`}
        onClick={() => navigate("/home")}
      >
        <FaHome />
        <p>Home</p>
      </div>

      {role === "user" && (
        <div
          className={`sidebar-box ${path === "pets" ? "active-sidebar" : ""}`}
          onClick={() => navigate("/pets")}
        >
          <MdOutlinePets />
          <p>Pets</p>
        </div>
      )}

      {role === "shopOwner" && (
        <div
          className={`sidebar-box ${
            path === "shop-pets" ? "active-sidebar" : ""
          }`}
          onClick={() => navigate("/shop-pets")}
        >
          <MdOutlinePets />
          <p>Pets</p>
        </div>
      )}

      {role === "shopOwner" && (
        <div
          className={`sidebar-box ${
            path === "shop-items" ? "active-sidebar" : ""
          }`}
          onClick={() => navigate("/shop-items")}
        >
          <FaShoppingCart />
          <p>Products</p>
        </div>
      )}

      {role === "shopOwner" && (
        <div
          className={`sidebar-box ${
            path === "shop-orders" ? "active-sidebar" : ""
          }`}
          onClick={() => navigate("/shop-orders")}
        >
          <TbShoppingCartDollar />
          <p>Orders</p>
        </div>
      )}

      {role === "user" && (
        <div
          className={`sidebar-box ${
            path === "whishlist" ? "active-sidebar" : ""
          }`}
          onClick={() => navigate("/whishlist/pets")}
        >
          <FaHeart />
          <p>Wishlist</p>
        </div>
      )}

      {role === "user" && (
        <div
          className={`sidebar-box ${
            path === "order-history" ? "active-sidebar" : ""
          }`}
          onClick={() => navigate("/order-history")}
        >
          <TbShoppingCartDollar />
          <p>Orders</p>
        </div>
      )}

      <div
        className={`sidebar-box ${
          path === "appointments" ? "active-sidebar" : ""
        }`}
        onClick={() => navigate(`/appointments/${userId}`)}
      >
        <LuCalendarClock />
        <p>Appointments</p>
      </div>

      <div
        className={`sidebar-box ${path === "events" ? "active-sidebar" : ""}`}
        onClick={() => navigate(`/events/${userId}`)}
      >
        <MdEventAvailable />
        <p>Events</p>
      </div>

      {role === "user" && (
        <div
          className={`sidebar-box ${
            path === "pet-doctors" ? "active-sidebar" : ""
          }`}
          onClick={() => navigate(`/pet-doctors`)}
        >
          <FaUserDoctor />
          <p>Pet Doctor</p>
        </div>
      )}

      {role === "user" && (
        <div
          className={`sidebar-box ${path === "market" ? "active-sidebar" : ""}`}
          onClick={() => navigate("/market")}
        >
          <FaShoppingCart />
          <p>Marketplace</p>
        </div>
      )}

      {role === "user" && (
        <div
          className={`sidebar-box ${
            path === "forum" ? "active-sidebar" : ""
          }`}
          onClick={() => navigate(`/forum`)}
        >
          <MdForum />
          <p>Forum</p>
        </div>
      )}
    </div>
    // </ScrollArea>
  );
};

export default SideBar;
