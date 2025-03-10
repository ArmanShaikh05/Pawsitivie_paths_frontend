import Loader from "@/components/Loader/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ADD_TO_CART,
  GET_PRODUCTS_DATA,
  POST_PRODUCT_REVIEW,
} from "@/constants/routes";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import moment from "moment";
import { useEffect, useReducer, useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "./productpage.scss";
import { setCartItems } from "@/redux/reducers/userDetailsSlice";

const ProductPage = () => {
  const [openDialog, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [data, setData] = useState();
  const userData = useSelector((state) => state.userDetailReducer.userData);
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  const [loading, setLoading] = useState(false);

  const [mainImage, setMainImage] = useState(data?.productImages[0]?.url);

  // REVIEW STATES
  const [rating, setRating] = useState();
  const [review, setReview] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewDesc, setReviewDesc] = useState("");
  const [isPostingReview, setIsPostingReview] = useState(false);
  const [productReviewData, setProductReviewData] = useState([]);
  const [productReviewsRating, setProductReviewsRating] = useState();

  // CART STATES
  const [quantity, setQuantity] = useState(0);
  const [size, setSize] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  // STATES END HERE

  useEffect(() => {
    setLoading(true);
    const cancelToken = axios.CancelToken.source();
    axios
      .get(`${GET_PRODUCTS_DATA}/${productId}`, {
        cancelToken: cancelToken.token,
      })
      .then(({ data }) => {
        setData(data.data);
        setProductReviewData(data?.data?.reviews || []);
        setProductReviewsRating(
          data?.data?.reviews?.length
            ? (
                data?.data?.reviews
                  ?.map((review) => Number(review.rating))
                  .reduce(
                    (accumulator, currentValue) => accumulator + currentValue,
                    0
                  ) / data?.data?.reviews?.length
              ).toFixed(1)
            : 0
        );
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [productId, reducerValue, userData?.whishlistProducts]);

  const postReview = async (e) => {
    e.preventDefault();
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
        productId: data?._id,
        rating,
        reviewTitle,
        reviewDesc,
        review,
      };
      const cancelToken = axios.CancelToken.source();
      try {
        setIsPostingReview(true);
        const response = await axios.post(POST_PRODUCT_REVIEW, reviewData, {
          cancelToken: cancelToken.token,
        });
        if (response.status === 200) {
          setDialogOpen(false);
          toast({
            title: "Review posted successfully",
          });
          forceUpdate();
          setReview("");
          setReviewTitle("");
          setReviewDesc("");
          setRating();
        }
      } catch (error) {
        if (axios.isCancel(error)) return;
        console.log(error);
      } finally {
        setIsPostingReview(false);
      }
    }
  };

  const addToCart = async () => {
    try {
      setAddingToCart(true);

      if (quantity <= 0) {
        return toast({
          title: `Quantity cannot be 0`,
          variant: "destructive",
        });
      }

      if (data?.productCategory === "clothing" && !size) {
        return toast({
          title: `Please select a size`,
          variant: "destructive",
        });
      }

      const cancelToken = axios.CancelToken.source();
      const response = await axios.post(
        `${ADD_TO_CART}`,
        {
          userId: userData?._id,
          productId,
          size,
          quantity,
        },
        {
          cancelToken: cancelToken.token,
        }
      );

      if(response.status === 200){
        dispatch(setCartItems(response.data.data.cartItems || []))
        toast({
          title: "Product added to cart successfully",
        });
      }

      
    } catch (error) {
      console.log(error);
      toast({
        title: `Failed to add product to cart`,
        variant: "destructive",
      });
    } finally {
      setAddingToCart(false);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="product-conatainer hidden-scrollbar">
      <div className="product-wrapper">
        <div className="product-image-section">
          <div className="multiple-images-carousal">
            <Carousel
              opts={{
                align: "start",
              }}
              orientation="vertical"
              className="w-full max-w-xs"
            >
              <CarouselContent className="-mt-1 h-[300px] md:h-[500px]">
                {data?.productImages?.map((item, index) => (
                  <CarouselItem
                    key={index}
                    className="basis-1/4 lg:basis-1/5"
                  >
                    <div
                      className="p-1 cursor-pointer flex items-center justify-center "
                      onClick={() => setMainImage(item.url)}
                    >
                      <img
                        className="w-[5rem] h-[5rem] object-cover"
                        src={item.url}
                        alt="Dog"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
          <div className="flex items-center justify-center">
            <img
              src={mainImage || data?.productImages[0]?.url}
              alt="PetFood"
              className=" w-[45vw] aspect-square md:w-[25rem] md:h-[25rem] object-cover"
            />
          </div>
        </div>

        <div className="pet-details-box">
          <div className="detail-header">
            <h2>{data?.productName}</h2>
            {productReviewsRating > 0 && (
              <div className="review-box">
                <div className="review-stars">
                  <div className="flex gap-2">
                    {Array.from({
                      length: Math.floor(productReviewsRating),
                    }).map((_, index) => (
                      <FaStar size={15} color="#3a0751" key={index} />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {Array.from({
                      length: 5 - Math.floor(productReviewsRating),
                    }).map((_, index) => (
                      <FaRegStar size={15} key={index} />
                    ))}
                  </div>
                </div>
                <p>{`(${productReviewsRating} / 5 )`}</p>
              </div>
            )}
          </div>

          <div className="price">
            {Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(data?.productPrice)}{" "}
            /-
          </div>

          <div className="description">
            <p>{data?.productSummary}</p>
            {/* <span>Read more</span> */}
          </div>

          {data?.productCategory === "clothing" && (
            <div className="size-options">
              <h3>Size</h3>
              <Select value={size} onValueChange={(value) => setSize(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={null} defaultValue >
                      Select Size
                    </SelectItem>
                    {data?.availableSizes &&
                      data?.availableSizes.length > 0 &&
                      data?.availableSizes.map((size, index) => (
                        <SelectItem key={index} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="quantity-options">
            <h3>Quantity</h3>
            <Input
              placeholder={0}
              type="number"
              value={quantity}
              onChange={(e) => {
                const value = Math.max(0, Number(e.target.value));
                setQuantity(value);
              }}
            />
          </div>

          <Button variant="primary" onClick={addToCart} disabled={addingToCart}>
            Add to cart
          </Button>
        </div>
      </div>

      <div className="outer-wrapper">
        <div className="product-description mb-8">
          <h2 className={"h-3rem text-[1.3rem]  mb-4 font-[500]"}>
            Description
          </h2>
          <p>{data?.productDescription}</p>
        </div>
        <div className="customer-reviews">
          <div className="review-header w-full flex max-[680px]:flex-col justify-between pr-4 mb-8">
            <h2 className={"h-3rem text-[1.3rem]  mb-4 font-[500]"}>
              Customer Reviews
            </h2>
            <div className="flex gap-4 max-[500px]:gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(true)}>
                Write review
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate("product-reviews")}
              >
                View all 
              </Button>
            </div>
            {openDialog && (
              <Dialog open={openDialog} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Write your review</DialogTitle>
                    <DialogDescription>
                      Your review will be shown to other users, so make sure to
                      use appropriate words..
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
          <div className="reviews-container">
            {productReviewData.length > 0 ? (
              productReviewData?.slice(0, 10)?.map((review, index) => (
                <div key={index} className="review">
                  <div className="review-header">
                    <div className="profile-img">
                      <Avatar>
                        <AvatarImage
                          className="object-cover"
                          src={review?.userId?.profilePic?.url}
                        />
                        <AvatarFallback>
                          {review?.userId?.userName
                            .split(" ")
                            .map((name) => name[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="reviewer-name">
                      <div className="review-star-date">
                        <div className="review-star">
                          <div className="flex gap-2">
                            {Array.from({ length: review?.rating }).map(
                              (_, index) => (
                                <FaStar size={15} color="#3a0751" key={index} />
                              )
                            )}
                          </div>
                          <div className="flex gap-2">
                            {Array.from({ length: 5 - review?.rating }).map(
                              (_, index) => (
                                <FaRegStar size={15} key={index} />
                              )
                            )}
                          </div>
                        </div>
                        <p>{moment(review?.createdAt).format("DD/MM/YYYY")}</p>
                      </div>
                      <p className="capitalize">{review?.userId.userName}</p>
                    </div>
                  </div>

                  <div className="review-body">
                    <h2 className="review-title">{review?.title}</h2>
                    <p className="review-desc">{review?.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div>No Reviews yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
