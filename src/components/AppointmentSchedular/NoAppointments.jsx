/* eslint-disable react/prop-types */
import { AlertCircle } from "lucide-react";

const NoAppointments = ({mode}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-gray-50 rounded-lg shadow-md">
      <div className="flex items-center justify-center w-16 h-16 bg-red-100 text-red-500 rounded-full mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="text-lg font-semibold text-gray-700">No Appointments Found</h2>
      <p className="text-sm text-gray-500 mt-2 text-center">
        {`It looks like you don’t have any ${mode} appointments.`}
      </p>

    </div>
  );
};

export default NoAppointments;