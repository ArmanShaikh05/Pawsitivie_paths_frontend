/* eslint-disable react/prop-types */
import moment from "moment";
import { createContext, useReducer, useState } from "react";

export const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  const [favouritePetsReducerValue, favouritePetsForceUpdate] = useReducer(
    (x) => x + 1,
    0
  );
  const [favouritePetsData, setFavouritePetData] = useState([]);

  const [favouriteShopsReducerValue, favouriteShopsForceUpdate] = useReducer(
    (x) => x + 1,
    0
  );
  const [favouriteShopsData, setFavouriteShopsData] = useState([]);

  const [productCategoryData, setProductCategoryData] = useState({});
  const [petCategoryData, setPetCategoryData] = useState({});
  const [yearlyPetAdoptedData, setYearlyPetAdoptedData] = useState([]);
  const [monthlyPetAdoptedData, setMonthlyPetAdoptedData] = useState([]);
  const [weeklyPetAdoptedData, setWeeklyPetAdoptedData] = useState([]);
  const [shopChartReducerValue, shopChartForceUpdate] = useReducer(
    (x) => x + 1,
    0
  );
  const [dateRange, setDateRange] = useState({
    from: new Date(2025, 0, 1),
    to: moment(new Date()).add(100, "days").toDate(),
  });
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [fetchPostreducer, forceUpdateFetchPost] = useReducer((x) => x + 1, 0);
  const [friendRequestCount, setFriendRequestCount] = useState(0);

  const [upadetePasswordEmail, setUpdatePasswordEmail] = useState("");

  return (
    <GlobalContext.Provider
      value={{
        reducerValue,
        forceUpdate,
        favouritePetsReducerValue,
        favouritePetsForceUpdate,
        favouritePetsData,
        setFavouritePetData,
        favouriteShopsReducerValue,
        favouriteShopsForceUpdate,
        favouriteShopsData,
        setFavouriteShopsData,
        productCategoryData,
        setProductCategoryData,
        petCategoryData,
        setPetCategoryData,
        shopChartReducerValue,
        shopChartForceUpdate,
        dateRange,
        setDateRange,
        userFirstName,
        setUserFirstName,
        userLastName,
        setUserLastName,
        yearlyPetAdoptedData,
        setYearlyPetAdoptedData,
        monthlyPetAdoptedData,
        setMonthlyPetAdoptedData,
        weeklyPetAdoptedData,
        setWeeklyPetAdoptedData,
        fetchPostreducer,
        forceUpdateFetchPost,
        friendRequestCount,
        setFriendRequestCount,
        upadetePasswordEmail,
        setUpdatePasswordEmail,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
