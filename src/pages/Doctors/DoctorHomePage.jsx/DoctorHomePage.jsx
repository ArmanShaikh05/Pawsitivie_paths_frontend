import StatCard from "@/components/Cards/StatCard/StatCard";
import Loader from "@/components/Loader/Loader";
import { motion } from "framer-motion";
import { useState } from "react";

import { Zap } from "lucide-react";
import { MdEventAvailable, MdOutlineSchedule } from "react-icons/md";
import DoctorAppointmentOverviewChart from "../DoctorAppointmentOverviewChart/DoctorAppointmentoverviewChart";
import { useSelector } from "react-redux";
import { getCurrency } from "@/utils/features";

const DoctorHomePage = () => {
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const userData = useSelector((state) => state.userDetailReducer.userData);

  return loading ? (
    <Loader />
  ) : (
    <div className="flex-1 overflow-auto relative z-10 hidden-scrollbar">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Revenue"
            icon={Zap}
            value={getCurrency(userData?.totalRevenue)}
            color="#6366F1"
          />
          <StatCard
            name="Completed Appointments"
            icon={MdEventAvailable}
            value={userData?.completedAppointments}
            color="#EC4899"
          />
          <StatCard
            name="Pending Appointments"
            icon={MdOutlineSchedule}
            value={userData?.pendingAppointments}
            color="#8B5CF6"
          />
        </motion.div>

        <DoctorAppointmentOverviewChart />
      </main>
    </div>
  );
};

export default DoctorHomePage;
