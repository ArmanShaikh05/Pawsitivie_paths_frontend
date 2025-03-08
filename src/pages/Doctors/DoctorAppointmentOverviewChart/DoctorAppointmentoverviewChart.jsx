import { GET_DOCTOR_CHART_DATA } from "@/constants/routes";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DoctorAppointmentOverviewChart = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("Week");
  const [yearlyPetAdoptedData, setYearlyPetAdoptedData] = useState([]);
  const [monthlyPetAdoptedData, setMonthlyPetAdoptedData] = useState([]);
  const [weeklyPetAdoptedData, setWeeklyPetAdoptedData] = useState([]);
  const userId = useSelector((state) => state.userDetailReducer.userData?._id);

  useEffect(() => {
    axios
      .get(`${GET_DOCTOR_CHART_DATA}?doctorId=${userId}`)
      .then(({ data }) => {
        setYearlyPetAdoptedData(data?.yearlyPetAdoptedData);
        setMonthlyPetAdoptedData(data?.monthlyPetAdoptionData);
        setWeeklyPetAdoptedData(data?.weeklyPetAdoptionData);
      })
      .catch((err) => console.log(err));
  }, [userId]);

  return (
    <motion.div
      className="bg-gray-200 bg-opacity-30 backdrop-blur-md shadow-xl rounded-xl p-6 my-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-black">
          Doctor Appointment Overview
        </h2>

        <select
          className="bg-gray-100 text-black rounded-md px-4 py-2 border-[1px] border-black focus:outline-none focus:ring-2 
          focus:ring-blue-500
          "
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)}
        >
          <option value={"Week"}>This Week</option>
          <option value={"Month"}>This Month</option>
          <option value={"Year"}>This Year</option>
        </select>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer>
          <AreaChart
            data={
              selectedTimeRange === "Week"
                ? weeklyPetAdoptedData
                : selectedTimeRange === "Month"
                ? monthlyPetAdoptedData
                : yearlyPetAdoptedData
            }
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="timePeriod" stroke="#000" />
            <YAxis stroke="#000" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Area
              type="monotone"
              dataKey="petsAdopted"
              stroke="#6c0c98"
              fill="#6c0c98"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
export default DoctorAppointmentOverviewChart;
