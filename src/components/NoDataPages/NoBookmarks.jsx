import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NoBookmarks = () => {
  const navigate = useNavigate();

  return (
    <div className="flex w-[95%] items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="relative bg-white bg-opacity-90 backdrop-blur-lg rounded-xl shadow-xl p-8 max-w-lg w-full text-center">
        <div className="relative inline-block">
          <Bookmark className="w-20 h-20 text-gray-400 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-100 rounded-full opacity-50 blur-2xl"></div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mt-4">
          No Bookmarked Items
        </h1>
        <p className="text-gray-600 mt-2">
          You haven&apos;t bookmarked anything yet. Start exploring and save your
          favorite items for quick access!
        </p>
        <div className="mt-6">
          <Button
            onClick={() => navigate("/forum")}
            className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 px-6 py-2 rounded-lg transition-all"
          >
            Explore Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NoBookmarks;
