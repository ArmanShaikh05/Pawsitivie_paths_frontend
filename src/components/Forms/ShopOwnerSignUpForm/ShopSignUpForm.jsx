

import { Button } from "@/components/ui/button";
import { CREATE_SHOP_ROUTE } from "@/constants/routes";
import { useToast } from "@/hooks/use-toast";
import { setUserDetails } from "@/redux/reducers/userDetailsSlice";
import { useAuth } from "@/utils/useContext";
import { shopOwnerSignUpSchema } from "@/validators/userValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiFillShop } from "react-icons/ai";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const ShopSignUpForm = () => {
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSignin = async (formData) => {
    setLoading(true);
    signup(formData.email, formData.passwords.password)
      .then((res) => {
        const cancelToken = axios.CancelToken.source();
        let data;
        const userId = (
          formData.userName.split(" ")[0] +
          "_" +
          res.user.uid
        ).slice(0, 15);

        data = {
          userName: formData.userName,
          email: formData.email,
          role: "shopOwner",
          uid: res.user.uid,
          userId,
          shopName:formData.shopName,
        };

        axios
          .post(CREATE_SHOP_ROUTE, data, {
            cancelToken: cancelToken.token,
          })
          .then(({ data }) => {
            toast({
              title: "User created successfully",
            });
            console.log(data.data);
            dispatch(setUserDetails(data.data));
            window.localStorage.setItem("pet-role", "shopOwner");
            navigate("/home");
            setLoading(false);
          });
      })
      .catch((err) => {
        if (axios.isCancel(err)) return setLoading(false);
        toast({
          variant: "destructive",
          title: err.message,
        });
        console.log(err);
        setLoading(false);
      });
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
    resolver: zodResolver(shopOwnerSignUpSchema),
  });

  const onError = (err) => {
    console.log(err);
  };

  return (
    <form onSubmit={handleSubmit(handleSignin, onError)} className="signup-form">
      <div className="form-row">
        <AiFillShop />
        <input type="text" placeholder="Shop name" {...register("shopName")} />
      </div>
      {errors.shopName && (
        <p className="text-sm text-red-400 text-left w-full">
          {errors.shopName.message}
        </p>
      )}

      <div className="form-row">
        <FaUser />
        <input type="text" placeholder="Username" {...register("userName")} />
      </div>
      {errors.userName && (
        <p className="text-sm text-red-400 text-left w-full">
          {errors.userName.message}
        </p>
      )}

      <div className="form-row">
        <MdEmail />
        <input type="email" placeholder="Email" {...register("email")} />
      </div>
      {errors.email && (
        <p className="text-sm text-red-400 text-left w-full">
          {errors.email.message}
        </p>
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
          <BiSolidShow onClick={() => setConfirmPasswordType("password")} />
        )}
      </div>
      {errors.passwords?.confirmPassword && (
        <p className="text-sm text-red-400 text-left w-full">
          {errors.passwords.confirmPassword.message}
        </p>
      )}

      <Button type="submit" disabled={loading}>
        Sign Up
      </Button>
    </form>
  );
};

export default ShopSignUpForm;
