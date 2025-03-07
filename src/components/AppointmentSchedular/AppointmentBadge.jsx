/* eslint-disable react/prop-types */
const AppointmentBadge = ({ status }) => {
    const badgeStyles = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-400",
      completed: "bg-green-100 text-green-700 border-green-400",
      failed: "bg-red-100 text-red-700 border-red-400",
    };
  
    return (
      <span
        className={`inline-flex items-center px-3 py-1 border rounded-full text-sm font-medium shadow-md ${badgeStyles[status]}`}
      >
        {status === "pending" && (
          <>
            <svg
              className="w-4 h-4 mr-1 text-yellow-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6l4 2"
              ></path>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"></circle>
            </svg>
            Pending
          </>
        )}
        {status === "completed" && (
          <>
            <svg
              className="w-4 h-4 mr-1 text-green-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            Completed
          </>
        )}
        {status === "failed" && (
          <>
            <svg
              className="w-4 h-4 mr-1 text-red-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
            Failed
          </>
        )}
      </span>
    );
  };
  
  export default AppointmentBadge;
  