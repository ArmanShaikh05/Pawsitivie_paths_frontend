/* eslint-disable react/prop-types */
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
    FaHeart,
    FaRegHeart
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import { DISLIKE_PET, LIKE_PET } from "@/constants/routes";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "@/redux/reducers/userDetailsSlice";

const PetCard = ({path="",petData,forceUpdate}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userData = useSelector(state => state.userDetailReducer.userData)
    const [liked, setLiked] = useState(userData?.whishlistPets.includes(petData?._id) ? true : false);
    const {toast} = useToast()

    const addPetToWhishlist = async() => {
      try {
        const cancelToken = axios.CancelToken.source()
        const {data} = await axios.get(`${LIKE_PET}?userId=${userData?._id}&petId=${petData?._id}`,{
          cancelToken:cancelToken.token
        })
        if(data){
          dispatch(setUserDetails(data.data))
          setLiked(true)
          forceUpdate()
          toast({
            title:"Pet added to whishlist"
          })
        }
      } catch (error) {
        if(axios.isCancel(error)) return
      }
    }

    const removePetFromWhishlist = async() => {
      try {
        const cancelToken = axios.CancelToken.source()
        const {data} = await axios.get(`${DISLIKE_PET}?userId=${userData?._id}&petId=${petData?._id}`,{
          cancelToken:cancelToken.token
        })
        if(data){
          dispatch(setUserDetails(data.data))
          setLiked(false)
          forceUpdate()
          toast({
            title:"Pet removed from whishlist"
          })
        }
      } catch (error) {
        if(axios.isCancel(error)) return
      }
    }

  return (
    <Card className="cursor-pointer relative z-[4] " >
      <CardHeader>
        <CardTitle>{petData?.petName}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <img className="h-[8rem] w-[9rem] md:h-[12rem] md:w-[15rem] object-cover" src={petData?.petImages[0]?.url} alt="" onClick={()=>navigate(path)}/>
        <p className="mt-5 text-sm">{`Gen: ${petData?.petGender} | Age: ${petData?.petAge} years`}</p>
        {liked ? (
            <FaHeart onClick={removePetFromWhishlist} size={22} color="red" className="absolute top-[15px] right-[20px] z-[50]" />
          ) : (
            <FaRegHeart onClick={addPetToWhishlist} size={22} className="absolute top-[15px] right-[20px] z-[50]"/>
          )}
      </CardContent>
      <CardFooter>
        <h3 className="font-bold">{petData?.petPrice} /-</h3>
      </CardFooter>
    </Card>
  );
};

export default PetCard;
