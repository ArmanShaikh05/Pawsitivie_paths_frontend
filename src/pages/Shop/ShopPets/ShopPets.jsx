import DailySalesTrend from "@/components/Charts/DailySalesTrend";
import SalesByCategoryChart from "@/components/Charts/SalesByCategoryChart";
import ShopPetsTable from "@/components/Tables/ShopPetsTable";
import { GET_SHOP_PET_DETAILS } from "@/constants/routes";
import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";

const ShopPets = () => {
  const userData = useSelector((state) => state.userDetailReducer.userData);
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);

  const [shopPetdata, setShopPetData] = useState([]);

  useEffect(() => {
    try {
      const cancelToken = axios.CancelToken.source();
      axios
        .get(`${GET_SHOP_PET_DETAILS}/${userData?._id}`, {
          cancelToken: cancelToken.token,
        })
        .then(({ data }) => {
          if (data.data && data.data.shopPets) {
            const formattedPets = data.data.shopPets.map((pet, index) => ({
              id: index + 1,
              petImg:
                pet.petImages && pet.petImages.length > 0
                  ? pet.petImages[0].url
                  : null,
              petName: pet.petName || "Unknown", // Fallback for pet name
              category: pet.petCategory || "Unknown", // Fallback for category
              petAge: pet.petAge ? `${pet.petAge} year` : "Unknown", // Fallback for age
              price: pet.petPrice || 0, // Fallback for price
              petId: pet._id ? pet._id : null,
            }));

            setShopPetData(formattedPets);
          }
        });
    } catch (error) {
      if (axios.isCancel(error)) return;
      console.log(error);
    }
  }, [reducerValue]);


  return (
    <main className=" py-6 px-4 lg:px-8 h-[calc(100vh - 4rem)] overflow-scroll hidden-scrollbar">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
        <SalesByCategoryChart />
        <DailySalesTrend />
      </div>
      <ShopPetsTable forceUpdate={forceUpdate} ShopPetData={shopPetdata} />
    </main>
  );
};

export default ShopPets;
