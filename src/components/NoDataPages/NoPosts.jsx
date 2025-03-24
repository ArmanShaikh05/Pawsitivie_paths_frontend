/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NoPostsYet = ({ TppMode = false }) => {
  const navigate = useNavigate();

  return (
    <div className="flex w-[95%] items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="relative bg-white bg-opacity-90 backdrop-blur-xl rounded-xl shadow-xl p-8 max-w-lg w-full text-center">
        <div className="relative inline-block">
          <MessageSquarePlus className="w-20 h-20 text-blue-500 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-100 rounded-full opacity-50 blur-2xl"></div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mt-4">No Posts Yet</h1>
        {!TppMode ? (
          <p className="text-gray-600 mt-2">
            You haven&apos;t shared anything yet. Start by creating your first
            post and connect with the world!
          </p>
        ) : (
          <p className="text-gray-600 mt-2">
            This person haven&apos;t shared anything yet. 
          </p>
        )}
        {!TppMode && (
          <div className="mt-6">
            <Button
              onClick={() => navigate("/forum")}
              className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 px-6 py-2 rounded-lg transition-all"
            >
              Create Your First Post
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoPostsYet;
