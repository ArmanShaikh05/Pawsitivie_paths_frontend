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
import {
  DISLIKE_SHOP,
  GET_SHOP_DETAILS_BY_USERID,
  LIKE_SHOP,
  POST_SHOP_REVIEW,
} from "@/constants/routes";
import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "./shoppage.scss";
import { useToast } from "@/hooks/use-toast";
import { setUserDetails } from "@/redux/reducers/userDetailsSlice";
import { useGlobalVariables } from "@/utils/useContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ShopPage = () => {
  const { shopId } = useParams();
  const userData = useSelector((state) => state.userDetailReducer.userData);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  const { toast } = useToast();
  const [liked, setLiked] = useState(false);
  const { favouriteShopsForceUpdate } = useGlobalVariables();
  const dispatch = useDispatch();

  const [mainImage, setMainImage] = useState("");
  const fallbackText = data?.shopName
    ?.split(" ")
    .map((name) => name[0])
    .join("");
  const [isCopied, setIsCopied] = useState(false);
  const textToCopy = window.location.href;

  const [openDialog, setDialogOpen] = useState(false);
  const [rating, setRating] = useState();
  const [review, setReview] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewDesc, setReviewDesc] = useState("");
  const [isPostingReview, setIsPostingReview] = useState(false);

  const [reviewsData, setReviewsData] = useState();

  const [overallReview, setOverallReview] = useState("")

  useEffect(() => {
    setLoading(true);
    const cancelToken = axios.CancelToken.source();
    axios
      .get(`${GET_SHOP_DETAILS_BY_USERID}?shopId=${shopId}`, {
        cancelToken: cancelToken.token,
      })
      .then(({ data }) => {
        setData(data.data);
        setReviewsData(data.data?.reviews);
        setOverallReview(data?.overallReview)
        setLoading(false);
        setLiked(
          userData?.whishlistShops.includes(data.data?._id) ? true : false
        );
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [shopId, reducerValue]);

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
        favouriteShopsForceUpdate();
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
        favouriteShopsForceUpdate();
        toast({
          title: "Shop removed from whishlist",
        });
      }
    } catch (error) {
      if (axios.isCancel(error)) return;
    }
  };

  const postReview = async () => {
    if (!rating) {
      return toast({
        title: "Please select a rating",
        variant: "destructive",
      });
    } else if (reviewTitle === "") {
      return toast({
        title: "Please enter a review title",
        variant: "destructive",
      });
    } else if (reviewDesc === "") {
      return toast({
        title: "Please enter a review description",
        variant: "destructive",
      });
    } else {
      const reviewData = {
        userId: userData?._id,
        shopOwnerId: data?._id,
        rating,
        reviewTitle,
        reviewDesc,
        review,
      };
      const cancelToken = axios.CancelToken.source();
      try {
        setIsPostingReview(true);
        const response = await axios.post(POST_SHOP_REVIEW, reviewData, {
          cancelToken: cancelToken.token,
        });
        if (response.status === 200) {
          setDialogOpen(false);
          toast({
            title: "Review posted successfully",
          });
          setReview("");
          setReviewTitle("");
          setReviewDesc("");
          setRating();
          forceUpdate();
        }
      } catch (error) {
        if (axios.isCancel(error)) return;
        console.log(error);
      } finally {
        setIsPostingReview(false);
      }
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
              <Button
                variant="primary"
                className="h-[3rem]"
                onClick={() => setDialogOpen(true)}
              >
                Post Review
              </Button>
              {openDialog && (
                <Dialog open={openDialog} onOpenChange={setDialogOpen}>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Write your review</DialogTitle>
                      <DialogDescription>
                        Your review will be shown to other users, so make sure
                        to use appropriate words..
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="rating">Rating</Label>
                        <Select
                          id="rating"
                          onValueChange={(value) => {
                            setRating(value);
                            if (value === 1) {
                              return setReview("Very Bad");
                            } else if (value === 2) {
                              return setReview("Bad");
                            } else if (value === 3) {
                              return setReview("Good");
                            } else if (value === 4) {
                              return setReview("Very Good");
                            } else {
                              return setReview("Excellent");
                            }
                          }}
                        >
                          <SelectTrigger className="w-[250px]">
                            <SelectValue placeholder="Ratings" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Very Bad</SelectItem>
                            <SelectItem value="2">Bad</SelectItem>
                            <SelectItem value="3">Good</SelectItem>
                            <SelectItem value="4">Very Good</SelectItem>
                            <SelectItem value="5">Excellent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          placeholder="Review"
                          className="col-span-3"
                          value={reviewTitle}
                          onChange={(e) => setReviewTitle(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="description"
                          className="text-right self-start"
                        >
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          placeholder="Describe your review"
                          className="col-span-3"
                          value={reviewDesc}
                          onChange={(e) => setReviewDesc(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        variant="primary"
                        onClick={postReview}
                        disabled={isPostingReview}
                      >
                        Post Review
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>

        <div className="pet-details-section">
          <p className="username text-sm">{`#${data?.userId}`}</p>
          <h2>{data?.shopName}</h2>

          <Badge className="rating-badge" variant="default">
            {overallReview} / 5
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

      {data?.shopPets?.length > 0 && (
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
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/4"
                  >
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

      {reviewsData?.length > 0 && (
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
                {reviewsData.map((review, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/4"
                  >
                    <ShopTestimonial reviewData={review} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
