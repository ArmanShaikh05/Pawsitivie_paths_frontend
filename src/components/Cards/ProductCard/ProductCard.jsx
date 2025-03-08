/* eslint-disable react/prop-types */
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DISLIKE_PRODUCT, LIKE_PRODUCT } from "@/constants/routes";
import { useToast } from "@/hooks/use-toast";
import { setUserDetails } from "@/redux/reducers/userDetailsSlice";
import axios from "axios";
import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ path = "", productData, forceUpdate }) => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.userDetailReducer.userData);
  const [liked, setLiked] = useState(
    userData?.whishlistProducts.includes(productData?._id) ? true : false
  );
  const dispatch = useDispatch();
  const { toast } = useToast();

  const addProductToWhishlist = async () => {
    try {
      const cancelToken = axios.CancelToken.source();
      const { data } = await axios.get(
        `${LIKE_PRODUCT}?userId=${userData?._id}&productId=${productData?._id}`,
        {
          cancelToken: cancelToken.token,
        }
      );
      if (data) {
        dispatch(setUserDetails(data.data));
        setLiked(true);
        forceUpdate();
        toast({
          title: "Pet added to whishlist",
        });
      }
    } catch (error) {
      if (axios.isCancel(error)) return;
    }
  };

  const removeProductFromWhishlist = async () => {
    try {
      const cancelToken = axios.CancelToken.source();
      const { data } = await axios.get(
        `${DISLIKE_PRODUCT}?userId=${userData?._id}&productId=${productData?._id}`,
        {
          cancelToken: cancelToken.token,
        }
      );
      if (data) {
        dispatch(setUserDetails(data.data));
        setLiked(false);
        forceUpdate();
        toast({
          title: "Pet removed from whishlist",
        });
      }
    } catch (error) {
      if (axios.isCancel(error)) return;
    }
  };

  return (
    <Card className="cursor-pointer relative z-[4]">
      <CardHeader>
        <CardTitle>{productData?.productName}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <img
          className="w-[8rem] h-[11rem] object-cover"
          src={productData?.productImages[0]?.url}
          alt=""
          onClick={() => navigate(path)}
        />
        <p className="mt-5 text-sm text-left w-full clamp-text h-[5rem]">
          {productData?.productDescription}
        </p>
        {liked ? (
          <FaHeart
            onClick={removeProductFromWhishlist}
            size={22}
            color="red"
            className="absolute top-[15px] right-[20px] z-[50]"
          />
        ) : (
          <FaRegHeart
            onClick={addProductToWhishlist}
            size={22}
            className="absolute top-[15px] right-[20px] z-[50]"
          />
        )}
      </CardContent>
      <CardFooter>
        <h3 className="font-bold">
          {Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
          }).format(productData?.productPrice)}{" "}
          /-
        </h3>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
