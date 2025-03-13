/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import { MdDelete } from "react-icons/md";
import "./cartproductcard.scss";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { getCurrency } from "@/utils/features";
import axios from "axios";
import { useState } from "react";
import { REMOVE_FROM_CART, UPDATING_CART_QUANTITY } from "@/constants/routes";
import { useDispatch, useSelector } from "react-redux";
import { setCartItems } from "@/redux/reducers/userDetailsSlice";
import useWindowSize from "@/hooks/useWindowSize";
import { Card } from "@/components/ui/card";
import { Minus, Plus } from "lucide-react";

const CartProductCard = ({ cartItem }) => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userDetailReducer.userData);
  const [increasingQty, setIncreasingQty] = useState(false);
  const [decreasingQty, setDecreasingQty] = useState(false);
  const [removingItem, setRemovingItem] = useState(false);

  const { width } = useWindowSize();

  const removeFromCart = async () => {
    try {
      setRemovingItem(true);
      const cancelToken = axios.CancelToken.source();
      const response = await axios.put(
        REMOVE_FROM_CART,
        {
          userId: userData?._id,
          productId: cartItem.productId._id,
        },
        {
          cancelToken: cancelToken.token,
        }
      );
      if (response.status === 200) {
        dispatch(setCartItems(response.data.data));
        toast({
          title: "Removed from cart",
        });
      }
    } catch (error) {
      if (axios.isCancel) return;
      console.log(error);
      toast({
        title: "Error in removing item",
        variant: "destructive",
      });
    } finally {
      setRemovingItem(false);
    }
  };

  const increaseQuantity = async () => {
    try {
      setIncreasingQty(true);
      const cancelToken = axios.CancelToken.source();
      const response = await axios.post(
        UPDATING_CART_QUANTITY,
        {
          userId: userData?._id,
          productId: cartItem.productId._id,
          size: cartItem.size,
          action: "increase",
        },
        { cancelToken: cancelToken.source }
      );

      if (response.status === 200) {
        dispatch(setCartItems(response.data.data));
      }
    } catch (error) {
      if (axios.isCancel) return;
      console.log(error);
      toast({
        title: "Error increasing quantity",
        variant: "destructive",
      });
    } finally {
      setIncreasingQty(false);
    }
  };

  const decreaseQuantity = async () => {
    try {
      setDecreasingQty(true);
      const cancelToken = axios.CancelToken.source();
      const response = await axios.post(
        UPDATING_CART_QUANTITY,
        {
          userId: userData?._id,
          productId: cartItem.productId._id,
          size: cartItem.size,
          action: "decrease",
        },
        { cancelToken: cancelToken.source }
      );

      if (response.status === 200) {
        dispatch(setCartItems(response.data.data));
      }
    } catch (error) {
      if (axios.isCancel) return;
      console.log(error);
      toast({
        title: "Error increasing quantity",
        variant: "destructive",
      });
    } finally {
      setDecreasingQty(false);
    }
  };

  return width > 700 ? (
    <div className="cart-item">
      <div className="product-area">
        <div className="product-image">
          <img
            src={cartItem.productId?.productImages?.[0]?.url}
            alt="product image"
          />
        </div>
        <div className="product-info">
          <div className="produtc-header">
            <p className="product-id">{cartItem.productId.shopName}</p>
            <h4 className="product-title">{cartItem.productId.productName}</h4>
          </div>
          <div className="product-footer">
            <div className="footer-box">
              <h3>
                Type <span>:</span>
              </h3>
              <p>{cartItem.productId.petType}</p>
            </div>
            {cartItem.size !== "null" && (
              <div className="footer-box">
                <h3>
                  Size <span>:</span>
                </h3>
                <p>{cartItem.size}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="price-area">
        <p>{getCurrency(cartItem.productId.productPrice)} /-</p>
      </div>
      <div className="quantity-area">
        <Button
          variant="primary"
          className="w-[2rem] h-[2rem]"
          onClick={decreaseQuantity}
          disabled={decreasingQty}
        >
          -
        </Button>

        <p>{cartItem.quantity}</p>

        <Button
          className="w-[2rem] h-[2rem]"
          variant="primary"
          onClick={increaseQuantity}
          disabled={increasingQty}
        >
          +
        </Button>
      </div>
      <div className="total-area">
        {getCurrency(cartItem.quantity * cartItem.productId.productPrice)} /-
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            className="w-[2rem] h-[2rem] p-0 flex justify-center items-center"
          >
            <MdDelete size={19} />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will remove the product from
              your cart.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={removeFromCart} disabled={removingItem}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  ) : (
    <Card className="p-4 shadow-md rounded-lg bg-white w-full my-4">
      <div className="flex w-full items-center gap-4 flex-col">
        <div className="flex items-center w-full gap-4">
          <img
            src={cartItem.productId?.productImages?.[0]?.url}
            alt={cartItem.productId.productName}
            className="w-24 h-24 object-cover rounded-md"
          />
          <div className="flex flex-col w-full justify-between h-full">
            <div className="flex flex-col w-full">
              <h3 className="text-[1rem] font-semibold text-gray-900">
                {cartItem.productId.productName}
              </h3>
              <p className="text-sm text-gray-500">
                {cartItem.productId.shopName}
              </p>
              <p className="text-sm text-gray-500">
                Type: {cartItem.productId.petType}
              </p>
              {cartItem.size !== "null" && (
                <p className="text-sm text-gray-500">Size: {cartItem.size}</p>
              )}
            </div>
            <p className="text-[0.9rem] font-bold text-gray-900 mt-2">
              {getCurrency(cartItem.quantity * cartItem.productId.productPrice)}{" "}
              /-
            </p>
          </div>
        </div>
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-2 items-center bg-gray-100 px-3 py-2 rounded-lg">
            <Button
              variant="primary"
              size="icon"
              onClick={() => decreaseQuantity()}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium text-gray-900 mx-2">
              {cartItem.quantity}
            </span>
            <Button
              variant="primary"
              size="icon"
              onClick={() => increaseQuantity()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-[2rem] h-[2rem] p-0 flex justify-center items-center"
              >
                <MdDelete size={19} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will remove the product
                  from your cart.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={removeFromCart}
                  disabled={removingItem}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Card>
  );
};

export default CartProductCard;
