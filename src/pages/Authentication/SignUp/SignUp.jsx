import ShopSignUpForm from "@/components/Forms/ShopOwnerSignUpForm/ShopSignUpForm";
import UserForm from "@/components/Forms/UserSignUpForm/UserForm";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./signup.scss";

const SignUp = () => {
  const [userRole, setUserRole] = useState("user");

  return (
    <main className="signup-container">
      <div className="signup-box">
        <h2>signup</h2>
        <div className="flex space-x-2 border-2 p-2 w-full rounded-[8px] mb-4">
          <Button
            variant={userRole === "user" ? "primary" : "outline"}
            className="px-4 py-2 w-full"
            onClick={() => setUserRole("user")}
          >
            Pet Owner
          </Button>
          <Button
            variant={userRole === "shopOwner" ? "primary" : "outline"}
            className="px-4 py-2 w-full"
            onClick={() => setUserRole("shopOwner")}
          >
            Shop Owner
          </Button>
          <Button
            variant={userRole === "doctor" ? "primary" : "outline"}
            className="px-4 py-2 w-full"
            onClick={() => setUserRole("doctor")}
          >
            Veterinarian
          </Button>
        </div>
        {userRole === "shopOwner" ? (
          <ShopSignUpForm />
        ) : (
          <UserForm userRole={userRole} />
        )}
        <span>
          Already have an account? <Link to={"/login"}>Log In</Link>
        </span>
      </div>
    </main>
  );
};

export default SignUp;
