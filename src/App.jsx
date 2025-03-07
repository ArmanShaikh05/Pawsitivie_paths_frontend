import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import PaymentProtectedRoute from "./components/ProtectedRoute/PaymentProtection";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import FavouriteAccessories from "./components/Whishlist-Page-Components/Accessories/FavouriteAccessories";
import FavouritePets from "./components/Whishlist-Page-Components/Pets/FavouritePets";
import FavouriteShops from "./components/Whishlist-Page-Components/Shops/FavouriteShops";
import AppLayout from "./layouts/AppLayout";
import AllReviews from "./pages/AllReviews/AllReviews";
import Login from "./pages/Authentication/Login/Login";
import SignUp from "./pages/Authentication/SignUp/SignUp";
import CartPage from "./pages/CartPage/CartPage";
import PaymentFailed from "./pages/checkout/paymentFailed";
import PaymentSuccess from "./pages/checkout/paymentSuccess";
import EditProfile from "./pages/EditProfile/EditProfile";
import UserEvents from "./pages/Events/UserEvents";
import HomePage from "./pages/Home/HomePage";
import LandingPage from "./pages/LandingPage/LandingPage";
import ManageOwnedPets from "./pages/ManageOwnedPets/ManageOwnedPets";
import Marketplace from "./pages/Marketplace/Marketplace";
import NotificationComponent from "./pages/Notifications/Notifications";
import Pets from "./pages/Pets/Pets";
import ProductPage from "./pages/ProductPage/ProductPage";
import Profile from "./pages/ProfilePage/Profile";
import ShopHomePage from "./pages/Shop/ShopHomePage/ShopHomePage";
import ShopItems from "./pages/Shop/ShopItems/ShopItems";
import ShopOrders from "./pages/Shop/ShopOrders/ShopOrders";
import ShopPets from "./pages/Shop/ShopPets/ShopPets";
import ShopProfileEdit from "./pages/Shop/ShopProdileEdit/ShopProfileEdit";
import ShopProfile from "./pages/Shop/ShopProfile/ShopProfile";
import ShopPage from "./pages/ShopPage/ShopPage";
import SinglePet from "./pages/SinglePet/SinglePet";
import OrderHistory from "./pages/UserOrderHistory/OrderHistory";
import WhishListPage from "./pages/WhishlistPage/WhishListPage";
import { addNewNotifications } from "./redux/reducers/notificationsSlice";
import { useAuth, useGlobalVariables, useSocket } from "./utils/useContext";
import Appointments from "./pages/Appointments/Appointments";
import AllDoctorsPage from "./pages/Doctors/AllDoctorsPage";
import ForumPage from "./pages/Forum/ForumPage";
import TPP_Profile from "./pages/TPP_Profile/TPP_Profile";
import DoctorsProfile from "./pages/Doctors/DoctorsProfile";
import DoctorHomePage from "./pages/Doctors/DoctorHomePage.jsx/DoctorHomePage";
import DoctorProfile from "./pages/Doctors/DoctorProfile/DoctorProfile";
import DoctorProfileEdit from "./pages/Doctors/DoctorProfileEdit/DoctorProfileEdit";

const App = () => {
  const { currentUser } = useAuth();
  const { socket } = useSocket();
  const dispatch = useDispatch();
  const role = useSelector((state) => state.userDetailReducer.userData.role);
  // const role  = "user"
  const { setFriendRequestCount } = useGlobalVariables();

  useEffect(() => {
    if (socket) {
      socket.on("receiveNotification", (data) => {
        dispatch(addNewNotifications(data.notiData));
      });

      socket.on("newFriendRequest", () => {
        setFriendRequestCount((prev) => prev + 1);
      });
    }

    return () => {
      socket?.off("receiveNotification");
      socket?.off("newFriendRequest");
      socket?.off("receiveMessage");
    };
  }, [socket]);

  return (
    <Router>
      <Routes>
        <Route
          element={
            <ProtectedRoute
              isAuthenticated={currentUser ? false : true}
              redirectTo={"/home"}
            />
          }
        >
          <Route path="/" element={<LandingPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute
              isAuthenticated={currentUser ? false : true}
              redirectTo={"/"}
            />
          }
        >
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        <Route
          element={
            <ProtectedRoute
              isAuthenticated={currentUser ? true : false}
              redirectTo={"/login"}
            />
          }
        >
          <Route element={<AppLayout />}>
            <Route
              path="/home"
              element={
                role === "shopOwner" ? (
                  <ShopHomePage />
                ) : role === "petDoctor" ? (
                  <DoctorHomePage />
                ) : (
                  <HomePage />
                )
              }
            />
            <Route path="/shop/:shopId" element={<ShopPage />} />

            {/* USER ONLY ROUTES START HERE */}
            <Route
              element={
                <ProtectedRoute
                  isAuthenticated={role === "user" ? true : false}
                  redirectTo={"/home"}
                />
              }
            >
              <Route path="/market/" element={<Marketplace />} />
              <Route path="/market/:productId" element={<ProductPage />} />
              <Route
                path="/market/:Id/product-reviews"
                element={<AllReviews />}
              />
              <Route path="/pets" element={<Pets />} />
              <Route path="/pets/:petId" element={<SinglePet />} />
              <Route path="/pets/:Id/pet-reviews" element={<AllReviews />} />

              <Route path="/whishlist/" element={<WhishListPage />}>
                <Route index path="pets" element={<FavouritePets />} />
                <Route path="shops" element={<FavouriteShops />} />
                <Route path="accessories" element={<FavouriteAccessories />} />
              </Route>
              <Route
                path="/profile/:userId/manage-owned-pets"
                element={<ManageOwnedPets />}
              />

              <Route path="/cart" element={<CartPage />} />
              <Route path="/order-history" element={<OrderHistory />} />

              <Route path="/pet-doctors" element={<AllDoctorsPage />} />

              <Route
                path="/pet-doctors/:doctorId"
                element={<DoctorsProfile />}
              />

              <Route path="/forum" element={<ForumPage />} />
            </Route>
            {/* USER ONLY ROUTES END HERE */}

            <Route
              path="/profile/:userId"
              element={role === "user" ? <Profile />  : role === "petDoctor" ?  <DoctorProfile /> : <ShopProfile />}
            />

            <Route path="/profile/view/:userId" element={<TPP_Profile />} />

            <Route path="/events/:id" element={<UserEvents />} />

            <Route path="/appointments/:id" element={<Appointments />} />

            <Route path="/notifications" element={<NotificationComponent />} />

            <Route
              path="/profile/:userId/edit"
              element={role === "user" ? <EditProfile /> : role === "petDoctor" ? <DoctorProfileEdit /> : <ShopProfileEdit />}
            />

            {/* SHOP ONLY ROUTES START HERE */}
            <Route
              element={
                <ProtectedRoute
                  isAuthenticated={role === "shopOwner" ? true : false}
                  redirectTo={"/home"}
                />
              }
            >
              <Route path="/shop-pets" element={<ShopPets />} />
              <Route path="/shop-items" element={<ShopItems />} />
              <Route path="/shop-orders" element={<ShopOrders />} />
            </Route>
            {/* SHOP ONLY ROUTES END HERE */}
          </Route>

          {/* PAYMENT ROUTES START*/}
          <Route
            path="/payment/success"
            element={
              <PaymentProtectedRoute>
                <PaymentSuccess />
              </PaymentProtectedRoute>
            }
          />
          <Route
            path="/payment/failure"
            element={
              <PaymentProtectedRoute>
                <PaymentFailed />
              </PaymentProtectedRoute>
            }
          />
          {/* PAYMENT ROUTES END*/}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
