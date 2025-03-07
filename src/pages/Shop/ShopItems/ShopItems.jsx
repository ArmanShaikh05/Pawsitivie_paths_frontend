import CategoryDistributionChart from "@/components/Charts/CategoryDistributionChart";
import SalesTrendChart from "@/components/Charts/SalesTrendChart";
import ShopProductsTable from "@/components/Tables/ShopProductsTable";
import { GET_SHOP_PRODUCTS_DETAILS } from "@/constants/routes";
import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";

const ShopItems = () => {
  const userData = useSelector((state) => state.userDetailReducer.userData);
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);

  const [shopProductData, setShopProductData] = useState([]);
  useEffect(() => {
    try {
      const cancelToken = axios.CancelToken.source();
      axios
        .get(`${GET_SHOP_PRODUCTS_DETAILS}/${userData?._id}`, {
          cancelToken: cancelToken.token,
        })
        .then(({ data }) => {
          if (data.data && data.data.shopProducts) {
            const formattedPets = data.data.shopProducts.map(
              (product, index) => ({
                id: index + 1,
                productImg:
                  product.productImages && product.productImages.length > 0
                    ? product.productImages[0].url
                    : null,
                productName: product.productName || "Unknown", // Fallback for pet name
                productCategory: product.productCategory || "Unknown", // Fallback for category
                price: product.productPrice || 0, // Fallback for price
                stock: product.productQuantity || 0, // Fallback for age
                productId: product._id ? product._id : null,
              })
            );

            setShopProductData(formattedPets);
          }
        });
    } catch (error) {
      if (axios.isCancel(error)) return;
      console.log(error);
    }
  }, [reducerValue]);
  return (
    <main className=" py-6 px-4 lg:px-8 h-[calc(100vh - 4rem)] overflow-scroll hidden-scrollbar">
      <div className="grid grid-col-1 lg:grid-cols-2 gap-8 mb-8">
        <SalesTrendChart />
        <CategoryDistributionChart />
      </div>
      <ShopProductsTable
        forceUpdate={forceUpdate}
        ShopProductData={shopProductData}
      />
    </main>
  );
};

export default ShopItems;
