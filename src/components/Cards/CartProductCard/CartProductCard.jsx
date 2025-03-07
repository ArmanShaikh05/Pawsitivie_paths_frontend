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

const CartProductCard = ({ cartItem }) => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userDetailReducer.userData);
  const [increasingQty, setIncreasingQty] = useState(false);
  const [decreasingQty, setDecreasingQty] = useState(false);
  const [removingItem, setRemovingItem] = useState(false);

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

  return (
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
                Pet Type <span>:</span>
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
        {getCurrency(cartItem.productId.productPrice)} /-
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
  );
};

export default CartProductCard;
