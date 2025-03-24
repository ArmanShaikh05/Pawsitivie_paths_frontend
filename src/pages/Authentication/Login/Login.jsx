import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CHECK_DOCTOR_EMAIL_BEFORE_LOGIN,
  CHECK_SHOP_OWNER_EMAIL_BEFORE_LOGIN,
  CHECK_USER_EMAIL_BEFORE_LOGIN,
  GET_DOCTOR_DETAILS,
  GET_SHOP_DETAILS,
  GET_USER_DETAILS,
} from "@/constants/routes";
import { useToast } from "@/hooks/use-toast";
import { setUserDetails } from "@/redux/reducers/userDetailsSlice";
import axios from "axios";
import { useState } from "react";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../utils/useContext";
import "./login.scss";

const Login = () => {
  const { toast } = useToast();

  const { login } = useAuth();
  const dispatch = useDispatch();

  const [passwordType, setPasswordType] = useState("password");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [logging, setLogging] = useState(false);

  const navigate = useNavigate();

  const handleUserLogin = async () => {
    if (email === "" || password === "")
      return toast({
        title: "Please fill all fields",
        variant: "destructive",
      });
    setLogging(true);
    try {
      const response = await axios.post(CHECK_USER_EMAIL_BEFORE_LOGIN, {
        email: email,
      });

      if (response.status === 200) {
        login(email, password)
          .then(({ user }) => {
            const cancelToken = axios.CancelToken.source();
            axios
              .get(`${GET_USER_DETAILS}/${user?.uid}`, {
                cancelToken: cancelToken.token,
              })
              .then(({ data }) => {
                setLogging(false);
                dispatch(setUserDetails(data.data));
                window.localStorage.setItem("pet-role", data.data?.role);
                navigate("/home");
                toast({
                  title: "Login Successfull",
                });
              });
          })
          .catch((err) => {
            if (axios.isCancel(err)) return setLogging(false);
            toast({
              variant: "destructive",
              title: err.message,
            });
            setLogging(false);
          });
      }
    } catch (error) {
      if (error.response.data?.message) {
        return toast({
          variant: "destructive",
          title: error.response.data.message,
        });
      }
      console.log(error);
    } finally {
      setLogging(false);
    }
  };

  const handleShopLogin = async () => {
    if (email === "" || password === "")
      return toast({
        title: "Please fill all fields",
        variant: "destructive",
      });
    setLogging(true);

    try {
      const response = await axios.post(CHECK_SHOP_OWNER_EMAIL_BEFORE_LOGIN, {
        email: email,
      });

      if (response.status === 200) {
        login(email, password)
          .then(({ user }) => {
            const cancelToken = axios.CancelToken.source();
            axios
              .get(`${GET_SHOP_DETAILS}/${user?.uid}`, {
                cancelToken: cancelToken.token,
              })
              .then(({ data }) => {
                setLogging(false);
                dispatch(setUserDetails(data.data));
                window.localStorage.setItem("pet-role", data.data?.role);
                navigate("/home");
                toast({
                  title: "Login Successfull",
                });
              });
          })
          .catch((err) => {
            if (axios.isCancel(err)) return setLogging(false);
            toast({
              variant: "destructive",
              title: err.message,
            });
            setLogging(false);
          });
      }
    } catch (error) {
      if (error.response.data?.message) {
        return toast({
          variant: "destructive",
          title: error.response.data.message,
        });
      }
      console.log(error);
    } finally {
      setLogging(false);
    }
  };

  const handlePetDoctorLogin = async () => {
    if (email === "" || password === "")
      return toast({
        title: "Please fill all fields",
        variant: "destructive",
      });
    setLogging(true);
    try {
      const response = await axios.post(CHECK_DOCTOR_EMAIL_BEFORE_LOGIN, {
        email: email,
      });

      if (response.status === 200) {
        login(email, password)
          .then(({ user }) => {
            const cancelToken = axios.CancelToken.source();
            axios
              .get(`${GET_DOCTOR_DETAILS}/${user?.uid}`, {
                cancelToken: cancelToken.token,
              })
              .then(({ data }) => {
                setLogging(false);
                dispatch(setUserDetails(data.data));
                window.localStorage.setItem("pet-role", data.data?.role);
                navigate("/home");
                toast({
                  title: "Login Successfull",
                });
              });
          })
          .catch((err) => {
            if (axios.isCancel(err)) return setLogging(false);
            toast({
              variant: "destructive",
              title: err.message,
            });
            setLogging(false);
          });
      }
    } catch (error) {
      if (error.response.data?.message) {
        return toast({
          variant: "destructive",
          title: error.response.data.message,
        });
      }
      console.log(error);
    } finally {
      setLogging(false);
    }
  };

  return (
    <main className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <Tabs defaultValue="user" className="w-[95%]">
          <TabsList className="grid w-full grid-cols-3 h-[3rem]">
            <TabsTrigger value="user" className="h-[2.5rem]">
              User
            </TabsTrigger>
            <TabsTrigger value="shopOwner" className="h-[2.5rem]">
              Shop Owner
            </TabsTrigger>
            <TabsTrigger value="petDoctor" className="h-[2.5rem]">
              Pet Doctor
            </TabsTrigger>
          </TabsList>
          <TabsContent value="user">
            <Card>
              <CardContent className="space-y-8 login-form py-4">
                <div className="form-row">
                  <FaUser />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                  />
                </div>

                <div className="form-row">
                  <RiLockPasswordFill />
                  <input
                    type={passwordType}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                  />

                  {passwordType === "password" ? (
                    <BiSolidHide onClick={() => setPasswordType("text")} />
                  ) : (
                    <BiSolidShow onClick={() => setPasswordType("password")} />
                  )}
                </div>

                <span>
                  <Link to={"/forgot-password?type=user"}>
                    forgot password?
                  </Link>
                </span>

                <Button
                  disabled={logging}
                  onClick={handleUserLogin}
                  variant="primary"
                  className="w-full mt-8"
                >
                  Login
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="shopOwner">
            <Card>
              <CardContent className="space-y-8 login-form py-4">
                <div className="form-row">
                  <FaUser />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                  />
                </div>

                <div className="form-row">
                  <RiLockPasswordFill />
                  <input
                    type={passwordType}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                  />

                  {passwordType === "password" ? (
                    <BiSolidHide onClick={() => setPasswordType("text")} />
                  ) : (
                    <BiSolidShow onClick={() => setPasswordType("password")} />
                  )}
                </div>

                <span>
                  <Link to={"/forgot-password?type=shopOwner"}>
                    forgot password?
                  </Link>
                </span>

                <Button
                  disabled={logging}
                  onClick={handleShopLogin}
                  variant="primary"
                  className="w-full mt-8"
                >
                  Login
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="petDoctor">
            <Card>
              <CardContent className="space-y-8 login-form py-4">
                <div className="form-row">
                  <FaUser />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                  />
                </div>

                <div className="form-row">
                  <RiLockPasswordFill />
                  <input
                    type={passwordType}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                  />

                  {passwordType === "password" ? (
                    <BiSolidHide onClick={() => setPasswordType("text")} />
                  ) : (
                    <BiSolidShow onClick={() => setPasswordType("password")} />
                  )}
                </div>

                <span>
                  <Link to={"/forgot-password?type=petDoctor"}>
                    forgot password?
                  </Link>
                </span>
                <Button
                  disabled={logging}
                  onClick={handlePetDoctorLogin}
                  variant="primary"
                  className="w-full mt-8"
                >
                  Login
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <span>
          Dont have an account? <Link to={"/signup"}>Sign up</Link>
        </span>
      </div>
    </main>
  );
};

export default Login;
