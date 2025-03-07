import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import "./allreviews.scss";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FaRegStar, FaStar } from "react-icons/fa";
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  GET_PET_REVIEW_DETAILS,
  GET_PRODUCT_REVIEW_DETAILS,
} from "@/constants/routes";
import Loader from "@/components/Loader/Loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NoReviews from "../NotFoundPages/NoReviewsPresent";

const AllReviews = () => {
  const { Id } = useParams();
  const [reviewData, setReviewData] = useState([]);
  const [filterOption, setFilterOption] = useState("");
  const [chartData, setChartData] = useState({
    very_bad: 0,
    bad: 0,
    good: 0,
    very_good: 0,
    excellent: 0,
  });
  const [loading, setLoading] = useState(false);
  const path = window.location.pathname.split("/")[3];

  useEffect(() => {
    try {
      setLoading(true);
      const cancelToken = axios.CancelToken.source();
      if (path === "pet-reviews") {
        axios
          .get(`${GET_PET_REVIEW_DETAILS}?petId=${Id}&sort=${filterOption}`, {
            cancelToken: cancelToken.token,
          })
          .then((res) => {
            setReviewData(res.data.data);
            setChartData(res.data.chartData);
          });
      }
      if (path === "product-reviews") {
        axios
          .get(
            `${GET_PRODUCT_REVIEW_DETAILS}?productId=${Id}&sort=${filterOption}`,
            {
              cancelToken: cancelToken.token,
            }
          )
          .then((res) => {
            setReviewData(res.data.data);
            setChartData(res.data.chartData);
          });
      }
    } catch (error) {
      if (axios.isCancel(error)) return;
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [Id, filterOption, path]);

  const handleFilterChange = (selectedOption) => {
    setFilterOption(selectedOption);
  };

  const salesByCategory = [
    { name: "Very Bad", value: chartData.very_bad },
    { name: "Bad", value: chartData.bad },
    { name: "Good", value: chartData.good },
    { name: "Very Good", value: chartData.very_good },
    { name: "Excellent", value: chartData.excellent },
  ];

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

  return loading ? (
    <Loader />
  ) : (
    <>
      {reviewData.length > 0 ? (
        <div className="allreview-container">
          <motion.div
            className="bg-gray-200 bg-opacity-30 backdrop-blur-md shadow-xl rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-black mb-4">
              Customer Reviews
            </h2>

            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={salesByCategory.filter((entry) => entry.value > 0)}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {salesByCategory.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(31, 41, 55, 0.8)",
                      borderColor: "#4B5563",
                    }}
                    itemStyle={{ color: "#E5E7EB" }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <div className="customer-reviews">
            <div className="review-header w-full flex  justify-end pr-4 mb-8">
              <Select value={filterOption} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Filter Reviews" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="negative">Negative First</SelectItem>
                  <SelectItem value="positive">Positive First</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="reviews-container hidden-scrollbar">
              {reviewData.length > 0 ? (
                reviewData?.map((review, index) => (
                  <div key={index} className="review">
                    <div className="review-header">
                      <div className="profile-img">
                        <Avatar>
                          <AvatarImage
                            className="object-cover"
                            src={review?.userId?.profilePic?.url}
                          />
                          <AvatarFallback>
                            {review?.userId?.userName
                              .split(" ")
                              .map((name) => name[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="reviewer-name">
                        <div className="review-star-date">
                          <div className="review-star">
                            <div className="flex gap-2">
                              {Array.from({ length: review?.rating }).map(
                                (_, index) => (
                                  <FaStar
                                    size={15}
                                    color="#3a0751"
                                    key={index}
                                  />
                                )
                              )}
                            </div>
                            <div className="flex gap-2">
                              {Array.from({ length: 5 - review?.rating }).map(
                                (_, index) => (
                                  <FaRegStar size={15} key={index} />
                                )
                              )}
                            </div>
                          </div>
                          <p>
                            {moment(review?.createdAt).format("DD/MM/YYYY")}
                          </p>
                        </div>
                        <p className="capitalize">{review?.userId.userName}</p>
                      </div>
                    </div>

                    <div className="review-body">
                      <h2 className="review-title">{review?.title}</h2>
                      <p className="review-desc">{review?.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full w-full flex justify-center items-center">
                  <NoReviews />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full w-full flex justify-center border items-center">
          <NoReviews />
        </div>
      )}
    </>
  );
};

export default AllReviews;
