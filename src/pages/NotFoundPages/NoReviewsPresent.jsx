import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function NoReviews() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] w-full text-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl shadow-lg"
      >
        <MessageCircle size={64} className="text-gray-400" />
      </motion.div>
      <h2 className="text-2xl font-semibold mt-4 text-gray-800 dark:text-gray-100">
        No Reviews Yet
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
        Be the first to review this product and help others make a great choice!
      </p>
      
    </div>
  );
}
