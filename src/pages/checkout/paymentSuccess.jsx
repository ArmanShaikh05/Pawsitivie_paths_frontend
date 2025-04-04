import { Button } from "@/components/ui/button";
import { EMPTY_CART_AFTER_PAYMENT } from "@/constants/routes";
import { setCartItems } from "@/redux/reducers/userDetailsSlice";
import axios from "axios";
import { CheckCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const cartData = useSelector((state) => state.userDetailReducer.cartItems);
  const userData = useSelector((state) => state.userDetailReducer.userData);
  const dispatch = useDispatch();

  const emptyCartAfterPayment = async () => {
      try {
        const shippingDetails = JSON.parse(localStorage.getItem("shippingDetails"))
        const cancelToken = axios.CancelToken.source();
        const response = await axios.post(
          EMPTY_CART_AFTER_PAYMENT,
          {
            userId: userData?._id,
            cartItems: cartData,
            shippingDetails,
          },
          {
            cancelToken: cancelToken.token,
          }
        );
  
        if (response.status === 200) {
          dispatch(setCartItems([]));
        }
      } catch (error) {
        if (axios.isCancel) return;
        console.error(error);
      }
    };

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
              variant="outline"s
              className="w-full cursor-pointer bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white hover:from-green-500 hover:via-green-600 hover:to-green-700"
              onClick={() => {
                localStorage.removeItem("paymentStatus");
                emptyCartAfterPayment();
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
