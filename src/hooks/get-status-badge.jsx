/* eslint-disable react/prop-types */
export function StatusBadge({ status }) {
  const statusStyles = {
    pending: "bg-orange-100 text-orange-700 border-orange-500",
    success: "bg-green-100 text-green-700 border-green-500",
    unfulfilled: "bg-red-100 text-red-700 border-red-500",
    inTransition: "bg-blue-100 text-blue-700 border-blue-500",
    shipped: "bg-purple-100 text-purple-700 border-purple-500",
    outForDelivery: "bg-yellow-100 text-yellow-700 border-yellow-500",
    delivered: "bg-green-100 text-green-700 border-green-500",
  };

  const statusText = {
    pending: "Pending",
    success: "Success",
    unfulfilled: "Unfulfilled",
    inTransition: "In Transition",
    shipped: "Shipped",
    outForDelivery: "Out For Delivery",
    delivered: "Delivered",
  };

  return (
    <div
      className={`inline-flex items-center px-3 py-1 border rounded-full font-medium text-xs ${statusStyles[status]}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-2 ${
          status === "pending"
            ? "bg-orange-500"
            : status === "success"
            ? "bg-green-500" : status === "inTransition"
            ? "bg-blue-500"
            : status === "shipped"
            ? "bg-purple-500"
            : status === "outForDelivery"
            ? "bg-yellow-500"
            : "bg-green-500" 
            
        }`}
      ></span>
      {statusText[status]}
    </div>
  );
}
