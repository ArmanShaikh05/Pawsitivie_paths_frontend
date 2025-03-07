/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import toast from "react-hot-toast";
import Loader from "../components/Loader/Loader";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const forgotPassword = (email) => {
    return sendPasswordResetEmail(auth, email, {
      url: import.meta.env.VITE_LOGIN_PAGE_URL,
    });
  };

  const resetPassword = (oobCode, newPassword) => {
    return confirmPasswordReset(auth, oobCode, newPassword);
  };

  const logout = () => {
    return signOut(auth);
  };

  const updateUserPassword = async (oldPassword, newPassword) => {
    setIsSubmitting(true);
    const user = auth.currentUser;
    let credentials = EmailAuthProvider.credential(user.email, oldPassword);
    reauthenticateWithCredential(user, credentials)
      .then(() => {
        updatePassword(user, newPassword)
          .then(() => {
            toast.success("Password Updated Successfully");
            setIsSubmitting(false);
          })
          .catch((err) => {
            toast.error("Failed to update password");
            setIsSubmitting(false);
            console.log(err);
          });
      })
      .catch((err) => {
        toast.error("Wrong current password");
        setIsSubmitting(false);
        console.log(err);
      });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signup,
        login,
        logout,
        currentUser,
        forgotPassword,
        resetPassword,
        updateUserPassword,
        isSubmitting,
      }}
    >
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};
