/* eslint-disable react/prop-types */
import EventTooltip from "@/components/AppointmentSchedular/TooltipTemplate";
import Loader from "@/components/Loader/Loader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GET_EVENTS } from "@/constants/routes";
import { registerLicense } from "@syncfusion/ej2-base";
import {
  Agenda,
  Day,
  Inject,
  Month,
  ScheduleComponent,
  ViewDirective,
  ViewsDirective,
  Week,
} from "@syncfusion/ej2-react-schedule";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

const UserEvents = () => {
  const [searchParams] = useSearchParams();
  const selectedDate = searchParams.get("eventDate")
    ? new Date(searchParams.get("eventDate"))
    : new Date();
  const [isFetchingEvents, setIsFetchingEvents] = useState(false);
  const role = useSelector((state) => state.userDetailReducer.userData.role);
  const userId = useSelector((state) => state.userDetailReducer.userData._id);
  const [eventData, setEventData] = useState([]);

  registerLicense(
    "Ngo9BigBOggjHTQxAR8/V1NMaF1cWWhIfEx1RHxQdld5ZFRHallYTnNWUj0eQnxTdEBjW39ZcHZXQGFZV0xyXg=="
  );

  useEffect(() => {
    setIsFetchingEvents(true);

    axios
      .get(`${GET_EVENTS}?role=${role}&userId=${userId}`)
      .then(({ data }) => {
        const events = data?.data || [];
        let formattedEvents = [];

        if (role === "shopOwner") {
          formattedEvents = events.map((event, index) => ({
            Id: index + 1,
            Subject: event?.subject,
            StartTime: new Date(event?.startTime),
            EndTime: new Date(event?.endTime),
            Description: event?.description || "",
            IsReadOnly: true,
            PetImg: event?.resources?.petId?.petImages?.[0]?.url,
            clientName: `${event?.clientDetails?.firstName} ${event?.clientDetails?.lastName}`,
            clientEmail: event?.clientDetails?.email,
            clientPhoneNo: event?.clientDetails?.phoneNo,
            status: event?.status,
          }));
        } else if (role === "petDoctor") {
          formattedEvents = events.map((event, index) => ({
            Id: index + 1,
            Subject: event?.subject,
            StartTime: new Date(event?.startTime),
            EndTime: new Date(event?.endTime),
            Description: event?.description || "",
            IsReadOnly: true,
            PetImg: event?.clientDetails?.profilePic,
            clientName: `${event?.clientDetails?.firstName} ${event?.clientDetails?.lastName}`,
            clientEmail: event?.clientDetails?.email,
            clientPhoneNo: event?.clientDetails?.phoneNo,
            status: event?.status,
          }));
        } else {
          formattedEvents = events.map((event, index) => ({
            Id: index + 1,
            Subject: event?.subject,
            StartTime: new Date(event?.startTime),
            EndTime: new Date(event?.endTime),
            Description: event?.description || "",
            IsReadOnly: true,
            PetImg:
              event?.subject === "Pet Doctor"
                ? event?.doctorId?.profilePic?.url
                : event?.resources?.petId?.petImages?.[0]?.url,
            Location:
              event?.subject === "Pet Doctor"
                ? event?.doctorId?.address + ", " + event?.doctorId?.city + ", "+event?.doctorId?.state
                : event?.shopRecieverId?.shopAddress,
            ShopName: event?.shopRecieverId?.shopName,
            status: event?.status,
          }));
        }

        setEventData((prevData) =>
          JSON.stringify(prevData) !== JSON.stringify(formattedEvents)
            ? formattedEvents
            : prevData
        );
      })
      .catch((err) => console.error("Error fetching events:", err))
      .finally(() => setIsFetchingEvents(false));
  }, [role, userId]);

  return (
    <div className="h-full p-6 ">
      <h2 className="text-xl font-semibold mb-4">My Events</h2>
      {isFetchingEvents ? (
        <Loader />
      ) : (
        <ScrollArea className="w-full h-[37rem]">
          <ScheduleComponent
            currentView="Month"
            eventSettings={{
              dataSource: eventData,
              enableTooltip: true,
              tooltipTemplate: (event) => (
                <EventTooltip event={event} role={role} />
              ),
            }}
            readonly={true}
            selectedDate={selectedDate}
            rowAutoHeight={true}
          >
            <ViewsDirective>
              <ViewDirective option="Day" interval={3} />
              <ViewDirective option="Week" />
              <ViewDirective option="Month" />
              <ViewDirective option="Agenda" />
            </ViewsDirective>
            <Inject services={[Day, Week, Month, Agenda]} />
          </ScheduleComponent>
        </ScrollArea>
      )}
    </div>
  );
};

export default UserEvents;
