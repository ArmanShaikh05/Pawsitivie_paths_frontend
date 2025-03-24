import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { auth } from "@/utils/firebase";
import { updatePasswordSchema } from "@/validators/userValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { confirmPasswordReset } from "firebase/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { RiLockPasswordFill } from "react-icons/ri";
import { useNavigate, useSearchParams } from "react-router-dom";

const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");

  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  const navigate = useNavigate();

  const updatePassword = async () => {
    try {
      setLoading(true);
      await confirmPasswordReset(auth, oobCode, password);
      toast({
        title: "Password updated successfully",
      });
      navigate("/login");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      userName: "",
      email: "",
      passwords: {
        password: "",
        confirmPassword: "",
      },
      shopName: "",
    },
    resolver: zodResolver(updatePasswordSchema),
  });

  const onError = (err) => {
    console.log(err);
  };

  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-[#e5e7eb]">
      <div className="md:w-1/2 w-[500px] md:max-w-[500px] bg-[#fff] p-4 flex flex-col items-center rounded-2xl shadow-lg">
        <h2 className="text-center my-4 mt-4 mb-8 uppercase tracking-[3px] text-2xl font-bold">
          Update Password
        </h2>
        <Card className="w-[90%] mx-auto py-8">
          <CardContent className="space-y-8  flex flex-col items-center py-8">
            <p className="text-sm text-center text-gray-500">
              Set up your new password for the account and remember it.{" "}
              <b>Do not refresh the page.</b>
            </p>

            <div className="w-full h-12 flex items-center my-4 gap-4 border-b-2 border-black">
              <RiLockPasswordFill />
              <input
                type={passwordType}
                placeholder="Create Password"
                {...register("passwords.password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-none outline-none w-full"
              />
              {passwordType === "password" ? (
                <BiSolidHide onClick={() => setPasswordType("text")} />
              ) : (
                <BiSolidShow onClick={() => setPasswordType("password")} />
              )}
            </div>
            {errors.passwords?.password && (
              <p className="text-sm w-full text-red-400 text-left">
                {errors.passwords.password.message}
              </p>
            )}

            <div className="w-full h-12 flex items-center my-4 gap-4 border-b-2 border-black">
              <RiLockPasswordFill />
              <input
                type={confirmPasswordType}
                placeholder="Confirm Password"
                {...register("passwords.confirmPassword")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border-none outline-none w-full"
              />
              {confirmPasswordType === "password" ? (
                <BiSolidHide onClick={() => setConfirmPasswordType("text")} />
              ) : (
                <BiSolidShow
                  onClick={() => setConfirmPasswordType("password")}
                />
              )}
            </div>
            {errors.passwords?.confirmPassword && (
              <p className="text-sm text-red-400 text-left w-full">
                {errors.passwords.confirmPassword.message}
              </p>
            )}

            <Button
              disabled={loading}
              onClick={handleSubmit(updatePassword, onError)}
              variant="primary"
              className="w-full mt-8"
            >
              Update Password
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default UpdatePassword;
