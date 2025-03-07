import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";
import { CiLocationOn } from "react-icons/ci";
import { IoMdTime } from "react-icons/io";
import { RiContactsBook2Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DoctorProfile = () => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.userDetailReducer.userData);
  return (
    <div className="page-container hidden-scrollbar p-4">
      <div className="grid grid-cols-[25%_auto] place-items-center px-4 items-center p-4 space-x-4">
        {/* Left Section: Doctor Image */}
        <div className=" self-start w-[80%] aspect-square   flex items-center flex-col justify-center">
          <div className="border w-full p-2 rounded-lg">
            <Avatar className="w-full h-full  rounded-lg">
              <AvatarImage
                className="object-cover"
                src={userData?.profilePic?.url}
              />
              <AvatarFallback className="text-black text-[5rem]">
                {userData?.userName
                  .split(" ")
                  .map((name) => name[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
          {userData?.availableForWork ? (
            <div className="mt-4 inline-flex items-center px-4 py-2 border-2 border-green-500 text-green-500 text-sm font-semibold rounded-full shadow-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Available for Work
            </div>
          ) : (
            <div className="mt-4 inline-flex items-center px-4 py-2 border-2 border-red-500 text-red-500 text-sm font-semibold rounded-full shadow-sm">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              Not Available
            </div>
          )}
        </div>

        {/* Right Section: Doctor Details */}
        <Card className="w-full min-h-[16rem] border-2 shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold">{userData?.userName}</h2>
            </div>
            <p className="text-gray-600">
              {userData?.education} - {userData?.speciality}
            </p>
            {userData?.experience && (
              <Badge variant="outline" className="mt-1">
                {userData?.experience} years
              </Badge>
            )}

            {/* About Section */}
            {userData?.bio && (
              <div className="mt-3 text-gray-700 text-sm">
                <div className="flex items-center space-x-1">
                  <Info className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold">About</span>
                </div>
                <p className="mt-1 text-gray-600">{userData?.bio}</p>
              </div>
            )}

            {userData?.city && userData?.state && userData?.address && (
              <div className="mt-5 text-gray-700 text-sm">
                <div className="flex items-center space-x-1">
                  <CiLocationOn className="w-5 h-5 text-gray-500" />
                  <span className="font-semibold">Location</span>
                </div>
                <p className="mt-1 text-gray-600">{userData?.address}</p>
                <p className="mt-1 text-gray-600">
                  {userData?.city}, {userData?.state}
                </p>
              </div>
            )}

            {userData?.availability && (
              <div className="mt-5 text-gray-700 text-sm">
                <div className="flex items-center space-x-1">
                  <IoMdTime className="w-5 h-5 text-gray-500" />
                  <span className="font-semibold">Timmings</span>
                </div>
                <p className="mt-1 text-gray-600">
                  Weekdays - {userData?.availability?.weekdays.open} :{" "}
                  {userData?.availability?.weekdays.close}
                </p>
                <p className="mt-1 text-gray-600">
                  Weekends - {userData?.availability?.weekend.open} :{" "}
                  {userData?.availability?.weekend.close}
                </p>
                <p className="mt-1 text-gray-600">
                  {userData?.availability?.sundayClosed
                    ? "Sunday Working"
                    : "Sunday Closed"}
                </p>
              </div>
            )}

            <div className="mt-5 text-gray-700 text-sm">
              <div className="flex items-center space-x-1">
                <RiContactsBook2Line className="w-5 h-5 text-gray-500" />
                <span className="font-semibold">Contact Details</span>
              </div>
              <p className="mt-1 text-gray-600">Email - {userData?.email}</p>
              {userData?.phone && (
                <p className="mt-1 text-gray-600">
                  Contact - {userData?.phone}
                </p>
              )}
            </div>

            <div className="w-full flex justify-end">
              <Button onClick={() => navigate("edit")}>Edit Profile</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorProfile;
