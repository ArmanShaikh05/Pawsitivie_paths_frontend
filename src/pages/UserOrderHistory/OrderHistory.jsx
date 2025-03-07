import UserOrderHistoryTable from "@/components/Tables/UserOrderHistoryTable";
import { GET_USER_ORDER_HISTORY } from "@/constants/routes";
import { useGlobalVariables } from "@/utils/useContext";
import axios from "axios";
import { motion } from "framer-motion";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const OrderHistory = () => {
  const userData = useSelector((state) => state.userDetailReducer.userData);
  const { dateRange } = useGlobalVariables();

  const [ordersData, setOrdersData] = useState([]);

  const [noOrderError, setNoOrderError] = useState(false);
  useEffect(() => {
    try {
      setNoOrderError(false);
      const cancelToken = axios.CancelToken.source();
      axios
        .get(
          `${GET_USER_ORDER_HISTORY}/${userData?._id}?startDate=${
            dateRange && dateRange.from
          }&endDate=${
            dateRange && moment(dateRange.to).add(1, "days").toDate()
          }`,
          {
            cancelToken: cancelToken.token,
          }
        )
        .then(({ data }) => {
          if (data.data && data.data.length > 0) {
            let formattedOrders = [];
            let index = 0
            data.data.forEach((order) => {
              const tempFormattedOrders = order?.products.map((product) => ({
                SNo: index+=1,
                orderId: order._id,
                Product: product.productId.productName,
                Date: moment(order.createdAt).format("MMMM Do YYYY"),
                Payment: "success",
                Price: product.productId.productPrice,
                Qty: product.productQty,
                Status: order.status,
                ProductImage:product.productId.productImages?.[0]?.url,
                ProductFallback: product.productId.productName
                .split(" ")
                .map((item) => item.slice(0, 1))
                .join(""),
              }));

              formattedOrders = [...formattedOrders, ...tempFormattedOrders];
            });

            setOrdersData(formattedOrders);
          }
        })
        .catch((err) => {
          if (err.response.data.message === "No orders found")
            setNoOrderError(true);
        });
    } catch (error) {
      if (axios.isCancel(error)) return;
      console.log(error);
    }
  }, [dateRange, userData?._id]);

  return (
    <div className="w-full py-6 px-4 lg:px-8 h-[calc(100vh - 4rem)] overflow-scroll hidden-scrollbar">
      {/* <div className="flex w-full justify-between items-center h-min px-4">
        <h2 className="text-[1.2rem]">Orders</h2>
        <DatePickerWithRange />
      </div> */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <UserOrderHistoryTable ordersData={ordersData} noOrder={noOrderError} />
      </motion.div>
    </div>
  );
};

export default OrderHistory;
