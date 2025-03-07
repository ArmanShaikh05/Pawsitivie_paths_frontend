import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  FaFacebook,
  FaHeart,
  FaInstagram,
  FaLink,
  FaRegHeart,
  FaShareAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import PetCard from "@/components/Cards/PetCard/PetCard";
// import ProductCard from "@/components/Cards/ProductCard/ProductCard";
import Loader from "@/components/Loader/Loader";
import ShopTestimonial from "@/components/ShopTestimonial/ShopTestimonial";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DISLIKE_SHOP, GET_SHOP_DETAILS_BY_USERID, LIKE_SHOP } from "@/constants/routes";
import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "./shoppage.scss";
import { useToast } from "@/hooks/use-toast";
import { setUserDetails } from "@/redux/reducers/userDetailsSlice";
import { useGlobalVariables } from "@/utils/useContext";

const ShopPage = () => {
  const { shopId } = useParams();
  const userData = useSelector((state) => state.userDetailReducer.userData);
  const [data,setData] = useState()
  const [loading,setLoading] = useState(false)
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  const {toast} = useToast()
  const [liked, setLiked] = useState(false);
  const {favouriteShopsForceUpdate} = useGlobalVariables()
  const dispatch = useDispatch()

  const [mainImage, setMainImage] = useState("");
  const fallbackText = data?.shopName
    ?.split(" ")
    .map((name) => name[0])
    .join("");
  const [isCopied, setIsCopied] = useState(false);
  const textToCopy = window.location.href

  useEffect(()=>{
    setLoading(true)
    const cancelToken = axios.CancelToken.source()
    axios.get(`${GET_SHOP_DETAILS_BY_USERID}?shopId=${shopId}`,{cancelToken:cancelToken.token}).then(({data})=>{
      setData(data.data)
      setLoading(false)
      setLiked(userData?.whishlistShops.includes(data.data?._id) ? true : false)
    }).catch((err)=>{
      console.log(err)
      setLoading(false)
    })
  },[shopId, reducerValue])

  

  const handleCopyClick = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const addShopToWhishlist = async () => {
    try {
      const cancelToken = axios.CancelToken.source();
      const { data: wishlistData } = await axios.get(
        `${LIKE_SHOP}?userId=${userData?._id}&shopId=${data?._id}`,
        {
          cancelToken: cancelToken.token,
        }
      );
      if (wishlistData) {
        dispatch(setUserDetails(wishlistData.data));
        setLiked(true);
        forceUpdate();
        favouriteShopsForceUpdate()
        toast({
          title: "Shop added to whishlist",
        });
      }
    } catch (error) {
      if (axios.isCancel(error)) return;
      console.log(error);
    }
  };
  
  const removeShopFromWhishlist = async () => {
    try {
      const cancelToken = axios.CancelToken.source();
      const { data: wishlistData } = await axios.get(
        `${DISLIKE_SHOP}?userId=${userData?._id}&shopId=${data?._id}`,
        {
          cancelToken: cancelToken.token,
        }
      );
      if (wishlistData) {
        dispatch(setUserDetails(wishlistData.data));
        setLiked(false);
        forceUpdate();
        favouriteShopsForceUpdate()
        toast({
          title: "Shop removed from whishlist",
        });
      }
    } catch (error) {
      if (axios.isCancel(error)) return;
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="shop-page hidden-scrollbar">
      <div className="single-shop-container">
        <div className="shop-images-section">
          <Avatar className="full-size-image">
            <AvatarImage
              className="object-cover"
              src={mainImage === "" ? data?.shopImages[0]?.url : mainImage}
            />
            <AvatarFallback className="text-black">
              {fallbackText}
            </AvatarFallback>
          </Avatar>

          {data?.shopImages.length > 0 && (
            <div className="image-carousels">
              <Carousel
                opts={{
                  align: "start",
                }}
                className="w-full"
              >
                <CarouselContent>
                  {data?.shopImages?.map((img, index) => (
                    <CarouselItem
                      key={index}
                      className="md:basis-1/2 lg:basis-1/4"
                      onClick={() => setMainImage(img.url)}
                    >
                      <div className="p-1 cursor-pointer">
                        <img
                          className="h-[6rem] w-[7rem] object-cover"
                          src={img.url}
                          alt="Dog"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          )}

          {liked ? (
            <FaHeart onClick={removeShopFromWhishlist} size={28} color="red" />
          ) : (
            <FaRegHeart onClick={addShopToWhishlist} size={28} />
          )}

          <div className="share-footer">
            <div className="share-icon">
              <FaShareAlt size={20} />
              <p>Share:</p>
            </div>
            <div className="share-handles">
              <div className="flex gap-4 relative items-center">
                {data?.socialHandles?.facebook &&
                  data?.socialHandles?.facebook !== "" && (
                    <FaFacebook size={22} />
                  )}
                {data?.socialHandles?.instagram &&
                  data?.socialHandles?.instagram !== "" && (
                    <FaInstagram size={22} />
                  )}
                {data?.socialHandles?.twitter &&
                  data?.socialHandles?.twitter !== "" && (
                    <FaXTwitter size={22} />
                  )}
                {data?.socialHandles?.whatsapp &&
                  data?.socialHandles?.whatsapp !== "" && (
                    <FaWhatsapp size={22} />
                  )}
                <div className="tooltip-container" onClick={handleCopyClick}>
                  <FaLink size={22} />
                  {isCopied && <span className="tooltip">Copied!</span>}
                </div>
                
              </div>
              <Button variant="primary" className="self-end">
                Contact Shop
              </Button>
            </div>
          </div>
        </div>

        <div className="pet-details-section">
          <p className="username text-sm">{`#${data?.userId}`}</p>
          <h2>{data?.shopName}</h2>

          <Badge className="rating-badge" variant="default">
            3.8 / 5
          </Badge>

          {data?.shopDescription && data?.shopDescription !== "" && (
            <div className="about-row">
              <Badge className="detail-badge" variant="default">
                About Shop
              </Badge>
              <p>{data?.shopDescription}</p>
            </div>
          )}

          {data?.shopAddress && data?.shopAddress !== "" && (
            <div className="details-row">
              <p>
                Address <span>:</span>{" "}
              </p>
              <p>{data?.shopAddress}</p>
            </div>
          )}

          {data?.shopEmail && (
            <div className="details-row">
              <p>
                Email <span>:</span>{" "}
              </p>
              <p>{data?.shopEmail}</p>
            </div>
          )}

          {data?.phone && (
            <div className="details-row">
              <p>
                Contact No <span>:</span>{" "}
              </p>
              <p>{data?.phone}</p>
            </div>
          )}

          {data?.shopTimmings &&
            data?.shopTimmings?.weekdays?.open &&
            data?.shopTimmings?.weekdays?.open !== "" &&
            data?.shopTimmings?.weekdays?.close &&
            data?.shopTimmings?.weekdays?.close !== "" &&
            data?.shopTimmings?.weekend?.open &&
            data?.shopTimmings?.weekend?.open !== "" &&
            data?.shopTimmings?.weekend?.close &&
            data?.shopTimmings?.weekend?.close !== "" &&
            data?.shopTimmings?.sundayClosed && (
              <div className="details-row">
                <p>
                  Timmings <span>:</span>{" "}
                </p>
                <p>
                  {`Weekdays ( ${data?.shopTimmings?.weekdays?.open} to ${data?.shopTimmings?.weekdays?.close}) `}
                  <br />{" "}
                  {`Weekends ( ${data?.shopTimmings?.weekend?.open} to ${data?.shopTimmings?.weekend?.open} )`}
                  <br />{" "}
                  {`${
                    data?.shopTimmings?.sundayClosed
                      ? "Sunday Closed"
                      : "Sunday Open"
                  }`}
                </p>
              </div>
            )}

          {data?.tags && data?.tags?.length > 0 && (
            <div className="details-row">
              <p>
                Tags <span>:</span>{" "}
              </p>
              <div className="w-full flex flex-wrap gap-4">
                {data?.tags?.map((tag, index) => (
                  <Badge key={index}>{tag}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {(data?.shopPets?.length > 0) && (
        <div className="shop-pets">
        <h2>Shop Pets</h2>
        <div className="shop-carousels my-8">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent>
              {data?.shopPets?.map((item, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
                  <PetCard petData={item} path={`/pets/${item._id}`} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <Button className="view-all-badge" variant="primary">
          View All
        </Button>
      </div>
      )}

      {/* <div className="shop-pets">
        <h2>Pets Accessories</h2>
        <div className="shop-carousels mt-8 mb-8">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent>
              {Array.from({ length: 7 }).map((_, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
                  <ProductCard path="/market/sadsa" />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <Button className="view-all-badge" variant="primary">
          View All
        </Button>
      </div> */}

      <div className="shop-pets">
        <h2>Customer Reviews</h2>
        <div className="shop-carousels mt-8 mb-8">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent>
              {Array.from({ length: 7 }).map((_, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
                  <ShopTestimonial />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        {/* <Button className="view-all-badge" variant="primary">
          View All
        </Button> */}
      </div>
    </div>
  );
};

export default ShopPage;
