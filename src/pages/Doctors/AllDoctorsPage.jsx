import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { GET_ALL_DOCTORS } from "@/constants/routes";
import axios from "axios";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { IoFilter, IoSearchOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const specialties = [
  "Small Animals (Dogs and Cats)",
  "Large Animals (Horses, Cows, etc.)",
  "Exotic Animals (Birds, Reptiles, etc.)",
  "Aquatic Animals (Fish, Amphibians, etc.)",
];

const AllDoctorsPage = () => {
  const navigate = useNavigate();
  const [allDoctors, setAllDoctors] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [speciality, setSpeciality] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios
      .get(`${GET_ALL_DOCTORS}?speciality=${speciality}`)
      .then(({ data }) => {
        setAllDoctors(data.data);
      })
      .catch((err) => console.log(err));
  }, [speciality]);

  const handleSearchQuery = (query) => {
    setSearchQuery(query);

    if (allDoctors) {
      const filteredData = allDoctors.filter((doctor) => {
        return doctor.userName.toLowerCase().includes(query.toLowerCase());
      });
      setFilteredData(filteredData);
    }
  };

  return (
    <div className="page-container overflow-auto hidden-scrollbar bg-gray-100 flex flex-col">
      <div className=" border grid grid-cols-[auto_50px] mx-auto items-center w-[96%] mt-4 rounded-lg text-sm px-3 py-3 gap-3 bg-white ">
        <div className="w-full flex items-center gap-2">
          <IoSearchOutline className="w-5 h-5" />
          <input
            type="text"
            className="w-full border-none outline-none"
            placeholder="Search for pet doctors..."
            onChange={(e) => handleSearchQuery(e.target.value)}
            value={searchQuery}
          />
        </div>
        {/* FILTER SHEET */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="border-none">
              <IoFilter />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-56">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                <div></div>
              </SheetDescription>
            </SheetHeader>
            <aside className="w-[18%] h-max p-4 bg-white rounded-lg shadow-md">
              <div className="space-y-2">
                {specialties.map((spec, index) => (
                  <button
                    key={index}
                    className={`w-full py-2 border rounded-lg text-left text-sm px-4 hover:bg-gray-100 ${
                      speciality === spec ? "bg-gray-200" : ""
                    }`}
                    onClick={() =>
                      speciality === spec
                        ? setSpeciality("")
                        : setSpeciality(spec)
                    }
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </aside>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex flex-1 p-6">


        {/* Doctors List */}
        <div className="h-[77vh] pb-4 overflow-y-auto hidden-scrollbar flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-6 ">
          {searchQuery?.length > 0 ? (
            filteredData.map((doctor, index) => (
              <Card
                key={index}
                className="px-4 py-2 bg-white shadow-md rounded-lg w-full h-[20rem]"
                onClick={() => navigate(`${doctor?.userId}`)}
              >
                <CardContent className="flex flex-col items-center justify-between h-full text-center">
                  <div className="w-48 h-48 rounded-lg bg-gray-200 overflow-hidden mb-2">
                    <Avatar className="w-full h-full  rounded-lg">
                      <AvatarImage
                        className="object-cover"
                        src={doctor?.profilePic?.url}
                      />
                      <AvatarFallback className="text-black text-[5rem]">
                        {doctor?.userName
                          .split(" ")
                          .map((name) => name[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className=" w-[12rem] flex flex-col items-center">
                    <div className="flex items-center gap-1 my-1">
                      {[...Array(3)].map((_, i) => (
                        <Star key={i} size={16} className="text-yellow-500" />
                      ))}
                    </div>
                    <h3 className="text-base font-semibold mt-2">
                      {doctor?.userName}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {doctor?.speciality}
                    </p>
                    <p className="text-green-600 text-xs">{doctor?.city}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : allDoctors?.length > 0 ? (
            allDoctors.map((doctor, index) => (
              <Card
                key={index}
                className="px-4 py-2 bg-white shadow-md rounded-lg w-full h-[20rem]"
                onClick={() => navigate(`${doctor?.userId}`)}
              >
                <CardContent className="flex flex-col items-center justify-between h-full text-center">
                  <div className="w-48 h-48 rounded-lg bg-gray-200 overflow-hidden mb-2">
                    <Avatar className="w-full h-full  rounded-lg">
                      <AvatarImage
                        className="object-cover"
                        src={doctor?.profilePic?.url}
                      />
                      <AvatarFallback className="text-black text-[5rem]">
                        {doctor?.userName
                          .split(" ")
                          .map((name) => name[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className=" w-[12rem] flex flex-col items-center">
                    <div className="flex items-center gap-1 my-1">
                      {[...Array(3)].map((_, i) => (
                        <Star key={i} size={16} className="text-yellow-500" />
                      ))}
                    </div>
                    <h3 className="text-base font-semibold mt-2">
                      {doctor?.userName}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {doctor?.speciality}
                    </p>
                    <p className="text-green-600 text-xs">{doctor?.city}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div>No Doctors</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllDoctorsPage;
