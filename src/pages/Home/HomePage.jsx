import ShopCard from "@/components/Cards/ShopCard/ShopCard";
import Loader from "@/components/Loader/Loader";
import { GET_SHOPS } from "@/constants/routes";
import useFetch from "@/hooks/use-fetch";
import { motion } from "framer-motion";
import { IoSearchOutline } from "react-icons/io5";
// import { MdOutlineFilterList } from "react-icons/md";
import "./home.scss";

import NoHotels from "@/components/NoDataPages/NoHotels";
import { useState } from "react";

const HomePage = () => {
  const { data, loading } = useFetch(GET_SHOPS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const handleSearchQuery = (query) => {
    setSearchQuery(query);

    if (data) {
      const filteredData = data.filter((shop) => {
        return shop.shopName.toLowerCase().includes(query.toLowerCase());
      });
      setFilteredData(filteredData);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="search-area">
        <IoSearchOutline />
        <input
          type="text"
          placeholder="Search for pet, shops"
          value={searchQuery}
          onChange={(e) => handleSearchQuery(e.target.value)}
        />
        {/* <MdOutlineFilterList className="filter-icon" /> */}
      </div>

      {loading ? (
        <Loader />
      ) : searchQuery.length > 0 ? (
        filteredData.map((shop, index) => (
          <motion.div
            className="w-full"
            key={index}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 * index }}
          >
            <ShopCard shop={shop} />
          </motion.div>
        ))
      ) : data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-auto hidden-scrollbar h-[38rem]">
          {data.map((shop, index) => (
            <motion.div
              className="w-full"
              key={index}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 * index }}
            >
              <ShopCard shop={shop} />
            </motion.div>
          ))}
        </div>
      ) : (
        <NoHotels />
      )}
    </div>
  );
};

export default HomePage;
