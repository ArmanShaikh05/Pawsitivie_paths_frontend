import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import SideBarNew from "@/components/Sidebar/SidebarNew";
import { useState } from "react";
import "./AppLayout.scss"; // Import the updated styles

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State for sidebar toggle

  return (
    <>
      <Navbar />
      <div
        className={`section-divider ${isSidebarOpen ? "open" : "collapsed"}`}
      >
        <SideBarNew isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="content-area hidden-scrollbar">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AppLayout;
