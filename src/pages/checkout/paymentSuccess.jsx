import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="relative bg-white bg-opacity-80 backdrop-blur-md rounded-lg shadow-lg p-6 max-w-md w-full">
        <div className="flex flex-col items-center text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
          <h1 className="text-2xl font-bold text-gray-800">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mt-2">
            Thank you for your purchase. Your transaction has been completed
            successfully.
          </p>
          <div className="mt-6 w-full">
            <Button
              variant="outline"
              className="w-full cursor-pointer bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white hover:from-green-500 hover:via-green-600 hover:to-green-700"
              onClick={() => {
                localStorage.removeItem("paymentStatus");
                navigate("/home");
              }}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
