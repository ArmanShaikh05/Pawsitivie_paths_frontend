import StatCard from "@/components/Cards/StatCard/StatCard";
// import { DatePickerWithRange } from "@/components/DateRange/SelectDateRange";
import ShopOrderTable from "@/components/Tables/ShopOrderTable";
import { GET_ORDER_DETAILS } from "@/constants/routes";
import { getTotalItems } from "@/utils/features";
import { useGlobalVariables } from "@/utils/useContext";
import axios from "axios";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import moment from "moment";
import { useEffect, useReducer, useState } from "react";
import { FaBox } from "react-icons/fa6";
import { MdWatchLater } from "react-icons/md";
import { useSelector } from "react-redux";

const ShopOrders = () => {
  const userData = useSelector((state) => state.userDetailReducer.userData);
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  const { dateRange } = useGlobalVariables();

  const [ordersData, setOrdersData] = useState([]);
  const [totalOrders, setTotalOrders] = useState();
  const [pendingOrders, setPendingOrders] = useState();
  const [deliveredOredrs, setDeliveredOredrs] = useState();
  const [shippedOrders, setShippedOrders] = useState();

  const [noOrderError, setNoOrderError] = useState(false)
  useEffect(() => {
    try {
      setNoOrderError(false)
      const cancelToken = axios.CancelToken.source();
      axios
        .get(
          `${GET_ORDER_DETAILS}/${userData?._id}?startDate=${
            dateRange && dateRange.from
          }&endDate=${
            dateRange && moment(dateRange.to).add(1, "days").toDate()
          }`,
          {
            cancelToken: cancelToken.token,
          }
        )
        .then(({ data }) => {
          console.log(data)
          if (data.data && data.data.length > 0) {
            // Setting Up Stats
            setTotalOrders(data.data.length);
            setPendingOrders(
              data.data.filter((item) => item.status === "pending").length
            );
            setDeliveredOredrs(
              data.data.filter((item) => item.status === "delivered").length
            );
            setShippedOrders(
              data.data.filter((item) => item.status === "shipped").length
            );

            const formattedOrders = data.data.map((order) => ({
              id: `#${order._id.toString().slice(18)}`,
              orderId: order._id,
              Date: moment(order.createdAt).format("MMMM Do YYYY"),
              Customer: order.userId.userName || "Invalid",
              Payment: "success",
              Total: order.amount,
              Location: order.userId.shippingAddress.state || "Invalid",
              Items: getTotalItems(order.products),
              Status: order.status,
              UserProfilePic: order.userId.profilePic.url,
              ProfileFallback: order.userId.userName
                .split(" ")
                .map((item) => item.slice(0, 1))
                .join(""),
            }));

            setOrdersData(formattedOrders);
          }
        }).catch((err)=>{
          if(err.response.data.message === "No orders found") setNoOrderError(true)
        });
    } catch (error) {
      if (axios.isCancel(error)) return;
      console.log(error);
    }
  }, [reducerValue, dateRange, userData?._id]);

  return (
    <div className="w-full py-6 px-4 lg:px-8 h-[calc(100vh - 4rem)] overflow-scroll hidden-scrollbar">
      {/* <div className="flex w-full justify-between items-center h-min px-4">
        <h2 className="text-[1.2rem]">Orders</h2>
        <DatePickerWithRange />
      </div> */}
      <div className="my-6">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <StatCard
            name="Total Orders"
            icon={FaBox}
            value={totalOrders}
            color="#6366F1"
          />

          <StatCard
            name="Pending Orders"
            icon={MdWatchLater}
            value={pendingOrders}
            color="#EC4899"
          />
          <StatCard
            name="Shipped Orders"
            icon={ShoppingBag}
            value={shippedOrders}
            color="#8B5CF6"
          />
          <StatCard
            name="Fulfilled Oreders"
            icon={ShoppingBag}
            value={deliveredOredrs}
            color="#10B981"
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <ShopOrderTable ordersData={ordersData} forceUpdate={forceUpdate} noOrder={noOrderError} />
      </motion.div>
    </div>
  );
};

export default ShopOrders;
