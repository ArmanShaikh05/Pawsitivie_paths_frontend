import { BellOff } from "lucide-react";
import { motion } from "framer-motion";

const NoNotifications = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <BellOff className="w-10 h-10 text-gray-400" />
      </motion.div>
      
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-lg font-semibold text-gray-700 mt-4"
      >
        No Notifications Yet
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-gray-500 mt-2 text-sm"
      >
        Stay tuned! Your latest updates will appear here.
      </motion.p>
    </div>
  );
};

export default NoNotifications;
