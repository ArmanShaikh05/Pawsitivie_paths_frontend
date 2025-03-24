import AppointmentScheduler from "@/components/AppointmentSchedular/AppointmentSchedule";
import PetCard from "@/components/Cards/PetCard/PetCard";
import Loader from "@/components/Loader/Loader";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CREATE_SHOP_APPOINTMENT,
  DISLIKE_PET,
  GET_SHOP_PETS_DATA,
  LIKE_PET,
  POST_PET_REVIEW
} from "@/constants/routes";
import { useToast } from "@/hooks/use-toast";
import { setUserDetails } from "@/redux/reducers/userDetailsSlice";
import { addOneHourToTime } from "@/utils/features";
import axios from "axios";
import moment from "moment";
import { useEffect, useReducer, useState } from "react";
import {
  FaFacebook,
  FaHeart,
  FaInstagram,
  FaLink,
  FaRegHeart,
  FaRegStar,
  FaShareAlt,
  FaStar,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "./singlepet.scss";

const SinglePet = () => {
  const { petId } = useParams();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userDetailReducer.userData);
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  // const { data: CategoryPets } = useFetch(
  //   `${GET_SHOP_PETS_BY_QUERY}?category=${data?.petCategory}`
  // );
  const [mainImage, setMainImage] = useState(data?.petImages[0]?.url);

  const [openDialog, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const [liked, setLiked] = useState(false);

  const [rating, setRating] = useState();
  const [review, setReview] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewDesc, setReviewDesc] = useState("");
  const [isPostingReview, setIsPostingReview] = useState(false);

  const [petReviewsData, setPetReviewsData] = useState([]);
  const [petReviewsRating, setPetReviewsRating] = useState();

  // Appointment States
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [openAppointmentDialog, setOpenAppointmentDialog] = useState(false);

  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [meetingDescription, setMeetingDescription] = useState("");

  const [email, setEmail] = useState(userData?.email || "");
  const [phone, setPhone] = useState(userData?.phone || "");
  const [shopId, setShopId] = useState("");

  const [isCreatingAppointment, setIsCreatingAppointment] = useState(false);
  const [recommendedPets, setRecommendedPets] = useState([])

  useEffect(() => {
    setLoading(true);
    const cancelToken = axios.CancelToken.source();
    axios
      .get(`${GET_SHOP_PETS_DATA}/${petId}`, { cancelToken: cancelToken.token })
      .then(({ data }) => {
        setData(data.data);
        setPetReviewsData(data?.data?.reviews || []);
        setPetReviewsRating(
          (
            data?.data?.reviews
              ?.map((review) => Number(review.rating))
              .reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0
              ) / data?.data?.reviews?.length
          ).toFixed(1) || 0
        );
        setRecommendedPets(data?.recommendedPets || []);
        setLoading(false);
        setLiked(
          userData?.whishlistPets.includes(data.data?._id) ? true : false
        );
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [petId, reducerValue]);

  const addPetToWhishlist = async () => {
    try {
      const cancelToken = axios.CancelToken.source();
      const { data: wishlistData } = await axios.get(
        `${LIKE_PET}?userId=${userData?._id}&petId=${data?._id}`,
        {
          cancelToken: cancelToken.token,
        }
      );
      if (wishlistData) {
        dispatch(setUserDetails(wishlistData.data));
        setLiked(true);
        forceUpdate();
        toast({
          title: "Pet added to whishlist",
        });
      }
    } catch (error) {
      if (axios.isCancel(error)) return;
      console.log(error);
    }
  };

  const removePetFromWhishlist = async () => {
    try {
      const cancelToken = axios.CancelToken.source();
      const { data: wishlistData } = await axios.get(
        `${DISLIKE_PET}?userId=${userData?._id}&petId=${data?._id}`,
        {
          cancelToken: cancelToken.token,
        }
      );
      if (wishlistData) {
        dispatch(setUserDetails(wishlistData.data));
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
        petId: data?._id,
        rating,
        reviewTitle,
        reviewDesc,
        review,
      };
      const cancelToken = axios.CancelToken.source();
      try {
        setIsPostingReview(true);
        const response = await axios.post(POST_PET_REVIEW, reviewData, {
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
        }
      } catch (error) {
        if (axios.isCancel(error)) return;
        console.log(error);
      } finally {
        setIsPostingReview(false);
      }
    }
  };

  const createAppointment = async () => {
    const todayDate = new Date();
    if (
      userFirstName === "" ||
      userLastName === "" ||
      email === "" ||
      phone === ""
    ) {
      return toast({
        title: "Please enter all user details",
        variant: "destructive",
      });
    }

    if (selectedDate === "" || selectedTime === "") {
      return toast({
        title: "Please select appointment date and time",
        variant: "destructive",
      });
    }

    if (selectedDate < todayDate) {
      return toast({
        title:
          "Cannot schedule appointment in past date. Please select appropriate date",
        variant: "destructive",
      });
    }

    try {
      setIsCreatingAppointment(true);
      const cancelToken = axios.CancelToken.source();
      const response = await axios.post(
        CREATE_SHOP_APPOINTMENT,
        {
          userId: userData?._id,
          shopOwnerId: shopId,
          description: meetingDescription,
          startTime: selectedTime,
          endTime: addOneHourToTime(selectedTime),
          clientDetails: {
            firstName: userFirstName,
            lastName: userLastName,
            email: email,
            phoneNo: phone,
          },
          subject: "Pet Adoption",
          appointmentDate: selectedDate,
          resources: {
            petId: petId,
          },
        },
        { cancelToken: cancelToken.token }
      );

      if (response.status === 200) {
        setUserFirstName("");
        setUserLastName("");
        setSelectedTime("");
        setMeetingDescription("");
        setOpenAppointmentDialog(false);
        setSelectedDate(new Date());
        toast({
          title: "Created appointment",
        });
      }
    } catch (error) {
      if (axios.isCancel(error)) return;
      if (error.response.status === 409) {
        return toast({
          title: "You already have an appointment at this time",
          variant: "destructive",
        });
      }
      console.log(error.response);
    } finally {
      setIsCreatingAppointment(false);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="single-page hidden-scrollbar">
      <div className="single-pet-container">
        <div className="pet-images-section">
          <img
            src={mainImage || data?.petImages[0]?.url}
            alt=""
            className="full-size-image"
          />
          <div className="image-carousels">
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full"
            >
              <CarouselContent>
                {data?.petImages?.map((item, index) => (
                  <CarouselItem
                    key={index}
                    className="max-[580px]:basis-1/2 basis-1/4 "
                  >
                    <div
                      onClick={() => setMainImage(item.url)}
                      className="p-1 cursor-pointer"
                    >
                      <img src={item.url} alt="Dog" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
          {liked ? (
            <FaHeart onClick={removePetFromWhishlist} size={28} color="red" />
          ) : (
            <FaRegHeart onClick={addPetToWhishlist} size={28} />
          )}

          <div className="share-footer">
            <div className="share-icon">
              <FaShareAlt size={20} />
              <p>Share:</p>
            </div>
            <div className="share-handles">
              <FaFacebook size={22} />
              <FaInstagram size={22} />
              <FaXTwitter size={22} />
              <FaLink size={22} />
            </div>
          </div>
        </div>

        <div className="pet-details-section">
          {/* <p className="username text-sm">#1212125</p> */}
          <h2>{data?.petName}</h2>
          <h4>{data?.petPrice} /-</h4>

          {petReviewsData.length > 0 ? (
            <Badge className="rating-badge" variant="default">
              {`${petReviewsRating} / 5`}
            </Badge>
          ) : (
            <Badge className="rating-badge" variant="default">
              No Reviews Yet
            </Badge>
          )}

          {data?.petGender && data?.petGender !== "" && (
            <div className="details-row capitalize">
              <p>
                Gender <span>:</span>
              </p>
              <p>{data?.petGender}</p>
            </div>
          )}

          {data?.petAge && data?.petAge !== "" && (
            <div className="details-row">
              <p>
                Age <span>:</span>
              </p>
              <p>{data?.petAge} Years</p>
            </div>
          )}

          {data?.petSize && data?.petSize !== "" && (
            <div className="details-row">
              <p>
                Size <span>:</span>
              </p>
              <p>{data?.petSize}</p>
            </div>
          )}

          {data?.petColor && data?.petColor !== "" && (
            <div className="details-row">
              <p>
                Color <span>:</span>
              </p>
              <p>{data?.petColor}</p>
            </div>
          )}

          <div className="details-row">
            <p>
              Vaccinated <span>:</span>
            </p>
            <p>{data?.isVaccinated ? "Yes" : "No"}</p>
          </div>

          <div className="details-row">
            <p>
              Dewormed <span>:</span>
            </p>
            <p>{data?.isDewormed ? "Yes" : "No"}</p>
          </div>

          {data?.petAddress && data?.petAddress !== "" && (
            <div className="details-row">
              <p>
                Location <span>:</span>
              </p>
              <p>{data?.petAddress}</p>
            </div>
          )}

          <div className="details-row">
            <p>
              Published Date <span>:</span>
            </p>
            <p>{moment(data?.createdAt).format("DD-MM-YYYY")}</p>
          </div>

          <div className="grid grid-cols-2 items-center gap-8 max-[450px]:flex max-[450px]:flex-col">
            <Button
              variant="outline"
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

            {/* SHOW APPOINTMENT MODEL */}
            <AlertDialog
              open={openAppointmentDialog}
              onOpenChange={setOpenAppointmentDialog}
            >
              <AlertDialogTrigger asChild>
                <Button
                  variant="primary"
                  className="h-[3rem] text-xs lg:text-sm w-max p-2"
                >
                  Schedule Appointment
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-max h-[43rem] overflow-auto hidden-scrollbar">
                <AlertDialogHeader className={"h-10"}>
                  <AlertDialogTitle>Schedule Appointment</AlertDialogTitle>
                  <AlertDialogDescription>
                    <div></div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                {/* Appointment schedular */}
                <AppointmentScheduler
                  petId={petId}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  setSelectedDate={setSelectedDate}
                  setSelectedTime={setSelectedTime}
                  email={email}
                  setEmail={setEmail}
                  phone={phone}
                  setPhone={setPhone}
                  userFirstName={userFirstName}
                  setUserFirstName={setUserFirstName}
                  userLastName={userLastName}
                  setUserLastName={setUserLastName}
                  meetingDescription={meetingDescription}
                  setMeetingDescription={setMeetingDescription}
                  setShopId={setShopId}
                />
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>

                  <Button
                    disabled={isCreatingAppointment}
                    onClick={() => createAppointment()}
                    variant={"primary"}
                  >
                    Create Appointment
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {data?.petDescription && data?.petDescription !== "" && (
        <div className="pet-description">
          <h2>Pet Description</h2>
          <p>{data?.petDescription}</p>
        </div>
      )}

      {recommendedPets && recommendedPets?.length > 0 && (
        <div className="similar-pets">
          <p>whats new?</p>
          <h2>See more pets</h2>
          <div className="testimonial-carousels">
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full"
            >
              <CarouselContent>
                {recommendedPets?.map((pet, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/4"
                  >
                    <PetCard petData={pet} path={`/pets/${pet?._id}`} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:block" />
              <CarouselNext className="hidden sm:block" />
            </Carousel>
          </div>

          <Button className="view-all-badge" variant="default" onClick={()=>navigate("/pets")}>
            View All
          </Button>
        </div>
      )}

      <div className="customer-reviews">
        <div className="review-header w-full flex justify-between items-center pr-4 mb-8">
          <h2
            className={"h-3rem text-[1.3rem]  mb-4 font-[500] styled-heading"}
          >
            Customer Reviews
          </h2>
          <Button variant="primary" onClick={() => navigate("pet-reviews")}>
            View All
          </Button>
        </div>
        <div className="reviews-container">
          {petReviewsData.length > 0 ? (
            petReviewsData?.slice(0, 10)?.map((review, index) => (
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
                      <p className="text-xs md:text-sm">{moment(review?.createdAt).format("DD/MM/YYYY")}</p>
                    </div>
                    <p className="capitalize max-[500px]:text-sm">{review?.userId?.userName}</p>
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
  );
};

export default SinglePet;
