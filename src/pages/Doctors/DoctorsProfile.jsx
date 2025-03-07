import { DoctorImg } from "@/assets";
import ShopTestimonial from "@/components/ShopTestimonial/ShopTestimonial";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Info, Star } from "lucide-react";
import { CiLocationOn } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

const DoctorsProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container hidden-scrollbar p-4">
      <div className="grid grid-cols-[25%_auto] place-items-center px-4 items-center p-4 space-x-4">
        {/* Left Section: Doctor Image */}
        <div className="border self-start w-[80%] aspect-square p-2 rounded-lg flex items-center justify-center">
          <img
            src={DoctorImg} // Replace with actual image URL
            alt="Dr. Richard James"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Right Section: Doctor Details */}
        <Card className="w-full min-h-[16rem] border-2 shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold">Dr. Richard James</h2>
              <span className="text-blue-500">✔</span>
            </div>
            <p className="text-gray-600">MBBS - General physician</p>
            <Badge variant="outline" className="mt-1">
              4 Years
            </Badge>

            {/* About Section */}
            <div className="mt-3 text-gray-700 text-sm">
              <div className="flex items-center space-x-1">
                <Info className="w-4 h-4 text-gray-500" />
                <span className="font-semibold">About</span>
              </div>
              <p className="mt-1 text-gray-600">
                Dr. Davis has a strong commitment to delivering comprehensive
                medical care, focusing on preventive medicine, early diagnosis,
                and effective treatment strategies.
              </p>
            </div>

            <div className="mt-5 text-gray-700 text-sm">
              <div className="flex items-center space-x-1">
                <CiLocationOn className="w-5 h-5 text-gray-500" />
                <span className="font-semibold">Location</span>
              </div>
              <p className="mt-1 text-gray-600">Navi mumbai, Maharashtra</p>
            </div>

            {/* Appointment Fee */}
            <p className="mt-4 font-medium text-gray-800">
              Appointment fee: <span className="font-bold">$50</span>
            </p>

            <div className="w-full flex justify-end">
              <Button>Schedule Appointment</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-[90%] mt-[4rem] mb-[3rem] mx-auto flex flex-col relative">
        <h2 className="text-xl font-medium">Customer Reviews</h2>
        <div className="shop-carousels mt-8 mb-8">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent>
              {Array.from({ length: 7 }).map((_, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
                  <ShopTestimonial />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>

      <div className="w-[90%] mt-[4rem] mb-[3rem] mx-auto flex flex-col relative">
        <h2 className="text-xl font-medium">Related Doctors</h2>
        <div className="shop-carousels mt-8 mb-8">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent>
              {Array.from({ length: 7 }).map((_, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
                  <Card
                    className="px-4 py-2 bg-white shadow-md rounded-lg w-full h-[20rem]"
                    onClick={() => navigate("dsadasdas")}
                  >
                    <CardContent className="flex flex-col items-center justify-between h-full text-center">
                      <div className="w-48 h-48 rounded-lg bg-gray-200 overflow-hidden mb-2">
                        <img
                          src={DoctorImg}
                          alt="profile-pic"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className=" w-[12rem] flex flex-col items-center">
                        <div className="flex items-center gap-1 my-1">
                          {[...Array(3)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className="text-yellow-500"
                            />
                          ))}
                        </div>
                        <h3 className="text-base font-semibold mt-2">
                          {"John Cena"}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {"Dermatologist"}
                        </p>
                        <p className="text-green-600 text-xs">Navi mumbai</p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default DoctorsProfile;
