import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import SideBar from "../components/Sidebar/SideBar";

const AppLayout = () => {
  return (
    <>
      <Navbar />
        <div className="section-divider">
          <SideBar />
          
          <Outlet />
        </div>
    </>
  );
};

export default AppLayout;
