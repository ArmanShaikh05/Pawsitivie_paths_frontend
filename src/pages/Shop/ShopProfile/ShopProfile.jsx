import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AiFillEdit } from "react-icons/ai";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { GET_SHOP_DETAILS } from "@/constants/routes";
import { useAuth, useGlobalVariables } from "@/utils/useContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./shopprofile.scss";
import Loader from "@/components/Loader/Loader";

const ShopProfile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState();
  const { reducerValue } = useGlobalVariables();
  const fallbackText = userData?.userName
    .split(" ")
    .map((name) => name[0])
    .join("");
  const [carousalImages, setCarousalImages] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const cancelToken = axios.CancelToken.source();
    axios
      .get(`${GET_SHOP_DETAILS}/${currentUser.uid}`, {
        cancelToken: cancelToken.token,
      })
      .then(({ data }) => {
        setUserData(data.data);
        console.log(data.data)
        setCarousalImages(data.data?.shopImages);
        setMainImage(data.data?.shopImages[0].url);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return setLoading(false);
        console.log(err);
        setLoading(false);
      });
  }, [currentUser.uid, reducerValue]);

  return loading ? (
    <Loader />
  ) : (
    <div className="shop-page hidden-scrollbar">
      <div className="single-shop-container">
        <div className="shop-images-section">
          <Avatar className="full-size-image">
            <AvatarImage className="object-cover" src={mainImage} />
            <AvatarFallback className="text-black text-[5rem]">
              {fallbackText}
            </AvatarFallback>
          </Avatar>

          {carousalImages && carousalImages.length > 0 && (
            <div className="image-carousels">
              <Carousel
                opts={{
                  align: "start",
                }}
                className="w-full object-cover"
              >
                <CarouselContent>
                  {carousalImages.map((img, index) => (
                    <CarouselItem
                      key={index}
                      className="md:basis-1/2 lg:basis-1/4 "
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
        </div>

        <div className="pet-details-section">
          <p className="username text-sm">{`#${userData?.userId}`}</p>
          <h2>{userData?.shopName}</h2>

          <Button
            className="rating-badge self-end gap-2"
            variant="primary"
            onClick={() => navigate("edit")}
          >
            <AiFillEdit />
            Edit Shop
          </Button>

          {userData?.shopDescription && userData?.shopDescription !== "" && (
            <div className="about-row">
              <Badge className="detail-badge" variant="default">
                About Shop
              </Badge>
              <p>{userData?.shopDescription}</p>
            </div>
          )}

          {userData?.shopAddress && userData?.shopAddress !== "" && (
            <div className="details-row">
              <p>
                Address <span>:</span>{" "}
              </p>
              <p>{userData?.shopAddress}</p>
            </div>
          )}

          {userData?.shopEmail && (
            <div className="details-row">
              <p>
                Email <span>:</span>{" "}
              </p>
              <p>{userData?.shopEmail}</p>
            </div>
          )}

          {userData?.phone && (
            <div className="details-row">
              <p>
                Contact No <span>:</span>{" "}
              </p>
              <p>{userData?.phone}</p>
            </div>
          )}

          {userData?.shopTimmings &&
            userData?.shopTimmings?.weekdays?.open &&
            userData?.shopTimmings?.weekdays?.open !== "" &&
            userData?.shopTimmings?.weekdays?.close &&
            userData?.shopTimmings?.weekdays?.close !== "" &&
            userData?.shopTimmings?.weekend?.open &&
            userData?.shopTimmings?.weekend?.open !== "" &&
            userData?.shopTimmings?.weekend?.close &&
            userData?.shopTimmings?.weekend?.close !== "" &&
            userData?.shopTimmings?.sundayClosed && (
              <div className="details-row">
                <p>
                  Timmings <span>:</span>{" "}
                </p>
                <p>
                  {`Weekdays ( ${userData?.shopTimmings?.weekdays?.open} to ${userData?.shopTimmings?.weekdays?.close}) `}
                  <br />{" "}
                  {`Weekends ( ${userData?.shopTimmings?.weekend?.open} to ${userData?.shopTimmings?.weekend?.open} )`}
                  <br />{" "}
                  {`${
                    userData?.shopTimmings?.sundayClosed
                      ? "Sunday Closed"
                      : "Sunday Open"
                  }`}
                </p>
              </div>
            )}

          {userData?.tags && userData?.tags?.length > 0 && (
            <div className="details-row">
              <p>
                Tags <span>:</span>{" "}
              </p>
              <div className="w-full flex flex-wrap gap-4">
                {userData?.tags?.map((tag, index) => (
                  <Badge key={index}>{tag}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopProfile;
