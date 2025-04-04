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

  const [updatedData, setUpdatedData] = useState([]);

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
            let updatedFormattedOrders = [];
            let index = 0;
            // console.log(data.data);
            data?.data.forEach((order) => {

              const productImages = order?.products.map((product) => {
                return product.productId.productImages?.[0]?.url;
              });

              const productFallbacks = order?.products.map((product) => {
                return product?.productId?.productName
                  ?.split(" ")
                  .map((name) => name[0])
                  .join("");
              });

              let formatData = {
                SNo: (index += 1),
                orderId: order?._id,
                Date: moment(order.createdAt).format("MMMM Do YYYY"),
                Payment: "success",
                Total: order?.amount,
                Products: productImages,
                ProductFallback: productFallbacks,
                ItemsLeft:
                  productImages.length - 2 > 0 ? productImages.length - 2 : 0,
                Status: order.status,
                Orderdata: order,
              };

              updatedFormattedOrders = [...updatedFormattedOrders, formatData];
            });

            setUpdatedData(updatedFormattedOrders);
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <UserOrderHistoryTable
          noOrder={noOrderError}
          updatedData={updatedData}
        />
      </motion.div>
    </div>
  );
};

export default OrderHistory;
