import CartProductCard from "@/components/Cards/CartProductCard/CartProductCard";
import EmptyCart from "@/components/EmptyCart/EmptyCartPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { statesArray } from "@/constants/data";
import { CHECKOUT, UPDATE_SHIPPING_ADDRESS } from "@/constants/routes";
import { useToast } from "@/hooks/use-toast";
import { setUserDetails } from "@/redux/reducers/userDetailsSlice";
import {
  getCurrency,
  getGrandTotalPrice,
  getNumberFromCurrency,
  getShippingPrice,
  getTaxPrice,
  getTotalPrice,
} from "@/utils/features";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./cartpage.scss";

const CartPage = () => {
  const { toast } = useToast();
  const cartData = useSelector((state) => state.userDetailReducer.cartItems);
  const userData = useSelector((state) => state.userDetailReducer.userData);
  const dispatch = useDispatch();

  const [section, setSection] = useState("address");
  const [coupon, setCoupon] = useState("");
  const [discountPrice, setDiscountPrice] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  const [address, setAddress] = useState(userData?.address || "");
  const [city, setCity] = useState(userData?.shippingAddress?.city || "");
  const [pincode, setPincode] = useState(
    userData?.shippingAddress?.pincode || ""
  );
  const [state, setState] = useState(userData?.shippingAddress?.state || "");
  const [updatingAddress, setUpdatingAddress] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const couponCode = "GETFLAT500";

  const updateAddress = async () => {
    try {
      setUpdatingAddress(true);
      if (address === "" || state === "" || city === "" || pincode === "")
        return toast({
          title: "Please provide complete shipping address",
          variant: "destructive",
        });
      const cancelToken = axios.CancelToken.source();
      const response = await axios.post(
        UPDATE_SHIPPING_ADDRESS,
        { userId: userData?._id, address, state, city, pincode },
        {
          cancelToken: cancelToken.token,
        }
      );

      if (response.status === 200) {
        dispatch(setUserDetails(response.data.data));
        toast({
          title: "Address Updated Successfully",
        });
      }
    } catch (error) {
      if (axios.isCancel) return;
      console.log(error);
      toast({
        title: "Failed to update address",
        variant: "destructive",
      });
    } finally {
      setUpdatingAddress(false);
    }
    toast({
      title: "Address updated",
    });
  };

  const checkCoupon = () => {
    if (cartData.length > 0) {
      if (isCouponApplied)
        return toast({
          title: "Coupon already applied",
          variant: "destructive",
        });
      if (coupon === couponCode) {
        const totalPrice = getTotalPrice(cartData);
        console.log(totalPrice);
        if (getNumberFromCurrency(totalPrice) >= 3000) {
          setIsCouponApplied(true);
          setDiscountPrice(500);
          toast({
            title: "Coupon applied successfully",
          });
        } else {
          toast({
            title: "Coupon only applied on orders above 3000",
          });
        }
      } else {
        toast({
          title: "Invalid Coupon",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "No items in cart",
      });
    }
  };

  const checkout = async () => {
    if (address === "" || city === "" || state === "" || pincode === "")
      return toast({
        title: "Please enter shipping address first",
        variant: "destructive",
      });

    const stripe = await loadStripe(
      import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    );

    const body = {
      products: cartData,
    };

    try {
      setIsCheckingOut(true);
      const cancelToken = axios.CancelToken.source();

      const response = await axios.post(CHECKOUT, body, {
        cancelToken: cancelToken.token,
      });

      if (response.status === 200) {
        localStorage.setItem("paymentStatus", "completed");
      } else {
        localStorage.setItem("paymentStatus", "failed");
      }

      stripe.redirectToCheckout({
        sessionId: response.data.sessionId,
      });
    } catch (error) {
      if (axios.isCancel) return;
      console.log(error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="cart-container">
      {cartData && cartData.length > 0 ? (
        <>
          <div className="cart-wrapper">
            <div className="flex justify-between items-center ">
              <div>
                <h3 className="max-[500px]:text-sm text-[1.8rem] font-semibold text-[#3a0751]">
                  Your Cart
                </h3>
                <p className="max-[500px]:text-xs text-[0.9rem]">
                  <strong>{cartData.length} items</strong> in your cart
                </p>
              </div>

              {/* PAYMENT SHEET */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="primary"
                    className="border-none hidden max-[1500px]:block max-[500px]:text-xs"
                  >
                    Proceed To Buy
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[90vw] md:w-[60vw]">
                  <SheetHeader>
                    <SheetTitle>
                      <div></div>
                    </SheetTitle>
                    <SheetDescription>
                      <div></div>
                    </SheetDescription>
                  </SheetHeader>
                  <div className="max-[500px]:h-[92vh] overflow-y-auto hidden-scrollbar h-full mx-auto rounded-lg shadow-md p-4 space-y-4">
                    {/* Address & Coupon Section */}
                    <div className="flex space-x-2 border-2 p-2 w-max rounded-lg mb-4">
                      <Button
                        variant={section === "address" ? "primary" : "outline"}
                        className="px-4 py-2"
                        onClick={() => setSection("address")}
                      >
                        Shipping Address
                      </Button>
                      <Button
                        variant={section === "coupon" ? "primary" : "outline"}
                        className="px-4 py-2"
                        onClick={() => setSection("coupon")}
                      >
                        Coupon Code
                      </Button>
                    </div>

                    {/* Address Section */}
                    {section === "address" ? (
                      <div className="flex flex-col gap-4 h-72">
                        <h3 className="text-lg font-medium">
                          Shipping Address
                        </h3>
                        <div className="flex flex-col gap-4">
                          <Textarea
                            className="resize-none"
                            placeholder="Enter address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                          />
                          <Select onValueChange={(value) => setState(value)}>
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={state || "Select state"}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Indian States</SelectLabel>
                                {statesArray.map((state) => (
                                  <SelectItem key={state} value={state}>
                                    {state}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <div className="flex gap-3">
                            <Input
                              placeholder="City"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                            />
                            <Input
                              type="number"
                              placeholder="Pincode"
                              value={pincode}
                              onChange={(e) => setPincode(e.target.value)}
                            />
                          </div>
                          <Button
                            variant="primary"
                            onClick={updateAddress}
                            disabled={updatingAddress}
                          >
                            Update Address
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* Coupon Section */
                      <div className="flex flex-col gap-4 h-72">
                        <h3 className="text-lg font-medium mt-2">
                          Coupon Code
                        </h3>
                        <p className="text-sm">
                          Save big with exclusive coupons! Grab the latest deals
                          and discounts on your favorite products now.
                        </p>
                        <Input
                          placeholder="Coupon code"
                          value={coupon}
                          onChange={(e) => setCoupon(e.target.value)}
                        />
                        <Button variant="primary" onClick={checkCoupon}>
                          Apply
                        </Button>
                      </div>
                    )}

                    {/* Payment Summary */}
                    <div className="flex flex-col w-[95%] mx-auto bg-orange-500 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold">Card Total</h3>
                      <div className="flex flex-col gap-1 my-4">
                        <div className="flex justify-between">
                          <h3>Card Total</h3>
                          <p>{getTotalPrice(cartData)} /-</p>
                        </div>
                        <div className="flex justify-between">
                          <h3>Shipping</h3>
                          <p>
                            {getShippingPrice(cartData) === "Free"
                              ? getShippingPrice(cartData)
                              : getShippingPrice(cartData) + " /-"}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <h3>Tax & Charges</h3>
                          <p>{getTaxPrice(cartData)} /-</p>
                        </div>
                        <div className="flex justify-between">
                          <h3>Discount</h3>
                          <p>{getCurrency(discountPrice)} /-</p>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                          <h3>Total</h3>
                          <p>
                            {getGrandTotalPrice(cartData, discountPrice)} /-
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={checkout}
                        disabled={isCheckingOut}
                        variant={"primary"}
                      >
                        Checkout
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {cartData && cartData.length === 0 ? (
              <div className="w-full h-[20vh] flex justify-center items-center">
                Your cart is empty
              </div>
            ) : (
              <div className="cart-box">
                {/* <div className="cart-headings">
                  <h4>Product</h4>
                  <h4 className="pl-2">Price</h4>
                  <h4 className="pl-2">Quantity</h4>
                  <h4 className="pl-2">Total</h4>
                </div> */}
                <div className="cart-items-box hidden-scrollbar">
                  {cartData &&
                    cartData.length > 0 &&
                    cartData.map((item) => (
                      <CartProductCard key={item._id} cartItem={item} />
                      // <CartItems key={item._id} cartItem={item}/>
                    ))}
                </div>
              </div>
            )}
          </div>
          <div className="payment-box">
            <div className="flex space-x-2 border-2 p-2 w-max rounded-[8px] mb-4">
              <Button
                variant={section === "address" ? "primary" : "outline"}
                className="px-4 py-2"
                onClick={() => setSection("address")}
              >
                Shipping Address
              </Button>
              <Button
                variant={section === "coupon" ? "primary" : "outline"}
                className="px-4 py-2"
                onClick={() => setSection("coupon")}
              >
                Coupon Code
              </Button>
            </div>
            {section === "address" ? (
              <div className="address-box">
                <h3>Shipping Address</h3>
                <div className="address-details">
                  <Textarea
                    className="resize-none"
                    placeholder="Enter address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <Select onValueChange={(value) => setState(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={state || "Select state"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Indian States</SelectLabel>
                        {statesArray.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-3">
                    <Input
                      placeholder="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                    />
                  </div>
                  <Button
                    variant="primary"
                    onClick={updateAddress}
                    disabled={updatingAddress}
                  >
                    Update Address
                  </Button>
                </div>
              </div>
            ) : (
              <div className="coupon-box">
                <h3>Coupon Code</h3>
                <p>
                  Save big with exclusive coupons! Grab the latest deals and
                  discounts on your favorite products now.
                </p>
                <Input
                  placeholder="Coupon code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                />
                <Button variant="primary" onClick={checkCoupon}>
                  Apply
                </Button>
              </div>
            )}

            <div className="payment">
              <h3>Card Total</h3>
              <div className="card-details">
                <div className="detail-row">
                  <h3>Card Total</h3>
                  <p>{getTotalPrice(cartData)} /-</p>
                </div>
                <div className="detail-row">
                  <h3>Shipping</h3>
                  <p>
                    {getShippingPrice(cartData) === "Free"
                      ? getShippingPrice(cartData)
                      : getShippingPrice(cartData) + " /-"}
                  </p>
                </div>
                <div className="detail-row">
                  <h3>Taxs & Charges</h3>
                  <p>{getTaxPrice(cartData)} /-</p>
                </div>
                <div className="detail-row">
                  <h3>Discount</h3>
                  <p>{getCurrency(discountPrice)} /-</p>
                </div>
                <div className="detail-row">
                  <h3 className="font-bold text-[1.1rem]">Total</h3>
                  <p className="font-bold text-[1.1rem]">
                    {getGrandTotalPrice(cartData, discountPrice)} /-
                  </p>
                </div>
              </div>
              <Button onClick={checkout} disabled={isCheckingOut}>
                Checkout
              </Button>
            </div>
          </div>
        </>
      ) : (
        <EmptyCart />
      )}
    </div>
  );
};

export default CartPage;
