/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";

// A mock function to simulate checking payment status
const isPaymentValid = () => {
  // Replace this with actual validation logic
  return localStorage.getItem("paymentStatus") === "completed" || 
         localStorage.getItem("paymentStatus") === "failed";
};

const PaymentProtectedRoute = ({ children }) => {
  if (!isPaymentValid()) {
    // Redirect to home if payment status is invalid
    return <Navigate to="/" />;
  }
  return children;
};

export default PaymentProtectedRoute;
