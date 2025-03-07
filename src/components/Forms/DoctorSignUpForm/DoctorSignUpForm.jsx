/* eslint-disable react/prop-types */

import { userSignUpSchema } from "@/validators/userValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { Button } from "@/components/ui/button";

const DoctorSignUpForm = ({signIn}) => {

    const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");

    const {
        register,
        formState: { errors },
        handleSubmit
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
        resolver: zodResolver(userSignUpSchema),
      });


  return (
    <form onSubmit={handleSubmit(signIn)} className="signup-form">
    <div className="form-row">
      <FaUser />
      <input
        type="text"
        placeholder="Username"
        {...register("userName")}
      />
    </div>
    {errors.userName && (
      <p className="text-sm text-red-400 text-left w-full">{errors.userName.message}</p>
    )}

    <div className="form-row">
      <MdEmail />
      <input type="email" placeholder="Email" {...register("email")} />
    </div>
    {errors.email && (
      <p className="text-sm text-red-400 text-left w-full">{errors.email.message}</p>
    )}

    <div className="form-row">
      <RiLockPasswordFill />
      <input
        type={passwordType}
        placeholder="Create Password"
        {...register("passwords.password")}
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

    <div className="form-row">
      <RiLockPasswordFill />
      <input
        type={confirmPasswordType}
        placeholder="Confirm Password"
        {...register("passwords.confirmPassword")}
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

    <Button type="submit">Sign Up</Button>
  </form>
  )
}

export default DoctorSignUpForm