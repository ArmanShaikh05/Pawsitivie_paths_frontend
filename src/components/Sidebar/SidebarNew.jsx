import { FaHome, FaShoppingCart } from "react-icons/fa";
import { FaHeart, FaUserDoctor } from "react-icons/fa6";
import { TbShoppingCartDollar } from "react-icons/tb";
import { MdEventAvailable, MdForum, MdOutlinePets } from "react-icons/md";
import { LuCalendarClock } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import "./sidebarNew.scss";
import useWindowSize from "@/hooks/useWindowSize";
import { AiFillMessage } from "react-icons/ai";

const SideBarNew = () => {
  const navigate = useNavigate();
  const path = window.location.pathname.split("/")[1];
  const role = useSelector((state) => state.userDetailReducer.userData?.role);
  const userId = useSelector((state) => state.userDetailReducer.userData?._id);
  const [isOpen, setIsOpen] = useState(true); // Toggle sidebar state

  const { width } = useWindowSize();

  return (
    <div className={`sidebar-container ${isOpen ? "open" : "collapsed"}`}>
      <button
        className="toggle-btn md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "«" : "»"}
      </button>

      <div
        className={`sidebar-box ${path === "home" ? "active-sidebar" : ""}`}
        onClick={() => navigate("/home")}
      >
        <FaHome />
        {isOpen && <p>Home</p>}
      </div>

      {role === "user" && (
        <div
          className={`sidebar-box ${path === "pets" ? "active-sidebar" : ""}`}
          onClick={() => navigate("/pets")}
        >
          <MdOutlinePets />
          {isOpen && <p>Pets</p>}
        </div>
      )}

      {role === "shopOwner" && (
        <>
          <div
            className={`sidebar-box ${
              path === "shop-pets" ? "active-sidebar" : ""
            }`}
            onClick={() => navigate("/shop-pets")}
          >
            <MdOutlinePets />
            {isOpen && <p>Pets</p>}
          </div>

          <div
            className={`sidebar-box ${
              path === "shop-items" ? "active-sidebar" : ""
            }`}
            onClick={() => navigate("/shop-items")}
          >
            <FaShoppingCart />
            {isOpen && <p>Products</p>}
          </div>

          <div
            className={`sidebar-box ${
              path === "shop-orders" ? "active-sidebar" : ""
            }`}
            onClick={() => navigate("/shop-orders")}
          >
            <TbShoppingCartDollar />
            {isOpen && <p>Orders</p>}
          </div>
        </>
      )}

      {role === "user" && (
        <>
          <div
            className={`sidebar-box ${
              path === "whishlist" ? "active-sidebar" : ""
            }`}
            onClick={() => navigate("/whishlist/pets")}
          >
            <FaHeart />
            {isOpen && <p>Wishlist</p>}
          </div>

          <div
            className={`sidebar-box ${
              path === "order-history" ? "active-sidebar" : ""
            }`}
            onClick={() => navigate("/order-history")}
          >
            <TbShoppingCartDollar />
            {isOpen && <p>Orders</p>}
          </div>
        </>
      )}

      <div
        className={`sidebar-box ${
          path === "appointments" ? "active-sidebar" : ""
        }`}
        onClick={() => navigate(`/appointments/${userId}`)}
      >
        <LuCalendarClock />
        {isOpen && <p>Appointments</p>}
      </div>

      <div
        className={`sidebar-box ${path === "events" ? "active-sidebar" : ""}`}
        onClick={() => navigate(`/events/${userId}`)}
      >
        <MdEventAvailable />
        {isOpen && <p>Events</p>}
      </div>

      {role === "user" && (
        <>
          <div
            className={`sidebar-box ${
              path === "pet-doctors" ? "active-sidebar" : ""
            }`}
            onClick={() => navigate(`/pet-doctors`)}
          >
            <FaUserDoctor />
            {isOpen && <p>Pet Doctor</p>}
          </div>

          <div
            className={`sidebar-box ${
              path === "market" ? "active-sidebar" : ""
            }`}
            onClick={() => navigate("/market")}
          >
            <FaShoppingCart />
            {isOpen && <p>Marketplace</p>}
          </div>

          <div
            className={`sidebar-box ${
              path === "forum" ? "active-sidebar" : ""
            }`}
            onClick={() => navigate(`/forum`)}
          >
            <MdForum />
            {isOpen && <p>Forum</p>}
          </div>

          {width < 900 && (
            <div
              className={`sidebar-box ${
                path === "messages" ? "active-sidebar" : ""
              }`}
              onClick={() => navigate(`/messages`)}
            >
              <AiFillMessage />
              {isOpen && <p>Messages</p>}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SideBarNew;
