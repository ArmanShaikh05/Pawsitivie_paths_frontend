/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "../ui/input";
import axios from "axios";
import { GET_SHOP_DETAILS_BY_PETID } from "@/constants/routes";
import { generateTimeSlots, getCoordinatesFromAddress } from "@/utils/features";
import { Textarea } from "../ui/textarea";
import MapComponent from "../MapComponent/MapComponent";

const AppointmentScheduler = ({
  petId,
  selectedDate,
  selectedTime,
  setSelectedDate,
  setSelectedTime,
  email,
  setEmail,
  phone,
  setPhone,
  userFirstName,
  setUserFirstName,
  userLastName,
  setUserLastName,
  meetingDescription,
  setMeetingDescription,
  setShopId,
}) => {
  const [timeSlots, setTimeSlots] = useState([]);

  const [petShopData, setPetShopData] = useState();
  const [coordinates, setCoordinates] = useState(null);
  const [noLocationError, setNoLocationError] = useState("");

  useEffect(() => {
    try {
      const cancelToken = axios.CancelToken.source();
      axios
        .get(`${GET_SHOP_DETAILS_BY_PETID}?petId=${petId}`, {
          cancelToken: cancelToken.token,
        })
        .then(({ data }) => {
          setPetShopData(data.data);
          setShopId(data.data.shopId);
          const morningSlots = generateTimeSlots(
            data.data.shopTimmings?.weekdays?.open || "08:00",
            "12:00"
          );
          const eveningSlots = generateTimeSlots(
            "12:00",
            data.data.shopTimmings?.weekdays?.close || "20:00"
          );
          setTimeSlots([
            {
              label: "Morning",
              slots: morningSlots,
            },
            {
              label: "Evening",
              slots: eveningSlots,
            },
          ]);
        });
    } catch (error) {
      if (axios.isCancel(error)) return;
      console.log(error);
    }
  }, [petId]);

  useEffect(() => {
    if (petShopData?.shopLocation) {
      getCoordinatesFromAddress(petShopData.shopLocation).then((coords) => {
        if (coords) {
          if (coords.error) {
            setNoLocationError(coords.error);
          } else {
            setCoordinates(coords);
          }
        }
      });
    }
  }, [petShopData?.shopLocation]);

  return (
    <div className="flex justify-center w-max">
      <Card className="w-full  max-w-[90vw]  max-md:h-[27rem] border max-md:overflow-y-scroll max-md:hidden-scrollbar lg:max-w-4xl xl:max-w-5xl py-4">
        <CardContent className="md:grid flex flex-col-reverse  md:grid-cols-[60%_auto] lg:grid-cols-3 gap-6">
          {/* Location & Reason Section */}
          <div className="lg:col-span-2 md:overflow-auto md:h-[27rem] md:hidden-scrollbar p-2">
            <h2 className="text-sm font-medium text-blue-500 mb-4">
              Enter Details
            </h2>
            <div className="flex flex-col gap-2 mb-8">
              <div className="flex gap-2">
                <Input
                  placeholder="First Name"
                  type="text"
                  onChange={(e) => setUserFirstName(e.target.value)}
                  value={userFirstName}
                />
                <Input
                  placeholder="Last Name"
                  type="text"
                  onChange={(e) => setUserLastName(e.target.value)}
                  value={userLastName}
                />
              </div>

              <Input
                type="email"
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <Input
                type="number"
                placeholder="phone number"
                onChange={(e) => setPhone(e.target.value)}
                value={Number.parseInt(phone)}
              />
              <Textarea
                placeholder={"Meeting Description (optional)"}
                value={meetingDescription}
                onChange={(e) => setMeetingDescription(e.target.value)}
              />
            </div>

            <h2 className="text-sm font-medium text-blue-500 my-4">
              Select Date & Time
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => setSelectedDate(date)}
              />
              <div>
                {timeSlots?.map((timeGroup) => (
                  <div key={timeGroup.label} className="mb-4">
                    <h3 className="font-medium text-gray-700 text-sm">
                      {timeGroup.label}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {timeGroup?.slots.map((time) => (
                        <Button
                          key={time}
                          variant={time === selectedTime ? "solid" : "outline"}
                          className={`${
                            time === selectedTime
                              ? "bg-blue-500 text-white"
                              : ""
                          }`}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map & Location Details Section */}
          <div>
            <div className="w-full flex justify-between items-center">
              <p className="text-gray-700 mb-4 text-sm font-bold">
                {petShopData?.shopName}
              </p>
            </div>
            <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center mb-6">
              {petShopData?.shopLocation && (
                <div className="h-48 w-full bg-gray-100 rounded-md flex items-center justify-center mb-6">
                  {noLocationError ? (
                    <p className="text-sm tracking-tighter">
                      {noLocationError}
                    </p>
                  ) : coordinates ? (
                    <MapComponent
                      latitude={coordinates.latitude}
                      longitude={coordinates.longitude}
                    />
                  ) : (
                    <p className="text-sm">Loading map...</p>
                  )}
                </div>
              )}
            </div>
            <p className="text-gray-700 text-sm">
              <strong>Location:</strong> {petShopData?.shopLocation}
            </p>
            <p className="text-gray-700 text-sm mt-4">
              <strong>Phone:</strong> {petShopData?.shopPhoneNo}
            </p>
            <p className="text-gray-700 text-sm mt-4">
              <strong>Email:</strong> {petShopData?.shopEmail}
            </p>
            <p className="text-gray-700 mt-4 text-sm">
              <strong>Hours:</strong>
              <br />
              Monday - Friday: {petShopData?.shopTimmings?.weekdays?.open} AM to{" "}
              {petShopData?.shopTimmings?.weekdays?.close} PM
              <br />
              {petShopData?.shopTimmings?.sundayClosed
                ? "Sunday: Closed"
                : "Sunday: Open"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentScheduler;
