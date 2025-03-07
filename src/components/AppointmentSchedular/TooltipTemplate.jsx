/* eslint-disable react/prop-types */
import { FaCalendarAlt, FaPhoneAlt } from "react-icons/fa";
import { IoIosTime } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import AppointmentBadge from "./AppointmentBadge";

const EventTooltip = ({ event, role }) => {
  return (
    <div className=" bg-white rounded-xl p-4 w-72 border border-gray-200">
      {/* Header with Image & Event Title */}
      <div className="flex items-center space-x-3">
        <img
          src={event.PetImg}
          alt={event.Subject}
          className="w-12 h-12 rounded-full border object-cover"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {event.Subject}
          </h3>
          {role && role === "shopOwner" ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {event.clientName}
            </p>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {event.ShopName}
            </p>
          )}
        </div>
      </div>

      {/* Event Date & Time */}
      <div className="my-2 text-sm text-gray-700 dark:text-gray-300">
        {role && role === "shopOwner" ? (
          <div>
            <p className="flex items-center gap-2">
              <MdEmail />{" "}
              <span className="text-gray-700 font-medium text-sm">
                {event.clientEmail}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <FaPhoneAlt />{" "}
              <span className="text-gray-700 font-medium text-sm">
                {event.clientPhoneNo}
              </span>
            </p>
          </div>
        ) : (
          <p className="flex items-center gap-2">
            <IoLocationSharp />{" "}
            <span className="text-gray-700 font-medium text-sm">
              {event.Location}
            </span>
          </p>
        )}
        <p className="flex items-center gap-2">
          <FaCalendarAlt />{" "}
          <span className="text-gray-700 font-medium text-sm">
            {new Date(event.StartTime).toLocaleDateString()}
          </span>
        </p>
        <p className="flex items-center gap-2">
          <IoIosTime />{" "}
          <span className="text-gray-700 font-medium text-sm">
            {new Date(event.StartTime).toLocaleTimeString()} -{" "}
            {new Date(event.EndTime).toLocaleTimeString()}
          </span>
        </p>
      </div>
      <AppointmentBadge status={event?.status} />
    </div>
  );
};

export default EventTooltip;
