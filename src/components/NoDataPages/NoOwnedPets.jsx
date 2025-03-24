/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import { PawPrint } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NoOwnedPets = ({ TppProfile = false }) => {
  const navigate = useNavigate();

  return (
    <div className="flex w-[95%] items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="relative bg-white bg-opacity-90 backdrop-blur-xl rounded-xl shadow-xl p-8 max-w-lg w-full text-center">
        <div className="relative inline-block">
          <PawPrint className="w-20 h-20 text-purple-400 animate-bounce" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-300 to-purple-100 rounded-full opacity-50 blur-2xl"></div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mt-4">
          No Pets Registered
        </h1>
        {!TppProfile ? (
          <p className="text-gray-600 mt-2">
            You haven’t added any pets yet. Start by registering your furry
            friends and keep track of their health & activities!
          </p>
        ) : (
          <p className="text-gray-600 mt-2">
            These person haven&apos;t add any pet into their profile.
          </p>
        )}
        {!TppProfile && (
          <div className="mt-6">
            <Button
              onClick={() => navigate("manage-owned-pets")}
              className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white hover:from-purple-600 hover:to-purple-800 px-6 py-2 rounded-lg transition-all"
            >
              Register a Pet
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoOwnedPets;
