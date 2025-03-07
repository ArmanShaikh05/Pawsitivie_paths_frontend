import StatCard from "@/components/Cards/StatCard/StatCard";
import CategoryDistributionChart from "@/components/Charts/CategoryDistributionChart";
import PetsOverviewChart from "@/components/Charts/PetsOverviewChart";
import SalesOverviewChart from "@/components/Charts/SalesOverviewChart";
import Loader from "@/components/Loader/Loader";
import { GET_SHOP_CHART_DETAILS } from "@/constants/routes";
import { getCurrency } from "@/utils/features";
import { useGlobalVariables } from "@/utils/useContext";
import axios from "axios";
import { motion } from "framer-motion";
import { ShoppingBag, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { FaRegCommentAlt, FaStar } from "react-icons/fa";
import { MdOutlinePets } from "react-icons/md";
import { useSelector } from "react-redux";

const ShopHomePage = () => {
  const userData = useSelector((state) => state.userDetailReducer.userData);
  const [loading, setLoading] = useState(false);

  const { setProductCategoryData, setPetCategoryData, shopChartForceUpdate, setYearlyPetAdoptedData, setMonthlyPetAdoptedData,setWeeklyPetAdoptedData } =
    useGlobalVariables();

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();
    setLoading(true);
    axios
      .get(`${GET_SHOP_CHART_DETAILS}?shopId=${userData?._id}`, {
        cancelToken: cancelToken.token,
      })
      .then((res) => {
        console.log(res.data)
        setLoading(false);
        setWeeklyPetAdoptedData(res.data.weeklyPetAdoptionData)
        setMonthlyPetAdoptedData(res.data.monthlyPetAdoptionData)
        setYearlyPetAdoptedData(res.data.yearlyPetAdoptedData)
        setProductCategoryData(res.data.productCategoriesData);
        setPetCategoryData(res.data.petCategoriesData);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return setLoading(false);
        console.log(err);
        setLoading(false);
      });
  }, [shopChartForceUpdate]);

  return loading ? (
    <Loader />
  ) : (
    <div className="flex-1 overflow-auto relative z-10 hidden-scrollbar">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Revenue"
            icon={Zap}
            value={getCurrency(userData?.shopAnalytics.totalRevenue)}
            color="#6366F1"
          />
          <StatCard
            name="Products Sold"
            icon={ShoppingBag}
            value={userData?.shopAnalytics.totalProducts}
            color="#EC4899"
          />
          <StatCard
            name="Pets Adopted"
            icon={MdOutlinePets}
            value={userData?.shopAnalytics.totalPetsAdopted}
            color="#8B5CF6"
          />
          <StatCard
            name="Total Reviews"
            icon={FaRegCommentAlt}
            value="125"
            color="#10B981"
          />
          <StatCard
            name="Shop Rating"
            icon={FaStar}
            value="3.8"
            color="#EC4899"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SalesOverviewChart />
          <CategoryDistributionChart />
        </div>

        <PetsOverviewChart />
      </main>
    </div>
  );
};

export default ShopHomePage;
