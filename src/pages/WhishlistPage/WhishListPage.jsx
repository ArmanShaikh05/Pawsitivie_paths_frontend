import "./whishlistpage.scss";
import { Button } from "@/components/ui/button";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGlobalVariables } from "@/utils/useContext";
import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import {
  GET_WHISHLIST_PET_DETAILS,
  GET_WHISHLIST_PRODUCT_DETAILS,
  GET_WHISHLIST_SHOP_DETAILS,
} from "@/constants/routes";

const WhishListPage = () => {
  const path = window.location.pathname.split("/")[2];
  const navigate = useNavigate();

  const userId = useSelector((state) => state.userDetailReducer.userData._id);
  const {
    setFavouritePetData,
    favouritePetsReducerValue,
    favouriteShopsReducerValue,
    setFavouriteShopsData,
  } = useGlobalVariables();

  const [favouriteProductReducerValue, forceUpdateFavouriteProduct] =
    useReducer((x) => x + 1, 0);

  const [favouriteProductsData, setFavouriteProductsData] = useState([])

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();

    axios
      .get(`${GET_WHISHLIST_PET_DETAILS}?userId=${userId}`, {
        cancelToken: cancelToken.token,
      })
      .then(({ data }) => {
        const FavouritePetTableData = [];
        data.data?.whishlistPets?.forEach((pet, index) => {
          FavouritePetTableData.push({
            id: index + 1,
            petImg: pet?.petImages[0]?.url || null,
            petName: pet?.petName || "",
            petAge: pet?.petAge ? `${pet?.petAge} year` : "",
            price: pet?.petPrice || 0,
            petId: pet?._id || "",
          });
          setFavouritePetData(FavouritePetTableData);
        });
      })
      .catch((err) => {
        console.log(err);
      });

    // Cleanup the axios request in case the component unmounts before completion
    return () => cancelToken.cancel();

    // Empty dependency array to avoid infinite re-fetch
  }, [favouritePetsReducerValue]);

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();

    axios
      .get(`${GET_WHISHLIST_SHOP_DETAILS}?userId=${userId}`, {
        cancelToken: cancelToken.token,
      })
      .then(({ data }) => {
        const FavouriteShopTableData = [];
        data.data?.whishlistShops?.forEach((shop, index) => {
          FavouriteShopTableData.push({
            id: index + 1,
            shopImg: shop?.shopImages[0]?.url || null,
            shopName: shop?.shopName || "",
            email: shop?.shopEmail || "",
            contactNo: shop?.phone || 0,
            shopId: shop?._id || "",
            rating: "3.8 / 5",
          });
          setFavouriteShopsData(FavouriteShopTableData);
        });
      })
      .catch((err) => {
        console.log(err);
      });

    // Cleanup the axios request in case the component unmounts before completion
    return () => cancelToken.cancel();

    // Empty dependency array to avoid infinite re-fetch
  }, [favouriteShopsReducerValue]);

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();

    axios
      .get(`${GET_WHISHLIST_PRODUCT_DETAILS}?userId=${userId}`, {
        cancelToken: cancelToken.token,
      })
      .then(({ data }) => {
        const FavouriteProductTableData = [];
        data.data?.whishlistProducts?.forEach((product, index) => {
          FavouriteProductTableData.push({
            id: index + 1,
            productImage: product?.productImages[0]?.url || null,
            productName: product?.productName || "",
            shopName: product?.shopName || "",
            category: product?.productCategory || "",
            price: product?.productPrice || 0,
            productId: product?._id || "",
            rating: "3.8 / 5",
          });
          setFavouriteProductsData(FavouriteProductTableData);
        });
      })
      .catch((err) => {
        console.log(err);
      });

    // Empty dependency array to avoid infinite re-fetch
  }, [favouriteProductReducerValue]);

  return (
    <div className="whishlist-page">
      <div className="flex space-x-2 border-2 p-2 w-max rounded-[8px] mb-4">
        <Button
          variant={path === "pets" ? "primary" : "outline"}
          className="px-4 py-2"
          onClick={() => {
            navigate("pets");
          }}
        >
          Favourite Pets
        </Button>
        <Button
          variant={path === "shops" ? "primary" : "outline"}
          className="px-4 py-2"
          onClick={() => {
            navigate("shops");
          }}
        >
          Favourite Shops
        </Button>
        <Button
          variant={path === "accessories" ? "primary" : "outline"}
          className="px-4 py-2"
          onClick={() => {
            navigate("accessories");
          }}
        >
          Liked Products
        </Button>
      </div>
      <div className="whishlist-tables">
        <Outlet
          context={{
            forceUpdateFavouriteProduct,
            favouriteProductsData,
          }}
        />
      </div>
    </div>
  );
};

export default WhishListPage;
