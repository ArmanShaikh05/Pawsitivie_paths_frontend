import { DoctorImg } from "@/assets";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { IoSearchOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const doctors = [
  { name: "Dr. Richard James", specialty: "General physician" },
  { name: "Dr. Emily Larson", specialty: "Gynecologist" },
  { name: "Dr. Sarah Patel", specialty: "Dermatologist" },
  { name: "Dr. Christopher Lee", specialty: "Pediatricians" },
  { name: "Dr. Christopher Lee", specialty: "Pediatricians" },
  { name: "Dr. Christopher Lee", specialty: "Pediatricians" },
  { name: "Dr. Christopher Lee", specialty: "Pediatricians" },
  { name: "Dr. Christopher Lee", specialty: "Pediatricians" },
  { name: "Dr. Christopher Lee", specialty: "Pediatricians" },
  { name: "Dr. Christopher Lee", specialty: "Pediatricians" },
  { name: "Dr. Christopher Lee", specialty: "Pediatricians" },
  { name: "Dr. Christopher Lee", specialty: "Pediatricians" },
  { name: "Dr. Christopher Lee", specialty: "Pediatricians" },
];

const specialties = [
  "General physician",
  "Gynecologist",
  "Dermatologist",
  "Pediatricians",
  "Neurologist",
  "Gastroenterologist",
];

const AllDoctorsPage = () => {

  const navigate = useNavigate()

  return (
    <div className="page-container overflow-auto hidden-scrollbar bg-gray-100 flex flex-col">
      <div className=" border flex mx-auto items-center w-[96%] mt-4 rounded-lg text-sm px-3 py-3 gap-3 bg-white ">
        <IoSearchOutline className="w-5 h-5" />
        <input
          type="text"
          className="w-full border-none outline-none"
          placeholder="Search for pet doctors..."
        />
      </div>
      <div className="flex flex-1 p-6">
        {/* Sidebar */}
        <aside className="w-[18%] h-max p-4 bg-white rounded-lg shadow-md">
          <div className="space-y-2">
            {specialties.map((spec, index) => (
              <button
                key={index}
                className="w-full py-2 border rounded-lg text-left text-sm px-4 hover:bg-gray-100"
              >
                {spec}
              </button>
            ))}
          </div>
        </aside>

        {/* Doctors List */}
        <div className="h-[77vh] pb-4 overflow-y-auto hidden-scrollbar flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-6 ">
          {doctors.map((doctor, index) => (
            <Card
              key={index}
              className="px-4 py-2 bg-white shadow-md rounded-lg w-full h-[20rem]"
              onClick={()=>navigate("dsadasdas")}
            >
              <CardContent className="flex flex-col items-center justify-between h-full text-center">
                <div className="w-48 h-48 rounded-lg bg-gray-200 overflow-hidden mb-2">
                  <img src={DoctorImg} alt="profile-pic"  className="w-full h-full object-cover"/>
                </div>
                <div className=" w-[12rem] flex flex-col items-center">
                  <div className="flex items-center gap-1 my-1">
                    {[...Array(3)].map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-500" />
                    ))}
                  </div>
                  <h3 className="text-base font-semibold mt-2">
                    {doctor.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{doctor.specialty}</p>
                  <p className="text-green-600 text-xs">Navi mumbai</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllDoctorsPage;
