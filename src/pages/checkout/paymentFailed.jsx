import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      <div className="relative bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-lg p-6 max-w-md w-full">
        <div className="flex flex-col items-center text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mb-4 animate-pulse" />
          <h1 className="text-2xl font-bold text-gray-800">Payment Failed</h1>
          <p className="text-gray-600 mt-2">
            Unfortunately, your transaction could not be completed. Please try
            again or contact support if the issue persists.
          </p>
          <div className="mt-6 w-full">
            <Button
              variant="outline"
              className="w-full bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white hover:from-red-500 hover:via-red-600 hover:to-red-700"
              onClick={() => {
                localStorage.removeItem("paymentStatus");
                navigate("/cart");
              }}
            >
              Back to cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
