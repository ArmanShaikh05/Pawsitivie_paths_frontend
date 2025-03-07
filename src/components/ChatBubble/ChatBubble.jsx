/* eslint-disable react/prop-types */

import { motion } from "framer-motion";

const ChatBubble = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex ${
        message.type === "sent" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`p-3 rounded-lg shadow-md max-w-xs ${
          message.type === "sent"
            ? "bg-purple-500 text-white"
            : "bg-gray-200 text-gray-900"
        }`}
      >
        {message.image && (
          <img
            src={message.image}
            alt="attachment"
            className="rounded-lg mb-2 w-40"
          />
        )}
        <p className="text-sm">{message.text}</p>
        <span
          className={`text-xs  block mt-1 text-right ${
            message.type === "sent" ? "text-white" : "text-gray-500"
          }`}
        >
          {message.time}
        </span>
      </div>
    </motion.div>
  );
};

export default ChatBubble;
