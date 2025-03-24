import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { auth } from "@/utils/firebase";
import {
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);

  const sendOtp = async () => {
    try {
      setSendingOtp(true);

      // Check whether email is valid or not
      if (!email) {
        return toast({
          title: "Please enter email",
          variant: "destructive",
        });
      }

      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length === 0) {
        return toast({
          title: "No user exists with this email",
          variant: "destructive",
        });
      } else {
        // Send reset email link to user

        await sendPasswordResetEmail(auth, email, {
          url: import.meta.env.VITE_RESET_PASSWORD_PAGE_URL,
        });

        toast({
          title: "Password reset link sent to your email",
        });

        // const response = await axios.post(SEND_OTP, {
        //   email: email,
        // });

        // if (response.status === 200) {
        //   toast({
        //     title: "OTP sent to your email",
        //   });
        //   setUpdatePasswordEmail(email);
        //   window.localStorage.setItem("verify-otp-session", "true");
        //   navigate("/verify-otp");
        // }
      }
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        toast({
          title: "Please enter valid email",
          variant: "destructive",
        });
      } else {
        console.log(error);
      }
    } finally {
      setSendingOtp(false);
    }
  };

  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-[#e5e7eb]">
      <div className="md:w-1/2 w-[500px] md:max-w-[500px] bg-[#fff] p-4 flex flex-col items-center rounded-2xl shadow-lg">
        <h2 className="text-center my-4 mt-4 mb-8 uppercase tracking-[3px] text-2xl font-bold">
          Forgot Password
        </h2>
        <Card className="w-[90%] mx-auto py-8">
          <CardContent className="space-y-8  flex flex-col items-center py-8">
            <p className="text-sm text-center text-gray-500">
              Enter the email for your account and we will send a 6 digit otp in
              your eamil
            </p>
            <div className="w-full h-12 flex items-center my-4 gap-4 border-b-2 border-black">
              <FaUser size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full h-full border-none outline-none bg-transparent"
              />
            </div>

            <Button
              disabled={sendingOtp}
              onClick={sendOtp}
              variant="primary"
              className="w-full mt-8"
            >
              Send Reset Link
            </Button>
          </CardContent>
        </Card>
        <Link to={"/login"} className="my-4">
          Go back to login
        </Link>
      </div>
    </main>
  );
};

export default ForgotPassword;
